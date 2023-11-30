import {MessageRequestEntity, MessageRequestSourceType} from "@/common/entitys/MessageType";


export default class Handler {
    source: MessageRequestSourceType

    constructor(source: MessageRequestSourceType) {
        this.source = source
    }

    on(key: string, callback: (response: MessageRequestEntity) => void) {
        chrome.runtime.onMessage.addListener((request: MessageRequestEntity) => {
            if (request.target == this.source && request.handler == key) {
                callback(request)
            }
        })
    }

    sendMessage(message: MessageRequestEntity) {
        message.source = this.source
        return chrome.runtime.sendMessage(message);
    }
}