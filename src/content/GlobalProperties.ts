import {ComponentInternalInstance, Ref} from "vue";
import {MessageRequestEntity} from "@/common/entitys/MessageType";
import {RuleEntity} from "@/common/entitys/PageEntity";

export interface IGlobalProperties {
    sendMessage: (message: MessageRequestEntity) => Promise<any>
    sendMessageToBackground: (handler: string, data: Record<string, any>) => Promise<any>
    getEvents: () => Ref<({ remove: () => void } | undefined)[]>
    getContainerId: () => string
    handleDestroy: () => void
    getRuleData: () => Ref<RuleEntity>
}

export default class GlobalProperties implements IGlobalProperties {
    instance: ComponentInternalInstance

    constructor(vm: ComponentInternalInstance) {
        this.instance = vm
    }

    sendMessage(message: MessageRequestEntity): Promise<any> {
        return this.instance.appContext.config.globalProperties.$handler.sendMessage(message)
    }

    sendMessageToBackground(handler: string, data: Record<string, any>) {
        let message: MessageRequestEntity = {
            source: 'Content',
            target: 'Background',
            handler,
            data
        };
        return this.sendMessage(message)
    }

    getEvents(): Ref<({ remove: () => void } | undefined)[]> {
        return this.instance.appContext.config.globalProperties.$events
    }

    getContainerId(): string {
        return this.instance.appContext.config.globalProperties.$containerId
    }

    handleDestroy(): void {
        this.instance.appContext.config.globalProperties.$handleDestroy()
    }

    getRuleData(): Ref<RuleEntity> {
        return this.instance.appContext.config.globalProperties.$ruleData
    }

}