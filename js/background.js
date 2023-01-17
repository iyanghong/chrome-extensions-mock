import mock from "./lib/mock.js";
import Region from "./lib/region.js";
import network from "./lib/network.js";

const MOCK_LIST = [
    {
        id: 'Top',
        title: '数据模拟'
    },
    /*{
        id: 'PushToRule',
        parentId: 'Top',
        title: '添加进规则...'
    },
    {
        id: 'Separator',
        parentId: 'Top',
        type: 'separator'
    },*/
    {
        id: 'CNPersonName',
        parentId: 'Top',
        title: '中文姓名'
    },
    {
        id: 'CNPersonNameFullName',
        parentId: 'CNPersonName',
        title: '姓名-中文',
        handle: mock.cn.fullName
    },
    {
        id: 'CNPersonNameMaleName',
        parentId: 'CNPersonName',
        title: '男姓名-中文',
        handle: mock.cn.maleName
    },
    {
        id: 'CNPersonNameFemaleName',
        parentId: 'CNPersonName',
        title: '女姓名-中文',
        handle: mock.cn.femaleName
    },
    {
        id: 'ENPersonName',
        parentId: 'Top',
        title: '英文姓名'
    },
    {
        id: 'ENPersonNameFullName',
        parentId: 'ENPersonName',
        title: '姓名-英文',
        handle: mock.en.fullName
    },
    {
        id: 'ENPersonNameMaleName',
        parentId: 'ENPersonName',
        title: '男姓名-英文',
        handle: mock.en.maleName
    },
    {
        id: 'ENPersonNameFemaleName',
        parentId: 'ENPersonName',
        title: '女姓名-英文',
        handle: mock.en.femaleName
    },
    {
        id: 'ENPersonNameCountry',
        parentId: 'ENPersonName',
        title: '国名',
        handle: mock.en.country
    },
    {
        id: 'IdCard',
        parentId: 'Top',
        title: '身份证',
        handle: mock.cn.idcard
    },
    {
        id: 'Mobile',
        parentId: 'Top',
        title: '手机号',
        handle: mock.cn.mobile
    },
    {
        id: 'Phone',
        parentId: 'Top',
        title: '电话号码-座机',
        handle: mock.cn.phone
    },
    {
        id: 'Email',
        parentId: 'Top',
        title: '邮箱',
        handle: mock.web.email
    },
    {
        id: 'UUID',
        parentId: 'Top',
        title: 'UUID',
        handle: mock.util.uuid
    },


    // 行政区域 start
    {
        id: 'Address',
        parentId: 'Top',
        title: '行政区域'
    },
    {
        id: 'FullAddress',
        parentId: 'Address',
        title: '详细地址',
        handle() {
            let region = new Region();
            return region.province(true) + region.prefecture(true) + region.county()
        }
    },
    {
        id: 'AddressProvince',
        parentId: 'Address',
        title: '省份',
        handle() {
            let region = new Region();
            return region.province()
        }
    },
    {
        id: 'AddressPrefecture',
        parentId: 'Address',
        title: '城市',
        handle() {
            let region = new Region();
            return region.prefecture()
        }
    },
    {
        id: 'AddressCounty',
        parentId: 'Address',
        title: '区县',
        handle() {
            let region = new Region();
            return region.county()
        }
    },
    {
        id: 'AddressLongitude',
        parentId: 'Address',
        title: '坐标，经度',
        handle() {
            let region = new Region();
            return region.longitude()
        }
    },
    {
        id: 'AddressLatitude',
        parentId: 'Address',
        title: '坐标，纬度',
        handle() {
            let region = new Region();
            return region.latitude()
        }
    },
    {
        id: 'AddressCode',
        parentId: 'Address',
        title: '县区级6位行政区划代码',
        handle() {
            let region = new Region();
            return region.citycode()
        }
    },
    {
        id: 'Zipcode',
        parentId: 'Address',
        title: '邮编',
        handle() {
            let region = new Region();
            return region.zipcode()
        }
    },
    {
        id: 'Company',
        parentId: 'Address',
        title: '公司名',
        handle: mock.cn.company
    },
    {
        id: 'Build',
        parentId: 'Address',
        title: '建筑名',
        handle: mock.cn.build
    },
    {
        id: 'Road',
        parentId: 'Address',
        title: '路名',
        handle: mock.cn.road
    },
    {
        id: 'Autocard',
        parentId: 'Address',
        title: '车牌号',
        handle: mock.cn.autocard
    },
    // 行政区域 end
    // 时间 start
    {
        id: 'Date',
        parentId: 'Top',
        title: '时间'
    },
    // 时间 end
    // Web start
    {
        id: 'Web',
        parentId: 'Top',
        title: 'Web账号'
    },
    {
        id: 'WebNickName',
        parentId: 'Web',
        title: '昵称',
        handle: network.nickname
    },
    {
        id: 'WebAccount',
        parentId: 'Web',
        title: '账号名',
        handle: mock.web.account
    },
    {
        id: 'WebPassword',
        parentId: 'Web',
        title: '密码',
        handle: mock.web.password
    },
    {
        id: 'WebPersonDescription',
        parentId: 'Web',
        title: '个性签名',
        handle: network.personDescription
    },
    {
        id: 'WebQQ',
        parentId: 'Web',
        title: 'QQ',
        handle: mock.web.qq
    },
    {
        id: 'WebDomain',
        parentId: 'Web',
        title: '域名',
        handle: mock.web.domain
    },
    {
        id: 'WebUrl',
        parentId: 'Web',
        title: 'URL',
        handle: mock.web.url
    },
    {
        id: 'WebIP',
        parentId: 'Web',
        title: '公网IP',
        handle: mock.web.ip
    },
    {
        id: 'WebIPLan',
        parentId: 'Web',
        title: '局域网IP',
        handle() {
            return mock.web.ip(true)
        }
    },
    {
        id: 'WebBankIdCard',
        parentId: 'Web',
        title: '银行卡号',
        handle: network.bankIdCard
    },
    {
        id: 'WebColor',
        parentId: 'Web',
        title: '颜色值',
        handle: mock.web.color
    },
    // Web end

    {
        id: 'Number',
        parentId: 'Top',
        title: '数字'
    },
    {
        id: 'Letter',
        parentId: 'Top',
        title: '字母'
    },
    {
        id: 'LetterNumber',
        parentId: 'Top',
        title: '字母+数字'
    },
    {
        id: 'ChineseText',
        parentId: 'Top',
        title: '随机汉字',
        // handle: mock.text.chinese
    },
]

