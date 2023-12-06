/**
 * Importing necessary modules and handlers
 */
import { MessageRequestEntity } from '@/common/entitys/MessageType';
import PopupHandler from '@/background/handler/PopupHandler';
import BackgroundHandler from '@/background/handler/BackgroundHandler';
import ContentHandler from '@/background/handler/ContentHandler';
import OptionHandler from '@/background/handler/OptionHandler';
import { MenuEntity } from '@/common/core/generate/menu';

/**
 * EventHandler object that contains all the handlers for different events
 */
const EventHandler: {
    Background: Record<string, Function>
    Popup: Record<string, Function>
    Options: Record<string, Function>
    Content: Record<string, Function>
} = {
    Popup: PopupHandler,
    Options: OptionHandler,
    Background: BackgroundHandler,
    Content: ContentHandler
};

/**
 * Listener for when the Chrome extension is installed
 */
chrome.runtime.onInstalled.addListener(async () => {
    console.log('background installed');

    /**
     * Listener for messages from the chrome extension
     */
    chrome.runtime.onMessage.addListener(function(request: MessageRequestEntity, sender, sendResponse) {
        /**
         * If the request has a target and a handler, execute the handler with the request data
         */
        if (request.target && EventHandler[request.target] && EventHandler[request.target][request.handler]) {
            (async () => {
                try {
                    console.log(`执行事件，source=${request.source}，target=${request.target}，handler=${request.handler}`, request.data);
                    const response = await EventHandler[request.target][request.handler](request.data);
                    sendResponse(response);
                }catch (e) {
                    console.error(e)
                }
            })();
        }
        return true;
    });

    /**
     * Get all mock menus and add them to the chrome context menu
     */
    let menus = await BackgroundHandler.getAllMockMenu();
    menus.forEach((menu: MenuEntity) => {
        let menuData: chrome.contextMenus.CreateProperties = {
            id: menu.id,
            title: menu.name,
            type: 'normal',
            contexts: ['editable']
        };
        if (menu.parentId != '-1') {
            menuData.parentId = menu.parentId;
        }
        chrome.contextMenus.create(menuData);
    });
});

/**
 * Listener for when a context menu item is clicked
 */
chrome.contextMenus.onClicked.addListener(async (item, tab) => {
    /**
     * Get the clicked menu item and set its expression as the mock data for the focused input
     */
    let menu = await BackgroundHandler.getMockMenu(item.menuItemId.toString());
    await BackgroundHandler.setFocusedInputMockData(menu?.expression || '', Number(tab?.id));
});