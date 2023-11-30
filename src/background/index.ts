import {MessageRequestEntity} from "@/common/entitys/MessageType";
import PopupHandler from "@/background/handler/PopupHandler";
import BackgroundHandler from "@/background/handler/BackgroundHandler";
import ContentHandler from "@/background/handler/ContentHandler";
import OptionHandler from "@/background/handler/OptionHandler";
// const PageRuleStore = new PageRuleStoreService()
//
// await PageRuleStore.refreshData()
console.log('background')
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
    chrome.runtime.onMessage.addListener(function (request: MessageRequestEntity) {
        if (request.target && EventHandler[request.target] && EventHandler[request.target][request.handler]) {
            console.log(`执行事件，source=${request.source}，target=${request.target}，handler=${request.handler}`, request.data)
            EventHandler[request.target][request.handler].call(null, request.data)
        }
    });
});


