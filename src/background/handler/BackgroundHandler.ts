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
  async savePageRule(data: RuleEntity) {
    return pageRuleStore.saveRule(data);
  },
  async getOriginRules(origin: string) {
    return pageRuleStore.getOriginRule(origin);
  },
  async getPageRules(url: string) {
    return pageRuleStore.getPageRule(url);
  },
  async getPageRule(id: string) {
    return pageRuleStore.getRule(id);
  },
  async getAllPageRule() {
    return pageRuleStore.getAllRule();
  },
  async deleteRule(id: string) {
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
          focusedElement.dispatchEvent(new Event('input'))
          focusedElement.dispatchEvent(new Event('change'))
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