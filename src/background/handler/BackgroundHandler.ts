import { MessageRequestEntity } from '@/common/entitys/MessageType';
import PageRuleStoreService from '@/common/store/PageRuleStore';
import { RuleEntity } from '@/common/entitys/PageEntity';
import Mock from '@/common/core/generate/index';

const pageRuleStore = new PageRuleStoreService();
console.log(pageRuleStore.getAllRule());

const mock = new Mock();

const pageRuleHandler = {
  async EmitContentOpenPageRuleForm(data: { id: string, tabId: number }) {
    let rule: any = pageRuleStore.getRule(data.id);
    let message: MessageRequestEntity = {
      source: 'Background',
      target: 'Content',
      handler: 'OpenPageRuleFrom',
      data: rule
    };
    return chrome.tabs.sendMessage(data.tabId, message);
  },
  async SavePageRule(data: RuleEntity) {
    return pageRuleStore.saveRule(data);
  },
  async GetOriginRules(origin: string) {
    return pageRuleStore.getOriginRule(origin);
  },
  async GetPageRules(url: string) {
    return pageRuleStore.getPageRule(url);
  },
  async GetPageRule(id: string) {
    return pageRuleStore.getRule(id);
  },
  async GetAllPageRule() {
    return pageRuleStore.getAllRule();
  },
  async DeleteRule(id: string) {
    return pageRuleStore.removeRule(id);
  }
};

const mockHandler = {
  async getAllMock() {
    return mock.getAllList();
  },
  async getAllMockEntity() {
    return mock.getAllMockEntity()
  }
};

const mockMenuHandler = {};
export default {
  ...pageRuleHandler,
  ...mockHandler,
  ...mockMenuHandler
};