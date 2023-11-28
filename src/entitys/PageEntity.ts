export interface PageEntity{
    title:string // 网站标题
    url:string
    rules:PageRuleItemEntity[]
}
export type PageRuleType = 'input' | 'radio' | 'checkbox' | 'select'
export interface PageRuleItemEntity{
    id:string // 生成随机id
    name:string  // 规则的name，用于识别mock
    label:string // 规则的中文label
    url:string  // 所在页面
    type:PageRuleType // 类型
    order:number // 排序
    adapter?:string // 适配器
}