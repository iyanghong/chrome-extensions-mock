import {PageEntity, RuleEntity} from "../entitys/PageEntity";
import {getStorage, setStorage} from "../utils/cache";

const PAGE_RULE_CACHE_KEY = 'PageRule'

export default class PageRuleStore{
    rules: RuleEntity[] = []

    async doCache() {
        await setStorage(PAGE_RULE_CACHE_KEY, this.rules)
    }

    async refreshData() {
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
        let rule = this.rules.filter(it => it.id != id)[0]
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


    /*pageRuleData:PageRuleDataEntity = {}

    constructor() {
        this.refreshData().then()
    }

    async updateOrigin(data:PageRuleDataEntity){
        await setStorage(PAGE_RULE_CACHE_KEY,data)
    }

    /!**
     * 更新某个页面数据
     * @param origin 域
     * @param url 页面链接
     * @param data 数据
     *!/
    async updatePage(origin:string,url:string,data:PageRuleDataEntity){

        let isUpdateFlag = false // 是否检测到更新

        for (let key in this.pageRuleData){
            if (origin === key){
                this.pageRuleData[key] = this.pageRuleData[key].map(page => {
                    if (page.url === url){
                        isUpdateFlag = true
                        return  data
                    }
                    return page
                }) as PageEntity[]
                break
            }
        }
        if (isUpdateFlag) await this.doCache()
    }

    async saveRule(origin:string,url:string,data:PageRuleItemEntity){
        let isUpdateFlag = false // 是否检测到更新

        for (let key in this.pageRuleData){
            if (origin === key){
                this.pageRuleData[key] = this.pageRuleData[key].map(page => {
                    if (page.url === url){
                        // 已存在，则更新
                        if (page.rules.filter(rule => rule.id == data.id)[0]) {
                            page.rules = page.rules.map(rule => {
                                if (rule.id === data.id) {
                                    isUpdateFlag = true
                                    return data
                                }
                                return rule
                            })
                        } else {
                            // 添加
                            page.rules.push(data)
                        }
                    }
                    return page
                }) as PageEntity[]
                break
            }
        }
        if (isUpdateFlag) await this.doCache()
    }


    /!**
     * 更新数据
     *!/
    async refreshData(){
        this.pageRuleData = await getStorage<PageRuleDataEntity>(PAGE_RULE_CACHE_KEY, {})
    }

    async getPageRuleItem(id: string): Promise<PageRuleItemEntity | null> {
        for (let key in this.pageRuleData) {
            let pageDataList: PageEntity[] = this.pageRuleData[key]
            if (!pageDataList.length) continue
            for (let pageData of pageDataList) {
                if (!pageData.rules.length) continue
                let result = pageData.rules.filter(it => it.id === id)[0]
                if (result) return result
            }
        }
        return null
    }

    async removeRule(id: string) {
        for (let key in this.pageRuleData) {
            this.pageRuleData[key] = this.pageRuleData[key].map(page => {
                page.rules = page.rules.filter(rule => rule.id !== id)
                return page
            })
        }
        await this.doCache()
    }

    async doCache(){
        await setStorage(PAGE_RULE_CACHE_KEY,this.pageRuleData)
    }*/
}