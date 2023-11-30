import {MessageRequestEntity} from "@/common/entitys/MessageType";

export default {
    EmitContentOpenPageRuleForm(data: { id: string, tabId: number }) {
        let message: MessageRequestEntity = {
            source: 'Background',
            target: 'Content',
            handler: 'OpenPageRuleFrom',
            data: {id: data.id}
        }
        return chrome.tabs.sendMessage(data.tabId, message)
    },
    SavePageRule(data: Record<string, any>) {
        console.log('SavePageRule => ', data)
    }
}