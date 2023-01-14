import mock from "./lib/mock.js";
import Region from "./lib/region.js";

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
        title: '全名不分男女',
        handle: mock.cn.fullName
    },
    {
        id: 'CNPersonNameMaleName',
        parentId: 'CNPersonName',
        title: '男姓名',
        handle: mock.cn.maleName
    },
    {
        id: 'CNPersonNameFemaleName',
        parentId: 'CNPersonName',
        title: '女姓名',
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
        title: '全名不分男女',
        handle: mock.en.fullName
    },
    {
        id: 'ENPersonNameMaleName',
        parentId: 'ENPersonName',
        title: '男姓名',
        handle: mock.en.maleName
    },
    {
        id: 'ENPersonNameFemaleName',
        parentId: 'ENPersonName',
        title: '女姓名',
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
        title: '地理坐标，经度',
        handle() {
            let region = new Region();
            return region.longitude()
        }
    },
    {
        id: 'AddressLatitude',
        parentId: 'Address',
        title: '地理坐标，纬度',
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
        title: 'web账号类型'
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
        title: '随机中文文本',
        handle: mock.text.chinese
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
        title: `${len}年内`,
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
        title: `${i}位数`,
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
        title: `${len}个字母+数字`,
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
        title: `${len}个中文文本`,
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
            message.data.items.forEach(data => {
                let mock = MOCK_LIST.filter(item => item.id === data.mockKey)[0]
                if (mock && mock.handle) {
                    chrome.tabs.query({active: true, currentWindow: true}, (tab) => {//获取当前tab
                        if (tab[0]) {
                            let value = mock.handle()
                            chrome.scripting.executeScript({
                                target: {tabId: tab[0].id},
                                func: setMock,
                                args: [data.key, value, data.type]
                            })
                        }
                    });
                }
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
    /*chrome.history.onVisited.addListener(function () {
        console.log('changed')
    })
*/

});
/*chrome.runtime.onUpdateAvailable.addListener(
    async () => {
        console.log('onUpdateAvailable')
    }
)
chrome.runtime.onRestartRequired.addListener(
    async () => {
        console.log('onBrowserUpdateAvailable')
    }
)*/


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

function setMock(key, value, type) {
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
            console.log(elList)
            break
        case 'checkbox':
            let checkboxList = document.querySelectorAll(key)
            if (checkboxList.length) {
                checkboxList.sort(() => Math.random() > 0.5 ? -1 : 1)
                let index = RandomNumBoth(0, checkboxList.length - 1)
                for (let i = 0;i<=index;i++){
                    checkboxList[i].click()
                }
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

    return true
}

function getMockListTree(parentId = 'Top') {
    let list = [];
    for (let item of MOCK_LIST) {
        if (item.parentId === parentId) {
            list.push({
                id: item.id,
                title: item.title,
                children: getMockListTree(item.id),
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
                chrome.storage.local.set({MockRules: result})
            }

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