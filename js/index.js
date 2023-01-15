class Mock {
    rules = []
    currentKey = ''
    currentRule = null

    currentTab = null

    constructor() {
        chrome.tabs.query({active: true, currentWindow: true}, (tab) => {//获取当前tab
            this.currentTab = tab[0]
            this.renderTitle(tab[0].title)
            this.currentKey = tab[0].url
            this.currentKey = this.currentKey.split('?')[0]

            chrome.runtime.sendMessage('', {
                key: 'getStorageMockRules',
                args: []
            }).then(result => {
                this.rules = result
                console.log(result)
                let currentRule = this.rules.filter(item => item.pageUrl === this.currentKey)[0]
                if (currentRule) {
                    this.currentRule = currentRule
                }
                this.renderRuleUl()

            })


            document.querySelector('#btn-create').addEventListener('click', () => {
                this.handleCreateRule()
            })
            document.querySelector('#btn-option').addEventListener('click', () => {
                chrome.runtime.openOptionsPage()
            })
        });
    }


    handleCreateRule() {
        chrome.scripting.executeScript({
            target: {tabId: this.currentTab.id},
            func: newRuleForm,
            args: [this.currentTab]
        })
    }

    handleEditRule(data) {
        chrome.scripting.executeScript({
            target: {tabId: this.currentTab.id},
            func: newRuleForm,
            args: [this.currentTab, data]
        })
    }

    renderTitle(title) {
        document.querySelector("#current-tab-name").innerText = title
    }

    renderRuleUl() {
        if (this.currentRule === null) {
            document.querySelector('#rule-list').innerHTML = `<div class="empty-item">空数据</div>`
        }
        let el = document.querySelector('#rule-list');
        el.innerHTML = ``
        this.currentRule.rules.forEach((item, index) => {
            let itemEl = document.createElement('div'),
                nameEl = document.createElement('span')
            itemEl.classList.add('rule-item')
            nameEl.innerText = item.name

            nameEl.addEventListener('click', () => {
                chrome.runtime.sendMessage('', {key: 'setMock', data: item})
            })

            itemEl.appendChild(nameEl)

            let actionBox = document.createElement('div'),
                editButton = document.createElement('button'),
                deleteButton = document.createElement('button')
            editButton.innerText = '编辑'
            editButton.classList.add('btn-text')
            editButton.addEventListener('click', () => {
                this.handleEditRule(item)
            })

            deleteButton.innerText = '删除'
            deleteButton.classList.add('btn-text')
            deleteButton.classList.add('btn-delete')
            deleteButton.addEventListener('click', () => {
                this.currentRule.rules.splice(index, 1)
                chrome.runtime.sendMessage('', {
                    key: 'updateStorageMockRulesByPageRule',
                    args: [this.currentRule]
                }).then(() => {
                    this.renderRuleUl()
                })
            })

            actionBox.appendChild(editButton)
            actionBox.appendChild(deleteButton)

            itemEl.appendChild(actionBox)

            el.appendChild(itemEl)
        })


    }

}


new Mock()

