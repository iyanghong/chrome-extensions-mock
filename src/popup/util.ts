import {MessageRequestEntity} from "@/common/entitys/MessageType";

export function sendMessageToBackground(handler: string, data: Record<string, any>) {
    let message: MessageRequestEntity = {
        source: 'Popup',
        target: 'Background',
        handler,
        data
    };
    return chrome.runtime.sendMessage(message)
}