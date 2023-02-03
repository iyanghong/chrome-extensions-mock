export default function setMockExecuteScript(list) {

    function RandomNumBoth(Min, Max) {
        let Range = Max - Min;
        let Rand = Math.random();
        let num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    }

    const MockStrategy = {
        inputMock, radioMock, checkboxMock, switchMock, elSelectMock, antdSelectMock, selectMock
    }
    const selectMockQueue = []
    const antdSelectedList = []
    const elSelectQueue = []
    list.forEach((item, index) => {
        const {key, value, type} = item
        if (MockStrategy[`${type}Mock`]) {
            MockStrategy[`${type}Mock`].call(this, key, value, type, index)
        } else {
            MockStrategy.inputMock.call(this, key, value, type, index)
        }
    })
    runSelectMockQueue()


    function runSelectMockQueue(index = 0) {
        if (selectMockQueue.length - 1 >= index) {
            selectMockQueue[index].call(this).then(() => {
                runSelectMockQueue(++index)
            })
        }

    }

    function inputMock(key, value, type, index) {
        let el = document.querySelector(key)
        if (el) {
            el.value = value
            const event = document.createEvent('HTMLEvents');
            event.initEvent('input', false, true);
            el.dispatchEvent(event);
        }
    }

    function radioMock(key, value, type, index) {
        let elList = document.querySelectorAll(key)
        if (elList.length) {
            let index = RandomNumBoth(0, elList.length - 1)
            elList[index].click()
        }
    }

    function checkboxMock(key, value, type, index) {
        let checkboxList = document.querySelectorAll(key)
        if (checkboxList.length) {
            let keys = Object.keys(checkboxList).sort(() => Math.random() > 0.5 ? -1 : 1).map(value => Number(value))
            let index = RandomNumBoth(0, checkboxList.length - 1)
            for (let i = 0; i <= index; i++) {
                checkboxList[keys[i]].click()
            }
        }
    }

    function switchMock(key, value, type, index) {
        let switchEl = document.querySelector(key)
        if (switchEl) {
            let isSwitchOpen = RandomNumBoth(0, 1)
            if (isSwitchOpen) switchEl.click()
        }
    }

    function selectMock(key, value, type, index) {

        let selectEl = document.querySelector(key)
        if (!selectEl) return
        let options = selectEl.querySelectorAll('option')

        if (options.length) {
            let index = RandomNumBoth(0, options.length - 1)
            selectEl.value = options[index].value
        }
    }



    function handleRunMockElSelectQueue() {
        elSelectQueue.forEach(key => {
            let elSelectEl = document.querySelector(key)
            if (elSelectEl) {
                elSelectEl.dispatchEvent(new Event('click'))
            }
        })
        setTimeout(() => {
            let elSelectPopperList = document.querySelectorAll('.el-select-dropdown.el-popper')
            for (let item of elSelectPopperList) {
                let isMultiple = item.classList.contains('is-multiple')
                if (getComputedStyle(item).display !== 'none') {
                    let elSelectOptionList = item.querySelectorAll('.el-select-dropdown__item')
                    if (elSelectOptionList.length) {
                        if(isMultiple){
                            let keys = Object.keys(elSelectOptionList).sort(() => Math.random() > 0.5 ? -1 : 1).map(value => Number(value))
                            let sIndex = RandomNumBoth(0, elSelectOptionList.length - 1)
                            for (let i = 0; i <= sIndex; i++) {
                                elSelectOptionList[keys[i]].click()
                            }
                        }else {
                            let index = RandomNumBoth(0, elSelectOptionList.length - 1)
                            elSelectOptionList[index].click()
                        }
                    }
                }
            }
        },100)
    }
    handleRunMockElSelectQueue()

    function elSelectMock(key, value, type, index) {
        elSelectQueue.push(key)
        /*let elSelectEl = document.querySelector(key)
        if (elSelectEl) {
            setTimeout(() => {
                elSelectEl.dispatchEvent(new Event('click'))
                let elSelectPopperList = document.querySelectorAll('.el-select-dropdown.el-popper')
                for (let item of elSelectPopperList) {
                    if (getComputedStyle(item).display !== 'none') {
                        let elSelectOptionList = item.querySelectorAll('.el-select-dropdown__item')
                        if (elSelectOptionList.length) {
                            let index = RandomNumBoth(0, elSelectOptionList.length - 1)
                            elSelectOptionList[index].click()
                            console.log(1)
                        }
                    }
                }
            }, index * 100)
        }*/
    }


    function antdSelectMock(key, value, type, index) {
        selectMockQueue.push(function () {
            return new Promise(resolve => {
                let antdSelect = document.querySelector(key)
                if (antdSelect) {
                    let isMultiple = antdSelect.classList.contains('ant-select-multiple')
                    let antSelectSelector = antdSelect.querySelector('.ant-select-selector')
                    antSelectSelector.dispatchEvent(new Event('mousedown'))
                    let selectId = antSelectSelector.querySelector('input').getAttribute('id')
                    setTimeout(() => {
                        let antdSelectPopperList = document.querySelectorAll('.ant-select-dropdown')
                        for (let item of antdSelectPopperList) {
                            if (!item.classList.contains('ant-select-dropdown-hidden')) {
                                let listBox = item.querySelector('[role="listbox"]')
                                let id = listBox.getAttribute('id')
                                if (id !== `${selectId}_list`) continue
                                let antdSelectOptionList = item.querySelectorAll('.ant-select-item.ant-select-item-option:not(.ant-select-item-option-disabled)')
                                if (antdSelectOptionList.length) {
                                    if (isMultiple) {
                                        let keys = Object.keys(antdSelectOptionList).sort(() => Math.random() > 0.5 ? -1 : 1).map(value => Number(value))
                                        let sIndex = RandomNumBoth(0, antdSelectOptionList.length - 1)
                                        for (let i = 0; i <= sIndex; i++) {
                                            antdSelectOptionList[keys[i]].click()
                                        }
                                    } else {
                                        let sIndex = RandomNumBoth(0, antdSelectOptionList.length - 1)
                                        antdSelectOptionList[sIndex].click()
                                    }
                                }
                            }
                        }
                        resolve()
                    }, 100)

                }
            })

        })
    }

    function getElementAbsPos(e) {
        let t = e.offsetTop;
        let l = e.offsetLeft;
        while (e = e.offsetParent) {
            t += e.offsetTop;
            l += e.offsetLeft;
        }

        return {x: l, y: t};
    }

    return true
}