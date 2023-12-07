/*
data table:
id origin url title rules

* */
export interface RuleEntity {
  id: string,
  name: string // 规则名字
  origin: string // 网站跟地址
  url: string    // URL
  siteTitle: string // 网站标识
  order: number // 排序
  events?: RuleEvent[]
  ruleItems: RuleItemEntity[]
}

export interface RuleEvent {
  type: 'before' | 'after',
  name: string
  content: string
}

export interface RuleItemEntity {
  id: string; // 生成随机id
  order: number; // 排序
  // 元素的标签名
  tagName: string;
  // 规则的中文label
  name: string;
  context: string[]; // 所处文档上下文，因为不确定是在哪个iframe上
  // 元素真实地址
  realPath: string;
  // 使用的适配器
  adapter: string;
  // 表单类型
  type: PageRuleType | string;
  // mock的名字
  mockName: string;
  // mock的唯一标识
  mockKey: string;
}

export interface RuleItemInjectEntity extends RuleItemEntity {
  value: string;
}


export interface PageEntity {
  title: string; // 网站标题
  origin: string;
  url: string;
  rules: PageRuleItemEntity[];
}

export type PageRuleType = 'input' | 'radio' | 'checkbox' | 'select' | 'switch'

export interface PageRuleItemEntity {
  id: string; // 生成随机id
  url: string;  // 所在页面
  order: number; // 排序
  // 元素的标签名
  tagName: string;
  // 规则的中文label
  name: string;
  // 元素真实地址
  realPath: string;
  // 使用的适配器
  adapter: string;
  // 表单类型
  type: PageRuleType | string;
  // mock的名字
  mockName: string;
  // mock的唯一标识
  mockKey: string;
}