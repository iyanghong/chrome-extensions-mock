class Options {
    list = []
    activeName = 'pageRules'

    constructor() {
        document.querySelector('#btn-subtitle').addEventListener('click',() => {
            location.href = 'https://www.iyanghong.cn'
        })
        this.loadData()
    }

    loadData() {
        chrome.runtime.sendMessage('', {
            key: 'getStorageMockRules',
            args: []
        }).then(result => {

            this.list = []
            let data = {}
            for (let item of result) {
                let url = new URL(item.pageUrl)
                if (data[url.origin]) {
                    data[url.origin].push(item)
                } else {
                    data[url.origin] = [item]
                }
            }
            for (let name in data) {
                this.list.push({
                    origin: name,
                    showChild: false,
                    pages: data[name]
                })
            }

            this.render()

        })
    }

    handleSave() {
        let mockRules = []
        for (let item of this.list) {
            mockRules.push(item.pages)
        }

        /*chrome.runtime.sendMessage('', {
            key: 'saveStorageMockRules',
            args: []
        }).then(result => {
          this.render()
        })*/
    }

    render() {
        this.renderMenus()
        this.renderTable()
    }

    renderMenus() {

        let menusContainer = document.querySelector('#menus')
        menusContainer.innerHTML = ''
        menusContainer.appendChild(createElement({
            tagName: 'div',
            classList: ['menu-item', 'active'],
            text: '已配置规则'
        }))
    }

    renderTable() {
        let tableContainer = document.querySelector('.page-rules-container')
        tableContainer.innerHTML = ''
        let table = createElement({
            tagName: 'table',
            children: [
                {
                    tagName: 'thead',
                    children: [
                        {
                            tagName: 'tr',
                            children: [
                                {tagName: 'th', text: 'Origin', style: 'width:220px'},
                                {tagName: 'th', text: '页面配置数量', style: 'width:80px'},
                                {tagName: 'th', text: '操作', style: 'width:100px'},
                            ]
                        }
                    ]
                }
            ]
        })

        let tbody = createElement({tagName: 'tbody'})

        for (let item of this.list) {
            let tr = createElement({
                tagName: 'tr',
                children: [
                    {tagName: 'td', text: item.origin},
                    {tagName: 'td', text: item.pages.length},
                    {
                        tagName: 'td', children: [{
                            tagName: 'button', classList: ['btn-text', 'btn-delete'], text: '删除', events: {
                                click: (e) => {
                                    e.stopPropagation();
                                    chrome.runtime.sendMessage('', {
                                        key: 'deleteStorageMockRules',
                                        args: [item.pages[0].pageUrl, true]
                                    }).then(() => {
                                        this.loadData()
                                    })
                                }
                            }
                        }]
                    },
                ],
                events: {
                    click: () => {
                        item.showChild = !item.showChild
                        this.render()
                    }
                }
            })
            tbody.appendChild(tr)
            if (item.showChild) {
                tr.setAttribute('colspan', 3)
                let pageTr = createElement({tagName: 'tr',})
                let pageTd = createElement({tagName: 'td', style: 'border:0;'})
                pageTd.setAttribute('colspan', 3)
                pageTd.appendChild(this.renderOriginPages(item.pages))
                pageTr.appendChild(pageTd)


                tbody.appendChild(pageTr)
            }
        }


        table.appendChild(tbody)

        tableContainer.appendChild(table)
    }

    renderOriginPages(pages) {
        let table = createElement({
            tagName: 'table',
            style: 'margin-left:60px;width:calc(100% - 60px)',
            children: [
                {
                    tagName: 'thead',
                    children: [
                        {
                            tagName: 'tr',
                            children: [
                                {tagName: 'th', text: '页面'},
                                {tagName: 'th', text: '规则数'},
                                {tagName: 'th', text: '操作'},
                            ]
                        }
                    ]
                }
            ]
        })
        let tbody = createElement({tagName: 'tbody'})

        for (let item of pages) {
            let tr = createElement({
                tagName: 'tr',
                children: [
                    {tagName: 'td', text: item.pageUrl},
                    {tagName: 'td', text: item.rules.length},
                    {
                        tagName: 'td', children: [{
                            tagName: 'button', classList: ['btn-text', 'btn-delete'], text: '删除', events: {
                                click: e => {
                                    e.stopPropagation()
                                    chrome.runtime.sendMessage('', {
                                        key: 'deleteStorageMockRules',
                                        args: [item.pageUrl]
                                    }).then(() => {
                                        this.loadData()
                                    })
                                }
                            }
                        }]
                    },
                ],
                events: {
                    click: () => {
                        item.showChild = !item.showChild
                        this.render()
                    }
                }
            })
            tbody.appendChild(tr)
            if (item.showChild) {
                tr.setAttribute('colspan', 3)
                let pageTr = createElement({tagName: 'tr',})
                let pageTd = createElement({tagName: 'td', style: 'border:0;'})
                pageTd.setAttribute('colspan', 3)
                pageTd.appendChild(this.renderPageRules(item.rules))
                pageTr.appendChild(pageTd)
                tbody.appendChild(pageTr)
            }
        }


        table.appendChild(tbody)
        return table
    }

    renderPageRules(rules) {
        let table = createElement({
            tagName: 'table',
            style: 'margin-left:60px;width:calc(100% - 60px)',
            children: [
                {
                    tagName: 'thead',
                    children: [
                        {
                            tagName: 'tr',
                            children: [
                                {tagName: 'th', text: '名称'},
                                {tagName: 'th', text: '规则数'},
                                {tagName: 'th', text: '操作'},
                            ]
                        }
                    ]
                }
            ]
        })
        let tbody = createElement({tagName: 'tbody'})
        for (let item of rules) {
            let tr = createElement({
                tagName: 'tr',
                children: [
                    {tagName: 'td', text: item.name},
                    {tagName: 'td', text: item.items.length},
                    {
                        tagName: 'td', children: [{
                            tagName: 'button', classList: ['btn-text', 'btn-delete'], text: '删除', events: {
                                click: e => {
                                    e.stopPropagation()
                                    chrome.runtime.sendMessage('', {
                                        key: 'deleteStorageMockRulesByPageRules',
                                        args: [item.key, item.id]
                                    }).then(() => {
                                        this.loadData()
                                    })

                                }
                            }
                        }]
                    },
                ],
                events: {
                    click: () => {
                        item.showChild = !item.showChild
                        this.render()
                    }
                }
            })
            tbody.appendChild(tr)
            if (item.showChild) {
                tr.setAttribute('colspan', 3)
                let pageTr = createElement({tagName: 'tr',})
                let pageTd = createElement({tagName: 'td', style: 'border:0;'})
                pageTd.setAttribute('colspan', 3)
                pageTd.appendChild(this.renderPageRulesItems(item.items, item.key, item.id))
                pageTr.appendChild(pageTd)
                tbody.appendChild(pageTr)
            }
        }


        table.appendChild(tbody)

        return table
    }

    renderPageRulesItems(items, pageUrl, ruleId) {
        let table = createElement({
            tagName: 'table',
            style: 'margin-left:60px;width:calc(100% - 60px)',
            children: [
                {
                    tagName: 'thead',
                    children: [
                        {
                            tagName: 'tr',
                            children: [
                                {tagName: 'th', text: '名称'},
                                {tagName: 'th', text: '规则'},
                                {tagName: 'th', text: '类型'},
                                {tagName: 'th', text: '操作'},
                            ]
                        }
                    ]
                }
            ]
        })
        let tbody = createElement({tagName: 'tbody'})
        for (let item of items) {
            let tr = createElement({
                tagName: 'tr',
                children: [
                    {tagName: 'td', text: item.name},
                    {tagName: 'td', text: item.mockName},
                    {tagName: 'td', text: item.type},
                    {
                        tagName: 'td', children: [{
                            tagName: 'button', classList: ['btn-text', 'btn-delete'], text: '删除', events: {
                                click: e => {
                                    e.stopPropagation()
                                    chrome.runtime.sendMessage('', {
                                        key: 'deleteStorageMockRulesByPageRulesItem',
                                        args: [pageUrl, ruleId, item.id]
                                    }).then(() => {
                                        this.loadData()
                                    })
                                    /*chrome.runtime.sendMessage('', {
                                        key: 'deleteStorageMockRules',
                                        args: [item.pages[0].pageUrl, true]
                                    }).then(() => {
                                        this.loadData()
                                    })*/
                                }
                            }
                        }]
                    },
                ]
            })
            tbody.appendChild(tr)
        }


        table.appendChild(tbody)

        return table
    }
}


window.onload = function () {
    new Options()
}

