import {RuleEntity} from "../entitys/PageEntity";
import {getStorage, setStorage} from "../utils/cache";

const PAGE_RULE_CACHE_KEY = 'PageRule'

export default class PageRuleStore{
    rules: RuleEntity[] = []

    constructor() {
        this.refresh().then()
    }

    async doCache() {
        await setStorage(PAGE_RULE_CACHE_KEY, this.rules)
    }

    async refresh() {
        this.rules = await getStorage<RuleEntity[]>(PAGE_RULE_CACHE_KEY, [])
    }

    async saveRule(rule: RuleEntity) {
        let checkRule = this.rules.filter(it => it.id == rule.id)[0]
        if (checkRule) {
            this.rules = this.rules.map(it => {
                if (it.id == rule.id) return rule
                return it
            })
        }
        this.rules.push(rule)

        await this.doCache()
    }

    async removeRule(id: string) {
        this.rules = this.rules.filter(it => it.id != id)
        await this.doCache()
    }

    getRule(id: string) {
        let rule = this.rules.filter(it => it.id == id)[0]
        if (!rule) rule = {id: ''} as RuleEntity
        return rule
    }

    // 获取网站跟地址的所有规则
    getOriginRule(origin: string) {
        return this.rules.filter(rule => rule.origin == origin)
    }

    //获取当前页面规则
    getPageRule(url: string) {
        return this.rules.filter(rule => rule.url == url)
    }

    getAllRule() {
        return this.rules
    }
}