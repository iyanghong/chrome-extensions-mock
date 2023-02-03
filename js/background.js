
import MOCK_LIST from './core/mock-list.js'
import * as messageHandles from './core/message-handle.js'

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (typeof message === 'string' && messageHandles[message]) {
        sendResponse(messageHandles[message]())
    } else if (typeof message === 'object') {
        if(messageHandles[message.key]){
            (async () => {
                let result = await messageHandles[message.key](...(message.args || (message.data ? [message.data] : [])))
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
            func: messageHandles.setFocusedInputMockData,
            args: [data]
        })
    }

});
