import {MessageRequestEntity} from "@/common/entitys/MessageType";
import PageRuleStoreService from '@/common/store/PageRuleStore'
import {RuleEntity} from "@/common/entitys/PageEntity";

const pageRuleStore = new PageRuleStoreService()
console.log(pageRuleStore.getAllRule())
export default {
    async EmitContentOpenPageRuleForm(data: { id: string, tabId: number }) {
        let rule: any = pageRuleStore.getRule(data.id || '')
        let message: MessageRequestEntity = {
            source: 'Background',
            target: 'Content',
            handler: 'OpenPageRuleFrom',
            data: rule
        }
        return chrome.tabs.sendMessage(data.tabId, message)
    },
    async SavePageRule(data: RuleEntity) {
        return pageRuleStore.saveRule(data)
    },
    async GetOriginRules(origin:string){
        console.log('GetOriginRules ',pageRuleStore.getOriginRule(origin))
        return pageRuleStore.getOriginRule(origin)
    },
    async GetPageRules(url:string){
        return pageRuleStore.getPageRule(url)
    },
    async GetPageRule(id: string) {
        return pageRuleStore.getRule(id)
    }
}