import MOCK_LIST from './mock-list.js'
import setMockExecuteScript from "./set-mock.js";

/**
 * 获取模拟数据列表
 * @param parentId
 * @param name
 * @returns {*[]}
 */
export function getMockListTree(parentId = 'Top', name = '') {
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


export function setFocusedInputMockData(data) {
    let focusedElement = document.activeElement;
    if (focusedElement) {
        focusedElement.value = data
        const event = document.createEvent('HTMLEvents');
        event.initEvent('input', false, true);
        focusedElement.dispatchEvent(event);
    }
    return true
}


export function setMock(data) {
    let mockSettingList = []
    data.items.forEach((data, index) => {
        let mock = MOCK_LIST.filter(item => item.id === data.mockKey)[0]
        let value = ''
        if (mock && mock.handle) {
            value = mock.handle()
        }
        mockSettingList.push({
            key: data.key, value, type: data.type, index
        })

    })
    chrome.tabs.query({active: true, currentWindow: true}, (tab) => {//获取当前tab
        if (tab[0]) {
            chrome.scripting.executeScript({
                target: {tabId: tab[0].id},
                func: setMockExecuteScript,
                args: [mockSettingList]
            })
        }
    });
}


export function getStorageMockRules() {
    return new Promise(resolve => {
        chrome.storage.local.get(['MockRules']).then((result) => {
            result = result.MockRules || []

            resolve(result)
        })
    })
}

export function setStorageMockRulesByPageRule(pageRule) {
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

export function updateStorageMockRulesByPageRule(pageRules) {
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

export function saveStorageMockRules(rules) {
    return new Promise(resolve => {
        chrome.storage.local.set({MockRules: rules})
        resolve()
    })
}

export function deleteStorageMockRules(pageUrl, isAll = false) {
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

export function deleteStorageMockRulesByPageRules(pageUrl, id) {
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

export function deleteStorageMockRulesByPageRulesItem(pageUrl, ruleId, itemId) {
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