// 时间
for (let i = 1; i < 25; i++) {
    let len = i * 5
    if (len > 50 && len < 100 && (len + '').indexOf('5') > -1) {
        continue
    }
    if (i > 20) {
        len = 100 + 50 * (i - 20)
    }
    let endDate = new Date()
    let startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() - len)
    MOCK_LIST.push({
        id: `Date${len}`,
        parentId: 'Date',
        title: `${len}年内日期`,
        handle() {
            return mock.date.time(startDate, endDate, 'yyyy-MM-dd')
        }
    })
}


// 填充数字
for (let i = 1; i < 10; i++) {
    let min = '1', max = '9'
    if (i !== 1) {
        for (let j = 0; j < i - 1; j++) {
            min += '0'
            max += '9'
        }
    }
    min = parseInt(min)
    max = parseInt(max)
    MOCK_LIST.push({
        id: `Number${i}`,
        parentId: 'Number',
        title: `${i}位数字`,
        handle() {
            return mock.rand.int(min, max)
        }
    })
}
// 字母
for (let i = 1; i < 10; i++) {
    let len = Math.pow(2, i)
    MOCK_LIST.push({
        id: `Letter${i}`,
        parentId: 'Letter',
        title: `${len}个字母`,
        handle() {
            return mock.rand.letter(len, true, true)
        }
    })
    MOCK_LIST.push({
        id: `LetterNumber${i}`,
        parentId: 'LetterNumber',
        title: `${len}个字符串`,
        handle() {
            return mock.rand.alphanum(len, true)
        }
    })
}
for (let i = 1; i < 10; i++) {
    let len = i === 1 ? 10 : (50 * (i - 1));
    MOCK_LIST.push({
        id: `ChineseText${len}`,
        parentId: 'ChineseText',
        title: `${len}个汉字`,
        handle() {
            return mock.text.chinese(len)
        }
    })
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (typeof message === 'string') {
        switch (message) {
            case 'getMockListTree':
                sendResponse(getMockListTree())
                break
        }
    } else if (typeof message === 'object') {
        if (message.key === 'setMock') {
            message.data.items.forEach((data, index) => {
                let mock = MOCK_LIST.filter(item => item.id === data.mockKey)[0]
                let value = ''
                if (mock && mock.handle) {
                    value = mock.handle()
                }
                chrome.tabs.query({active: true, currentWindow: true}, (tab) => {//获取当前tab
                    if (tab[0]) {
                        chrome.scripting.executeScript({
                            target: {tabId: tab[0].id},
                            func: setMock,
                            args: [{key: data.key, value, type: data.type, index}]
                        })
                    }
                });
            })
        } else if (message.key === 'getStorageMockRules') {
            (async () => {
                let result = await getStorageMockRules(...(message.args || []))
                sendResponse(result)
            })()
        } else if (message.key === 'setStorageMockRulesByPageRule') {
            (async () => {
                let result = await setStorageMockRulesByPageRule(...(message.args || []))

                sendResponse(result)
            })()
        } else if (message.key === 'updateStorageMockRulesByPageRule') {
            (async () => {
                let result = await updateStorageMockRulesByPageRule(...(message.args || []))
                sendResponse(result)
            })()
        } else if (message.key === 'saveStorageMockRules') {
            (async () => {
                let result = await saveStorageMockRules(...(message.args || []))
                sendResponse(result)
            })()
        } else if (message.key === 'deleteStorageMockRules') {
            (async () => {
                let result = await deleteStorageMockRules(...(message.args || []))
                sendResponse(result)
            })()
        } else if (message.key === 'deleteStorageMockRulesByPageRules') {
            (async () => {
                let result = await deleteStorageMockRulesByPageRules(...(message.args || []))
                sendResponse(result)
            })()
        } else if (message.key === 'deleteStorageMockRulesByPageRulesItem') {
            (async () => {
                let result = await deleteStorageMockRulesByPageRulesItem(...(message.args || []))
                sendResponse(result)
            })()
        }
    }
    return true;
})

