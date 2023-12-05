import {MessageRequestEntity} from "@/common/entitys/MessageType";
import PopupHandler from "@/background/handler/PopupHandler";
import BackgroundHandler from "@/background/handler/BackgroundHandler";
import ContentHandler from "@/background/handler/ContentHandler";
import OptionHandler from "@/background/handler/OptionHandler";
import {MenuEntity} from "@/common/core/generate/menu";


const EventHandler: {
    Background: Record<string, Function>
    Popup: Record<string, Function>
    Options: Record<string, Function>
    Content: Record<string, Function>
} = {
    Popup: PopupHandler,
    Options: OptionHandler,
    Background: BackgroundHandler,
    Content: ContentHandler,
}


chrome.runtime.onInstalled.addListener( async () => {
    console.log('background installed')
    chrome.runtime.onMessage.addListener( function (request: MessageRequestEntity, sender, sendResponse) {
        if (request.target && EventHandler[request.target] && EventHandler[request.target][request.handler]) {
            (async () => {
                console.log(`执行事件，source=${request.source}，target=${request.target}，handler=${request.handler}`, request.data)
                const response = await EventHandler[request.target][request.handler](request.data)
                sendResponse(response)
            })()
        }
        return true;
    });

    let menus = await BackgroundHandler.getAllMockMenu()
    // 添加菜单
    menus.forEach((menu: MenuEntity) => {
        let menuData = {
            id: menu.id,
            title: menu.name,
            type: 'normal',
            contexts: ['editable'],
        }
        if (menu.parentId != '-1') {
            // @ts-ignore
            menuData.parentId = menu.parentId
        }
        //@ts-ignore
        chrome.contextMenus.create(menuData);

    })
});


chrome.contextMenus.onClicked.addListener(async (item, tab) => {
    let menu = await BackgroundHandler.getMockMenu(item.menuItemId.toString())
    //@ts-ignore
    await BackgroundHandler.setFocusedInputMockData(menu?.expression || '', tab?.id)
})