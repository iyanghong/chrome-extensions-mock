import {PageEntity, PageRuleItemEntity} from "@/entitys/PageEntity";
import {getStorage, setStorage} from "@/utils/cache";
const PAGE_RULE_CACHE_KEY = 'PageRule'

interface PageRuleDataEntity {
    [key:string] : PageEntity[]
}
export default class PageRuleStore{
    pageRuleData:PageRuleDataEntity = {}

  constructor() {}

    async updateOrigin(data:PageRuleDataEntity){
        await setStorage(PAGE_RULE_CACHE_KEY,data)
    }

    /**
     * 更新某个页面数据
     * @param origin 域
     * @param url 页面链接
     * @param data 数据
     */
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

    async updateRule(origin:string,url:string,data:PageRuleItemEntity){
        let isUpdateFlag = false // 是否检测到更新

        for (let key in this.pageRuleData){
            if (origin === key){
                this.pageRuleData[key] = this.pageRuleData[key].map(page => {
                    if (page.url === url){
                        page.rules = page.rules.map(rule => {
                            if (rule.id === data.id){
                                isUpdateFlag = true
                                return  data
                            }
                            return rule
                        })
                    }
                    return page
                }) as PageEntity[]
                break
            }
        }
        if (isUpdateFlag) await this.doCache()
    }


    /**
     * 更新数据
     */
    async refreshData(){
        this.pageRuleData = await getStorage<PageRuleDataEntity>(PAGE_RULE_CACHE_KEY)
    }

    async doCache(){
        await setStorage(PAGE_RULE_CACHE_KEY,this.pageRuleData)
    }
}