function newRuleForm(tab, rule) {
    class RuleForm {
        rule = {
            id: '',
            key: '',
            name: '',
            items: []
        }
        callback = null

        currentTab = null

        containerId = 'ts-mock-container'

        mockList = []

        $el = null

        listenBodyClickEvent = null
        documentMouseUpEvent = null
        documentMouseMoveEvent = null

        containerStyle = null


        constructor(currentTab, rule = null, callback = null) {
            if (rule != null) {
                this.rule = rule
            } else {
                this.rule.id = this.getId()
                this.rule.key = currentTab.url
            }
            this.rule.title = currentTab.title
            this.render()
            /*window.addEventListener('blur',() => {
                console.log(document.activeElement)
            })*/
            //mousedown
            this.listenBodyClickEvent = listen(document.body, 'mousedown', e => {
                // console.log(e)
                this.resolveElement(e.target)
            })


            chrome.runtime.sendMessage('', 'getMockListTree').then(res => {
                this.mockList = res
            })
        }

        /**
         * 随机生成字符串
         * @param {Number} min 字符串最小长度，默认32位
         * @param {Number} max 字符串最大长度，默认等于最小长度
         */
        getId(min = 32, max = 32) {
            min = min || 32;
            max = max || min;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var result = '';
            let range = min;
            if (min !== max) {
                range = Math.round(Math.random() * (max - min)) + min;
            }
            for (let i = 0; i < range; i++) {
                result += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return result;
        }


        handleClose() {
            if (this.listenBodyClickEvent) this.listenBodyClickEvent.remove()
            if (this.documentMouseMoveEvent) this.documentMouseMoveEvent.remove()
            if (this.documentMouseUpEvent) this.documentMouseUpEvent.remove()
            if (this.$el) this.$el.parentNode.removeChild(this.$el)
            this.containerStyle = null
        }

        handleSave() {
            if (!this.rule.name) {
                alert('请输入名称')
                return false
            }

            if (this.rule.items.some(item => !item.name)) {
                alert('请输入规则项名称')
                return false
            }
            if (this.rule.items.some(item => !item.mockKey)) {
                alert('请选择规则项Mock')
                return false
            }

            chrome.runtime.sendMessage('', {
                key: 'setStorageMockRulesByPageRule',
                args: [this.rule]
            }).then(() => {
                if (this.listenBodyClickEvent) this.listenBodyClickEvent.remove()
                if (this.documentMouseMoveEvent) this.documentMouseMoveEvent.remove()
                if (this.documentMouseUpEvent) this.documentMouseUpEvent.remove()
                if (this.$el) this.$el.parentNode.removeChild(this.$el)
                this.containerStyle = null
            })


            /*chrome.storage.local.get(['MockRules']).then((result) => {
                result = result.MockRules || []
                let currentPageRule = null, index = -1;
                currentPageRule = result.filter(item => item.pageUrl === this.rule.key)[0]
                for (let i in result) {
                    if (result[i].pageUrl === this.rule.key) {
                        currentPageRule = result[i]
                        index = Number(i)
                        break
                    }
                }

                if (!currentPageRule) {
                    result.push({
                        pageUrl: this.rule.key,
                        rules: [this.rule]
                    })
                } else {
                    let flag = false
                    // 判断rules
                    currentPageRule.rules = currentPageRule.rules.map(item => {
                        if (item.id === this.rule.id) {
                            flag = true
                            return this.rule
                        }
                        return item
                    })
                    if (!flag) {
                        currentPageRule.rules.push(this.rule)
                    }
                    result[index] = currentPageRule
                }
                chrome.storage.local.set({MockRules: result})
            });*/


        }

        render() {
            //  清除旧的
            let old = document.querySelector('body>#ts-mock-container')
            if (old) {
                old.parentNode.removeChild(old)
            }

            let container = document.createElement('div')
            container.id = 'ts-mock-container'
            container.classList.add('ts-mock-container')
            let cssText = `width: 300px;min-height: 300px;position: fixed;top: 30px;right: 30px;padding:0 12px 50px 12px;background-color: #fff;box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;z-index:999999;`;

            if (this.containerStyle) {
                cssText += `left: ${this.containerStyle.left};`
                cssText += `top: ${this.containerStyle.top};`
            }
            container.style.cssText = cssText

            container.appendChild(this.renderHeader(container))
            container.appendChild(this.renderNameInput())
            container.appendChild(this.renderTip())

            let tableContainer = createElement({
                tagName: 'div',
            })
            if (this.isLoaded) {
                tableContainer.appendChild(this.renderItemList())
            } else {
                setTimeout(() => {
                    tableContainer.appendChild(this.renderItemList())
                }, 50)
            }

            container.appendChild(tableContainer)

            container.appendChild(this.renderStyle())
            container.appendChild(this.renderFooter())

            this.$el = container
            this.isLoaded = true
            document.querySelector('body').appendChild(container)
        }

        renderStyle() {
            let styles = [
                {
                    key: 'table',
                    value: 'border-collapse: collapse;'
                },
                {
                    key: ['table td', 'table th'],
                    value: `border: 1px solid #cad9ea;color: #666;height: 30px;`
                },
                {
                    key: 'table thead th',
                    value: `background-color: #CCE8EB;max-width: 80px;`
                },
                {
                    key: 'table tr:nth-child(odd)',
                    value: 'background: #fff;'
                },
                {
                    key: 'table tr:nth-child(even)',
                    value: 'background: #F5FAFA;'
                },
                {
                    key: 'table tr input',
                    value: 'width:80px;'
                },
                {
                    key: 'input',
                    value: `-webkit-appearance: none;background-color: #fff;background-image: none;border-radius: 4px;border: 1px solid #dcdfe6;box-sizing: border-box;color: #606266;display: inline-block;font-size: inherit;height: 30px;line-height: 30px;outline: none;padding: 0 3px;transition: border-color .2s cubic-bezier(.645,.045,.355,1);`
                },
                {
                    key: 'button',
                    value: `display: inline-block;line-height: 1;white-space: nowrap;cursor: pointer;background: #fff;border: 1px solid #dcdfe6;color: #606266;-webkit-appearance: none;text-align: center;box-sizing: border-box;outline: none;margin: 5px;transition: .1s;font-weight: 500;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;padding: 7px 15px;font-size: 12px;border-radius: 3px;`
                },
                {
                    key: 'button:hover',
                    value: `color:#409EFF;border-color:#c6e2ff;background-color:#ecf5ff;`
                },
                {
                    key: '.mock-container-select-mock',
                    value: `width: 80px;background:#fff;display: flex;flex-wrap: nowrap;position: relative;cursor: pointer;text-align: center;font-size:12px;line-height:20px`
                },

                {
                    key: ['.mock-container-select-mock:hover .mock-container-select-mock-list', '.mock-container-select-mock .mock-container-select-mock-list li:hover > .mock-children'],
                    value: 'display: block;'
                },
                {
                    key: '.mock-container-select-mock .mock-container-select-mock-list',
                    value: `position: absolute;left: 0;top: 0;display: none;z-index:999999;`
                },
                {
                    key: '.mock-container-select-mock .mock-container-select-mock-list li',
                    value: `list-style: none;position: relative;cursor: pointer;width: 80px;border: 1px solid #eee;text-align: center;background-color: #fff;display: flex;justify-content: space-between;flex-wrap: nowrap;`
                },
                {
                    key: '.mock-container-select-mock .mock-container-select-mock-list li>span',
                    value: `overflow: hidden; white-space: nowrap; text-overflow: ellipsis;padding:0 6px`
                },
                {
                    key: '.mock-container-select-mock .mock-container-select-mock-list li:hover',
                    value: `background-color: #DCDFE6;transition: background-color .5s;`
                },
                {
                    key: '.mock-container-select-mock .mock-container-select-mock-list li:hover>span',
                    value: `color:#409eff;`
                },
                {
                    key: '.mock-container-select-mock .mock-container-select-mock-list .mock-children',
                    value: `position: absolute;width: 80px;right: -80px;top: 0;display: none;`
                }
            ]
            let styleEl = document.createElement('style')
            let styleText = ''
            styles.forEach(item => {
                let key = ''
                if (typeof item.key === 'string') {
                    key = `body>#${this.containerId} ${item.key}`
                } else {
                    key = item.key.map(value => {
                        return `body>#${this.containerId} ${value}`
                    }).join(',')
                }
                styleText += `${key} {${item.value}}\n`
            })
            styleEl.innerHTML = styleText

            return styleEl
        }


        renderHeader(container) {
            let header = createElement({
                tagName: 'div',
                style: `width:100%;height:30px;line-height:30px;display:flex;justify-content: space-between;flex-warp:nowrap;cursor:move;`,
                children: [
                    {
                        tagName: 'span',
                        text: '编辑Mock规则',
                        style: 'font-weight:bold;'
                    },
                    {
                        tagName: 'span',
                        text: 'x',
                        style: `cursor: pointer;`,
                        events: {
                            click: () => {
                                this.handleClose()
                            }
                        }
                    }
                ]
            })
            // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
            const getStyle = (function () {
                if (window.document.currentStyle) {
                    return (dom, attr) => dom.currentStyle[attr]
                } else {
                    return (dom, attr) => getComputedStyle(dom, false)[attr]
                }
            })()
            header.onmousedown = (e) => {
                // 鼠标按下，计算当前元素距离可视区的距离
                const disX = e.clientX - header.offsetLeft
                const disY = e.clientY - header.offsetTop

                const dragDomWidth = container.offsetWidth
                const dragDomHeight = container.offsetHeight

                const screenWidth = document.body.clientWidth
                const screenHeight = document.body.clientHeight

                const minDragDomLeft = container.offsetLeft
                const maxDragDomLeft = screenWidth - container.offsetLeft - (dragDomWidth / 2)

                const minDragDomTop = container.offsetTop
                const maxDragDomTop = screenHeight - container.offsetTop - (dragDomHeight / 2)

                // 获取到的值带px 正则匹配替换
                let styL = getStyle(container, 'left')
                let styT = getStyle(container, 'top')

                if (styL.includes('%')) {
                    styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
                    styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
                } else {
                    styL = +styL.replace(/\px/g, '')
                    styT = +styT.replace(/\px/g, '')
                }
                this.documentMouseMoveEvent = listen(document, 'mousemove', e => {
                    // 通过事件委托，计算移动的距离
                    let left = e.clientX - disX
                    let top = e.clientY - disY

                    // 边界处理
                    if (-(left) > minDragDomLeft) {
                        left = -minDragDomLeft
                    } else if (left > maxDragDomLeft) {
                        left = maxDragDomLeft
                    }

                    if (-(top) > minDragDomTop) {
                        top = -minDragDomTop
                    } else if (top > maxDragDomTop) {
                        top = maxDragDomTop
                    }

                    // 移动当前元素
                    container.style.left = `${left + styL}px`
                    container.style.top = `${top + styT}px`
                    this.containerStyle = {
                        left: `${left + styL}px`,
                        top: `${top + styT}px`
                    }

                    // dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

                    // emit onDrag event

                    // vnode.child.$emit('dragDialog', e)
                })

                this.documentMouseUpEvent = listen(document, 'mouseup', () => {
                    if (this.documentMouseMoveEvent) this.documentMouseMoveEvent.remove()
                    if (this.documentMouseUpEvent) this.documentMouseUpEvent.remove()
                })
            }


            return header
        }

        renderNameInput() {
            let nameInputContainer = document.createElement('div')
            let label = document.createElement('span')
            label.innerText = '名称:'

            let input = document.createElement('input')
            input.value = this.rule.name
            input.onchange = (e) => {
                this.rule.name = input.value
            }
            nameInputContainer.appendChild(label)
            nameInputContainer.appendChild(input)

            return nameInputContainer
        }

        renderTip() {
            let tipText = document.createElement('div')
            tipText.style.cssText = `width:100%;font-size:12px;color:#5e6d82;line-height:24px;`;
            tipText.innerText = '注：点击页面上的控件来添加控件';
            return tipText
        }

        renderFooter() {
            let footer = createElement({
                tagName: 'div',
                style: `width:100%;text-align: center;position: absolute;left: 0;bottom: 12px;`,
                children: [
                    {
                        tagName: 'button',
                        text: '关闭',
                        events: {
                            click: () => {
                                this.handleClose()

                            }
                        }
                    },
                    {
                        tagName: 'button',
                        text: 'Mock',
                        events: {
                            click: () => {
                                chrome.runtime.sendMessage('', {key: 'setMock', data: this.rule})
                            }
                        }
                    },
                    {
                        tagName: 'button',
                        text: '保存',
                        events: {
                            click: () => {
                                this.handleSave()

                            }
                        }
                    },

                ]
            })

            return footer
        }

        renderItemList() {
            let tableList = createElement({
                tagName: 'table',
                classList: `${this.containerId}-rule-item-list`,
                style: `width: 270px;order-collapse: collapse;margin: 0 auto;text-align: center;`,
                children: [
                    {
                        tagName: 'thead',
                        html: `<tr><td>名称</td><td>模拟规则</td><td>操作</td></tr>`
                    }
                ]
            })

            let tbody = document.createElement('tbody')


            this.rule.items.forEach((item, index) => {
                let ruleItem = document.createElement('tr')
                ruleItem.classList.add(`${this.containerId}-rule-item`)

                let nameInputTd = document.createElement('td'),
                    nameInput = document.createElement('input')
                nameInputTd.style.cssText = 'width:120px;text-align:center;'
                nameInput.value = item.name
                nameInput.style.cssText = `border:0px;width:100%;text-align:center;`
                nameInput.onchange = () => {
                    item.name = nameInput.value
                    this.render()
                }
                nameInputTd.appendChild(nameInput)
                ruleItem.appendChild(nameInputTd)

                let mockKeyInputTd = document.createElement('td')
                let typeText = {
                    radio: '单选框',
                    checkbox: '多选框',
                    switch: '开关',
                    elSelect: '下拉框随机'
                }
                if (typeText[item.type]) {
                    mockKeyInputTd.appendChild(createElement({
                        tagName: 'span',
                        style: 'cursor:not-allowed ',
                        text: `${typeText[item.mockName]}随机`
                    }))
                } else {
                    mockKeyInputTd.appendChild(this.getSelectElement(item.key, item.mockName || '请选择'))
                }
                ruleItem.appendChild(mockKeyInputTd)

                let actionTd = document.createElement('td'),
                    actionButton = document.createElement('button')
                actionTd.style.cssText = `width:45px;`
                actionButton.style.cssText = `display: inline-block;line-height: 1;white-space: nowrap;cursor: pointer;-webkit-appearance: none;text-align: center;box-sizing: border-box;outline: none;margin: 0;transition: .1s;font-weight: 500;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;font-size: 12px;border-radius: 4px;border-color: transparent;color: #f56c6c;background: transparent;padding: 0;`
                actionButton.innerText = '删除'
                actionButton.onclick = () => {
                    this.rule.items.splice(index, 1)
                    this.render()
                }
                actionTd.appendChild(actionButton)
                ruleItem.appendChild(actionTd)

                tbody.appendChild(ruleItem)
            })
            tableList.appendChild(tbody)


            return tableList
        }

        getSelectElement(key, value) {
            let box = createElement({
                tagName: 'div',
                classList: 'mock-container-select-mock',
                children: [
                    {
                        tagName: 'span',
                        text: value
                    }
                ]
            })


            let ul = createElement({
                tagName: 'ul',
                classList: 'mock-container-select-mock-list'
            })

            for (let item of this.mockList) {
                let li = this.getSelectLiElement(item, key)
                ul.appendChild(li)
            }

            box.appendChild(ul)


            return box
        }


        getSelectLiElement(item, key) {
            let li = createElement({tagName: 'li', children: [{tagName: 'span', text: item.title}]})
            if (item.hasHandle) {
                li.addEventListener('click', () => {
                    let index = this.getRuleItemIndexByKey(key)
                    this.rule.items[index].mockKey = item.id
                    this.rule.items[index].mockName = item.title
                    this.render()
                })
            }

            if (item.children && item.children.length > 0) {
                li.appendChild(createElement({
                    tagName: 'span',
                    text: '>'
                }))
                li.appendChild(this.getSelectMenuChildren(item.children, key))
            }
            return li
        }

        /**
         * 获取选择模拟子菜单
         * @param children
         * @param key
         * @returns {*}
         */
        getSelectMenuChildren(children, key) {
            let ul = createElement({
                tagName: 'ul',
                classList: 'mock-children'
            })
            for (let item of children) {
                let li = this.getSelectLiElement(item, key)
                ul.appendChild(li)
            }
            return ul
        }

        /**
         * 解析点击元素
         * @param {Element} target
         */
        resolveElement(target) {

            // 判断是不是当前弹出层
            if (this.checkIsContainer(target)) {
                return false
            }
            if (this.resolveElementUIElement(target)) {
                return true
            }


            if (['INPUT', 'TEXTAREA'].indexOf(target.tagName) > -1) {
                if (['checkbox', 'radio'].indexOf(target.getAttribute('type')) === -1) {
                    let realPath = this.getDomPath(target)
                    let name = ''
                    if (target.getAttribute('placeholder')) {
                        name = target.getAttribute('placeholder').replace('请选择', '').replace('请输入', '').replace('Please enter', '').replace('please enter', '')
                    }
                    this.pushRuleItem(target.tagName, realPath, name)
                }
            }

            this.render()
        }

        /*
        getRealPath(el, realPath) {
            if (el.tagName === 'HTML') return realPath
            realPath = `${this.getElementIdentification(el)} ${realPath}`;
            let parentNode = el.parentNode
            if (parentNode) {
                return this.getRealPath(parentNode, realPath)
            }
            return realPath
        }

        // 获取标签标识
        getElementIdentification(el) {
            let identity = el.tagName.toLowerCase()
            if (el.getAttribute('id')) {
                identity += `#${el.getAttribute('id')}`
            }
            el.classList.forEach(value => {
                if (value.indexOf('hover') === -1 && value.indexOf('focus') === -1) {
                    identity += `.${value}`
                }
            })
            if (el.getAttribute('for')) {
                identity += `[for=${el.getAttribute('for')}]`
            }
            if (el.getAttribute('name')) {
                identity += `[name=${el.getAttribute('name')}]`
            }
            return identity
        }*/

        getDomPath(el) {
            if (!el) {
                return;
            }
            let stack = [];
            let isShadow = false;
            while (el.parentNode != null) {
                let sibCount = 0;
                let sibIndex = 0;
                // get sibling indexes
                for (let i = 0; i < el.parentNode.childNodes.length; i++) {
                    let sib = el.parentNode.childNodes[i];
                    if (sib.nodeName == el.nodeName) {
                        if (sib === el) {
                            sibIndex = sibCount;
                        }
                        sibCount++;
                    }
                }
                // if ( el.hasAttribute('id') && el.id != '' ) { no id shortcuts, ids are not unique in shadowDom
                //   stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
                // } else
                let nodeName = el.nodeName.toLowerCase();
                if (isShadow) {
                    nodeName += "::shadow";
                    isShadow = false;
                }
                if (sibCount > 1) {
                    stack.unshift(nodeName + ':nth-of-type(' + (sibIndex + 1) + ')');
                } else {
                    stack.unshift(nodeName);
                }
                el = el.parentNode;
                if (el.nodeType === 11) { // for shadow dom, we
                    isShadow = true;
                    el = el.host;
                }
            }
            stack.splice(0, 1); // removes the html element
            return stack.join(' > ');
        }

        resolveElementUIElement(target) {
            let type = 'input', name = ''
            if (target.classList.contains('el-checkbox__label') || target.classList.contains('el-checkbox__inner')) {
                target = target.parentNode.parentNode
                if (target.classList.contains('el-checkbox')) target = target.parentNode
                type = 'checkbox'
            } else if (target.classList.contains('el-radio__label') || target.classList.contains('el-radio__inner')) {
                target = target.parentNode.parentNode
                if (target.classList.contains('el-radio')) target = target.parentNode
                type = 'radio'
            } else if (target.classList.contains('el-input__inner') && target.parentNode?.parentNode?.classList.contains('el-select')) {
                name = this.resolveInputPlaceholder(target)
                target = target.parentNode.parentNode
                type = 'elSelect'
            } else if (target.classList.contains('el-input__inner') || target.classList.contains('el-textarea__inner')) {
                type = 'input'
            } else if (target.classList.contains('el-switch__core')) {
                type = 'switch'
            } else {
                return false
            }
            let realPath = this.getDomPath(target)

            switch (type) {
                case 'checkbox':
                    realPath += ` .el-checkbox__original`
                    break
                case 'radio':
                    realPath += ` .el-radio__original`
                    break
                case 'elSelect':
                    break
                default:
                    break
            }
            if (!name) name = this.resolveInputPlaceholder(target) || getFormItemLabel(target)

            let typeText = {
                radio: '单选框',
                checkbox: '多选框',
                switch: '开关',
                elSelect: '下拉框随机'
            }

            this.pushRuleItem(target.tagName, realPath, name, type, typeText[type] || '')
            this.render()

            function getFormItemLabel(el, deep = 4) {
                while (deep > 0) {
                    if (el.classList.contains('el-form-item')) {
                        return el.querySelector('.el-form-item__label')?.innerText
                    }
                    deep--
                    el = el.parentNode
                }
                return ''
            }


            /*let elementUIInputTypeClass = ['el-input__inner', 'el-textarea__inner', 'el-radio__original', 'el-checkbox__original', 'el-switch__input', 'el-select','el-checkbox-group'],
                parentNodeTypeClass = ['el-date-editor', 'el-input'],
                inputTypeClassName = '',
                parentNodeClassName = '',
                type = 'input'
            if (target.classList.contains('el-form-item__label') || target.classList.contains('el-switch__core')) {
                if (target.parentNode.querySelector('.el-select')) {
                    target = target.parentNode.querySelector('.el-select')
                } else {
                    target = target.parentNode.querySelector('input')
                }

            } else if (target.classList.contains('el-input__inner')) {
                if (target.parentNode?.parentNode?.classList.contains('el-select')) {
                    target = target.parentNode.parentNode
                }
            }else if(target.classList.contains('el-checkbox__label') || target.classList.contains('el-checkbox__inner')){
                target = target.parentNode.parentNode
                if(target.classList.contains('el-checkbox__inner')) target = target.parentNode
            }


            console.log('target', target)
            for (let value of elementUIInputTypeClass) {
                if (target.classList.contains(value)) {
                    inputTypeClassName = value
                    break
                }
            }
            switch (inputTypeClassName) {
                case 'el-radio__original':
                    type = 'radio'
                    break
                case 'el-checkbox-group':
                    type = 'checkbox'
                    break
                case 'el-checkbox__original':
                    type = 'checkbox'
                    break
                case 'el-switch__input':
                    type = 'switch'
                    break
                case 'el-select':
                    type = 'elSelect'
                    break
                default:
                    type = 'input'
                    break
            }*/
            /*// let type = 'input'
            let parentNode = target.parentNode

            for (let value of parentNodeTypeClass) {
                if (parentNode.classList.contains(value)) {
                    parentNodeClassName = `.${value}`
                    break
                }
            }

            let label = parentNode


            if (parentNode.classList.contains('el-date-editor')) {
                label = label.parentNode?.parentNode?.parentNode?.querySelector('.el-form-item__label')
            } else if (target.classList.contains('el-select')) {
                label = label.parentNode?.querySelector('.el-form-item__label')
            } else if (parentNode.classList.contains('el-radio__input')) {
                label = label.parentNode?.parentNode?.parentNode?.parentNode?.querySelector('.el-form-item__label')
            } else if (parentNode.classList.contains('el-checkbox__input')) {
                label = label.parentNode?.parentNode?.parentNode?.parentNode?.querySelector('.el-form-item__label')
            } else {
                label = label.parentNode?.parentNode?.querySelector('.el-form-item__label')
            }
            console.log('resolveLabel', label)


            console.log('parentNodeClassName', parentNodeClassName)
            console.log('inputTypeClassName', inputTypeClassName)


            if (label && (inputTypeClassName || parentNodeClassName)) {
                let realPath = this.getDomPath(label)
                realPath += `+.el-form-item__content ${parentNodeClassName} .${inputTypeClassName}`
                this.pushRuleItem(target.tagName, realPath, label.innerText.replace(':', ''), type)
                this.render()
                return true
            }

            function getInputTypeClassName(inputEl) {
                let elementUIInputTypeClass = ['el-input__inner', 'el-textarea__inner', 'el-radio__original', 'el-checkbox__original']
                for (let value of elementUIInputTypeClass) {
                    if (inputEl.classList.contains(value)) {
                        return value
                    }
                }
                return ''
            }

            function getParentNodeClassName(el) {
                let parentNodeTypeClass = ['el-date-editor', 'el-input'];
                for (let value of parentNodeTypeClass) {
                    if (el.classList.contains(value)) {
                        return `.${value}`
                    }
                }
                return ''
            }*/

            return true
        }

        resolveInputPlaceholder(el) {
            if (!el.getAttribute('placeholder')) return ''
            let placeholder = el.getAttribute('placeholder')
            let replaceText = ['请输入', '请选择', 'please enter', 'please select', 'Please select', 'Please enter']
            for (let value of replaceText) {
                placeholder = placeholder.replace(value, '')
            }
            return placeholder
        }

        /**
         * 判断当前点击是否为当前弹出层
         * @param el
         * @returns {boolean|*}
         */

        checkIsContainer(el) {
            if (el.tagName === 'HTML' || el.tagName === 'BODY') return false
            if (el.tagName === 'DIV' && el.id === this.containerId) {
                return true
            }
            if (el.parentNode) return this.checkIsContainer(el.parentNode)
            return false

        }

        /**
         * 添加规则子项
         * @param tagName
         * @param realPath
         * @param name
         * @param type
         * @param mockName
         */
        pushRuleItem(tagName, realPath, name = '', type = 'input', mockName = '') {
            if (!this.rule.items.some(item => item.key === realPath)) {
                this.rule.items.push({
                    tagName,
                    key: realPath,
                    name: name,
                    mockKey: type === 'input' ? '' : type,
                    type,
                    mockName
                })
            }
        }

        /**
         * 根据key获取规则子项
         * @param key
         * @returns {number}
         */
        getRuleItemIndexByKey(key) {
            let index = -1
            for (let i in this.rule.items) {
                if (key === this.rule.items[i].key) {
                    return Number(i)
                }
            }
            return index
        }


    }

    /**
     * Listen to DOM events during the bubble phase.
     *
     * @param {DOMEventTarget|Element|Document} target DOM element to register listener on.
     * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
     * @param {function} callback Callback function.
     * @return {object} Object with a `remove` method.
     */
    function listen(target, eventType, callback) {
        if (target.addEventListener) {
            target.addEventListener(eventType, callback, false);
            return {
                remove() {
                    target.removeEventListener(eventType, callback, false);
                }
            };
        } else if (target.attachEvent) {
            target.attachEvent('on' + eventType, callback);
            return {
                remove() {
                    target.detachEvent('on' + eventType, callback);
                }
            };
        }
    }

    function createElement({tagName, id, classList, style, text, children, html, events = {}}) {
        let el = document.createElement(tagName)

        if (id) {
            el.id = id
        }

        if (text) {
            el.innerText = text
        }
        if (html) {
            el.innerHTML = html
        }


        if (classList) {
            if (!isArray(classList)) {
                classList = classList.split(' ')
            }
            classList.forEach(item => {
                el.classList.add(item)
            })
        }

        if (style) {
            if (typeof style === 'string') {
                el.style.cssText = style
            } else {
                for (let name in style) {
                    el.style[name] = style[name]
                }
            }
        }
        for (let event in events) {
            if (typeof events[event] === 'function') {
                el.addEventListener(event, events[event])
            }
        }


        if (children) {
            if (isArray(children)) {
                children.forEach(child => {
                    el.appendChild(createElement(child))
                })
            } else {
                el.innerText = children
            }
        }


        return el
    }

    function isArray(arg) {
        if (typeof Array.isArray === 'undefined') {
            return Object.prototype.toString.call(arg) === '[object Array]'
        }
        return Array.isArray(arg)
    }

    new RuleForm(tab, rule)
}




