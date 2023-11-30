import {MessageRequestEntity} from "@/common/entitys/MessageType";
import {getCurrentInstance} from "vue";

export function getContainerId() {
    const vm = getCurrentInstance()
    return vm?.appContext.config.globalProperties.$containerId || ''
}

export function sendMessage(message: MessageRequestEntity) {
    return new Promise<void>(resolve => {
        const vm = getCurrentInstance()
        vm?.appContext.config.globalProperties.$sendMessage(message)
        resolve()
    })
}

export function sendMessageToBackground(handler: string, data: Record<string, any>) {
    return new Promise<void>(resolve => {
        const vm = getCurrentInstance()
        let message: MessageRequestEntity = {
            source: 'Content',
            target: 'Background',
            handler,
            data
        }
        vm?.appContext.config.globalProperties.$sendMessage(message)
        resolve()
    })
}