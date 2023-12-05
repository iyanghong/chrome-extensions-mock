import {MessageRequestEntity} from '@/common/entitys/MessageType';
import PageRuleStoreService from '@/common/store/PageRuleStore';
import {RuleEntity} from '@/common/entitys/PageEntity';
import Mock from '@/common/core/generate/index';
import MockMenuStore from "@/common/store/MockMenuStore";
import {MenuEntity} from "@/common/core/generate/menu";

const pageRuleStore = new PageRuleStoreService();
const menuStore = new MockMenuStore()

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
  },
  async getMockValue(expression: string) {
    return mock.parse(expression)
  },
  async setFocusedInputMockData(expression: string, tabId: number) {
    let value = mock.parse(expression)
    await chrome.scripting.executeScript({
      target: {tabId: tabId},
      func: (val: string) => {
        let focusedElement = document.activeElement;
        let win = window
        // @ts-ignore
        if (document.activeElement.tagName == 'IFRAME') {
          // @ts-ignore
          focusedElement = document.activeElement.contentWindow.document.activeElement
          // @ts-ignore
          win = document.activeElement.contentWindow
        }
        console.log(focusedElement)
        if (focusedElement) {
          if (focusedElement.classList.contains('mini-textbox-input')){
            let idStr = focusedElement.getAttribute('id') || ''
            let elIndex = idStr.lastIndexOf('$')
            let realId = idStr.substring(0,elIndex)
            console.log(win)
            // @ts-ignore
            if (realId){
              //@ts-ignore
              win.mini.get(realId).setValue(val)
            }
          }else {
            // @ts-ignore
            focusedElement.value = val
            const event = document.createEvent('HTMLEvents');
            event.initEvent('input', false, true);
            focusedElement.dispatchEvent(event);
          }
        }
        return true
      },
      args: [value]
    })
  },
};

const mockMenuHandler = {
  async getAllMockMenu() {
    return menuStore.getAll()
  },
  async getTreeMockMenuData() {
    return menuStore.getTreeData()
  },
  async saveMockMenu(data: MenuEntity) {
    return await menuStore.save(data)
  },
  async removeMockMenu(id: string) {
    return await menuStore.remove(id)
  },
  async getMockMenu(id: string) {
    return menuStore.get(id)
  }
};
export default {
  ...pageRuleHandler,
  ...mockHandler,
  ...mockMenuHandler
};