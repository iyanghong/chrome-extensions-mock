import {MessageRequestEntity} from '@/common/entitys/MessageType';
import PageRuleStoreService from '@/common/store/PageRuleStore';
import {RuleEntity, RuleItemEntity, RuleItemInjectEntity} from '@/common/entitys/PageEntity';
import Mock from '@/common/core/generate/index';
import MockMenuStore from '@/common/store/MockMenuStore';
import {MenuEntity} from '@/common/core/generate/menu';
import {useCurrentTab} from '@/common/utils/ChromeUtil';

const pageRuleStore = new PageRuleStoreService();
const menuStore = new MockMenuStore();

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
    try {
      chrome.tabs.sendMessage(data.tabId, message).then();
    } catch (e) {
      console.error(e)
    }
    return true
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
    return mock.getAllMockEntity();
  },
  async getMockValue(expression: string) {
    return mock.parse(expression);
  },
  async setFocusedInputMockData(expression: string, tabId: number) {
    let value = mock.parse(expression);
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: function(val: string) {
        const getActiveDocument = (doc: Document) => {
          if (doc.activeElement?.tagName == 'IFRAME') {
            // @ts-ignore
            return getActiveDocument(doc.activeElement.contentWindow.document);
          } else {
            return doc;
          }
        };
        let focusedElement = getActiveDocument(document)?.activeElement;

        if (focusedElement) {
          // @ts-ignore
          focusedElement.value = val;
          const event = document.createEvent('HTMLEvents');
          event.initEvent('input', false, true);
          event.initEvent('change', false, true);
          focusedElement.dispatchEvent(event);
        }
        return true;
      },
      args: [value]
    });
  },
  async setMockData(rules: RuleItemEntity[]) {

  }
};

const mockMenuHandler = {
  async getAllMockMenu() {
    return menuStore.getAll();
  },
  async getTreeMockMenuData() {
    return menuStore.getTreeData();
  },
  async saveMockMenu(data: MenuEntity) {
    return await menuStore.save(data);
  },
  async removeMockMenu(id: string) {
    return await menuStore.remove(id);
  },
  async getMockMenu(id: string) {
    return menuStore.get(id);
  }
};
export default {
  ...pageRuleHandler,
  ...mockHandler,
  ...mockMenuHandler,
  async getInjectRuleValues(data: RuleItemEntity[]) {
    let injectData: RuleItemInjectEntity[] = data.map(rule => {
      return {
        ...rule,
        value: mock.parse(rule.mockKey)
      };
    });
    console.log('injectData',injectData)
    return injectData
  }
};