// 添加菜单
chrome.runtime.onInstalled.addListener(async () => {
    MOCK_LIST.forEach(menu => {
        let menuData = {
            id: menu.id,
            title: menu.title,
            type: menu.type ? menu.type : 'normal',
            contexts: ['editable'],
        }
        if (menu.parentId) {
            menuData.parentId = menu.parentId
        }
        chrome.contextMenus.create(menuData);

    })

});


// Open a new search tab when the user clicks a context menu
chrome.contextMenus.onClicked.addListener((item, tab) => {
    let menu = MOCK_LIST.filter(menuItem => menuItem.id === item.menuItemId)[0]
    if (menu && menu.handle) {
        let data = menu.handle()
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: setFocusedInputMockData,
            args: [data]
        })
    }

});

function setFocusedInputMockData(data) {
    let focusedElement = document.activeElement;
    if (focusedElement) {
        focusedElement.value = data
        const event = document.createEvent('HTMLEvents');
        event.initEvent('input', false, true);
        focusedElement.dispatchEvent(event);
    }
    return true
}

function setMockData(data) {

}

function setMock({key, value, type, index}) {
    function RandomNumBoth(Min, Max) {
        let Range = Max - Min;
        let Rand = Math.random();
        let num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    }


    switch (type) {
        case 'radio':
            let elList = document.querySelectorAll(key)
            if (elList.length) {
                let index = RandomNumBoth(0, elList.length - 1)
                elList[index].click()
            }
            break
        case 'checkbox':
            let checkboxList = document.querySelectorAll(key)
            if (checkboxList.length) {
                let keys = Object.keys(checkboxList).sort(() => Math.random() > 0.5 ? -1 : 1).map(value => Number(value))
                let index = RandomNumBoth(0, checkboxList.length - 1)
                for (let i = 0; i <= index; i++) {
                    checkboxList[keys[i]].click()
                }
            }
            break
        case 'switch':
            let switchEl = document.querySelector(key)
            if (switchEl) {
                let isSwitchOpen = RandomNumBoth(0, 1)
                if (isSwitchOpen) switchEl.click()
            }
            break
        case 'elSelect':
            let elSelectEl = document.querySelector(key)
            if (elSelectEl) {
                elSelectEl.click()

                setTimeout(() => {
                    //let elSelectElRect = elSelectEl.getBoundingClientRect() // getElementAbsPos(elSelectEl)
                    let elSelectPopperList = document.querySelectorAll('.el-select-dropdown.el-popper')
                    for (let item of elSelectPopperList) {
                        if (getComputedStyle(item).display !== 'none') {
                            let elSelectOptionList = item.querySelectorAll('.el-select-dropdown__item')
                            if (elSelectOptionList.length) {
                                let index = RandomNumBoth(0, elSelectOptionList.length - 1)
                                elSelectOptionList[index].click()
                            }
                        }
                        /*let itemRect = item.getBoundingClientRect() //getElementAbsPos(item)
                        let absX = Math.abs(Math.abs(itemRect.x + document.documentElement.scrollLeft) - Math.abs(elSelectElRect.x + document.documentElement.scrollLeft))
                        let absY = Math.abs(Math.abs(itemRect.y + document.documentElement.scrollTop) - Math.abs(elSelectElRect.y + document.documentElement.scrollTop))
                        if (absX < 50 && absY < 80) {
                            let elSelectOptionList = item.querySelectorAll('.el-select-dropdown__item')
                            if (elSelectOptionList.length) {
                                let index = RandomNumBoth(0, elSelectOptionList.length - 1)
                                elSelectOptionList[index].click()
                            }
                            break
                        }*/
                    }
                }, index * 80)
            }
            break
        default:
            let el = document.querySelector(key)
            if (el) {
                el.value = value
                const event = document.createEvent('HTMLEvents');
                event.initEvent('input', false, true);
                el.dispatchEvent(event);
            }
            break
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

function getMockListTree(parentId = 'Top', name = '') {
    let list = [];
    for (let item of MOCK_LIST) {
        if (item.parentId === parentId) {
            list.push({
                id: item.id,
                title: item.title,
                // mockName: item.title + (name ? `-${name}` : ''),
                children: getMockListTree(item.id, item.title),
                hasHandle: item.handle !== undefined
            })
        }
    }
    return list
}

function getStorageMockRules() {
    return new Promise(resolve => {
        chrome.storage.local.get(['MockRules']).then((result) => {
            result = result.MockRules || []

            resolve(result)
        })
    })
}

function setStorageMockRulesByPageRule(pageRule) {
    return new Promise(resolve => {
        getStorageMockRules().then(result => {
            let currentPageRule = null, index = -1;
            currentPageRule = result.filter(item => item.pageUrl === pageRule.key)[0]
            for (let i in result) {
                if (result[i].pageUrl === pageRule.key) {
                    currentPageRule = result[i]
                    index = Number(i)
                    break
                }
            }

            if (!currentPageRule) {
                result.push({
                    pageUrl: pageRule.key,
                    rules: [pageRule]
                })
            } else {
                let flag = false
                // 判断rules
                currentPageRule.rules = currentPageRule.rules.map(item => {
                    if (item.id === pageRule.id) {
                        flag = true
                        return pageRule
                    }
                    return item
                })
                if (!flag) {
                    currentPageRule.rules.push(pageRule)
                }
                result[index] = currentPageRule

            }
            chrome.storage.local.set({MockRules: result})
            resolve()
        })
    })
}

function updateStorageMockRulesByPageRule(pageRules) {
    return new Promise(resolve => {
        getStorageMockRules().then(result => {
            result = result.map(pageItem => {
                if (pageItem.pageUrl === pageRules.pageUrl) {
                    return pageRules
                }
                return pageItem
            })
            chrome.storage.local.set({MockRules: result})
            resolve()
        })
    })
}

function saveStorageMockRules(rules) {
    return new Promise(resolve => {
        chrome.storage.local.set({MockRules: rules})
        resolve()
    })
}

function deleteStorageMockRules(pageUrl, isAll = false) {
    return new Promise(resolve => {
        getStorageMockRules().then(result => {
            result = result.filter(item => {
                if (isAll) {
                    return item.pageUrl.includes(pageUrl)
                }
                return item.pageUrl !== pageUrl
            })
            chrome.storage.local.set({MockRules: result})
            resolve()
        })
    })
}

function deleteStorageMockRulesByPageRules(pageUrl, id) {
    return new Promise(resolve => {
        getStorageMockRules().then(result => {
            result = result.map(item => {
                if (item.pageUrl === pageUrl) {
                    item.rules = item.rules.filter(rule => rule.id !== id)
                }
                return item
            })
            chrome.storage.local.set({MockRules: result})
            resolve()
        })
    })
}

function deleteStorageMockRulesByPageRulesItem(pageUrl, ruleId, itemId) {
    return new Promise(resolve => {
        getStorageMockRules().then(result => {
            result = result.map(item => {
                if (item.pageUrl === pageUrl) {
                    item.rules = item.rules.map(rule => {
                        if (rule.id === ruleId) {
                            rule.items = rule.items.filter(ruleItem => ruleItem.id !== itemId)
                        }
                        return rule
                    })
                }
                return item
            })
            chrome.storage.local.set({MockRules: result})
            resolve()
        })
    })
}