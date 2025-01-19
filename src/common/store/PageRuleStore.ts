import { RuleEntity } from '../entitys/PageEntity';
import { getStorage, setStorage } from '../utils/cache';

const PAGE_RULE_CACHE_KEY = 'PageRule';

export default class PageRuleStore {
  rules: RuleEntity[] = [];
  isInitialized: boolean = false;
  constructor() {
    this.refresh().then();
  }

  async doCache() {
    await setStorage(PAGE_RULE_CACHE_KEY, this.rules);
  }

  async refresh() {
    this.rules = (await getStorage<RuleEntity[]>(PAGE_RULE_CACHE_KEY, [])).filter(it => it.id);
    this.isInitialized = true;
  }

  async saveRule(rule: RuleEntity) {
    let checkRule = this.rules.filter(it => it.id == rule.id)[0];
    if (checkRule) {
      this.rules = this.rules.map(it => {
        if (it.id == rule.id) return rule;
        return it;
      });
    } else {
      this.rules.push(rule);
    }
    await this.doCache();
  }

  async removeRule(id: string) {
    this.rules = this.rules.filter(it => it.id != id);
    await this.doCache();
  }

  getRule(id: string) {
    let rule = this.rules.filter(it => it.id == id)[0];
    if (!rule) rule = { id: '' } as RuleEntity;
    return rule;
  }

  // 获取网站跟地址的所有规则
  async getOriginRule(origin: string) {
    if(!this.isInitialized) await this.refresh();
    return this.rules.filter(rule => rule.origin == origin);
  }

  //获取当前页面规则
  getPageRule(url: string) {
    return this.rules.filter(rule => rule.url == url);
  }

  getAllRule() {
    return this.rules;
  }

  async setAllRule(rules) {
    this.rules = rules;
    await this.doCache();
  }
}