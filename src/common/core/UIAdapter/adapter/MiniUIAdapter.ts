import AdapterInterface, { AdapterResolveItem } from '@/common/core/UIAdapter/AdapterInterface';
import { getDomPath, getFormItemTypeText, getInputPlaceholder } from '@/content/util';
import TaskQueue from '@/common/utils/TaskQueue';
import { RuleItemInjectEntity } from '@/common/entitys/PageEntity';
import BaseMockInjectAdapter from '@/common/core/UIAdapter/BaseMockInjectAdapter';



export default class MiniUIAdapter extends BaseMockInjectAdapter implements AdapterInterface {
  adapterName = 'MiniUI';
  selectQueue = new TaskQueue();

  captureCheckbox(target: Element): AdapterResolveItem | undefined {
    if (target.parentElement?.classList.contains('mini-checkbox') || target.parentElement?.classList.contains('mini-checkboxlist-item')) {
      return this.getRuleItem('checkbox', target.parentElement);
    }
    return undefined;
  }

  captureInput(target: Element): AdapterResolveItem | undefined {
    if (target.classList.contains('mini-textbox-input') || target.classList.contains('mini-buttonedit-input')) {
      return this.getRuleItem('input', target);
    }
  }

  captureRadio(target: Element): AdapterResolveItem | undefined {
    if (target.parentElement?.classList.contains('mini-radiobutton') || target.parentElement?.classList.contains('mini-radiobuttonlist-item')) {
      return this.getRuleItem('radio', target.parentElement);
    }
  }

  captureSelect(target: Element): AdapterResolveItem | undefined {
    if (target.classList.contains('mini-buttonedit-input')) {
      let name = getInputPlaceholder(target) || this.getFormItemLabel(target);
      // @ts-ignore
      target = target.parentNode?.parentNode;
      if (target.classList.contains('mini-combobox')) {
        let realPath = getDomPath(target);
        let type = 'select';
        return {
          name,
          mockKey: type,
          adapter: this.adapterName,
          mockName: getFormItemTypeText(type) + '随机',
          realPath: realPath,
          tagName: target.tagName,
          type: type
        };
      }
    }
    return undefined;
  }

  captureSwitch(target: Element): AdapterResolveItem | undefined {
    return undefined;
  }

  getFormItemLabel(target: Element, deep = 4) {
    let el = target;
    while (deep > 0) {
      // console.log(`deep = ${deep},tag = ${el.tagName}`)
      if (el.tagName == 'TD') {
        // @ts-ignore
        return el.previousElementSibling?.innerText || '';
      }
      if (!el.parentElement) return '';
      el = el.parentElement;
      deep--;
    }
    return '';
  }

  protected getRuleItem(type: string, target: Element): AdapterResolveItem {
    let realPath = getDomPath(target);
    let name = getInputPlaceholder(target) || this.getFormItemLabel(target);
    let mockName = getFormItemTypeText(type) || '';
    if (mockName) mockName += '随机';
    return {
      name,
      mockKey: type,
      adapter: this.adapterName,
      mockName: mockName,
      realPath: realPath,
      tagName: target.tagName,
      type: type
    };
  }


  mockInjectSelect(rule: RuleItemInjectEntity) {
    this.selectQueue.addTask(() => new Promise<void>(resolve => {
      let doc = this.getContextDocument(rule.context);
      let el = doc.querySelector(rule.realPath);

      if (!el) {
        resolve();
        return;
      }
      console.log(el);

      el.dispatchEvent(new Event('click', {
        cancelable: true,
        bubbles: true
      }));
      setTimeout(() => {
        // @ts-ignore
        let miniPopup = Array.from(doc.querySelectorAll('.mini-popup')).find(popup => popup.style.display != 'none');
        if (miniPopup) {
          let options = miniPopup.querySelectorAll('.mini-listbox-items .mini-listbox-item');
          if (options && options.length) {
            let index = this.getRandomIndex(options.length);
            // @ts-ignore
            options[index].click();
          }
        }
        resolve();
      }, 100);
    }));
  }

  mockInjectCheckbox(rule: RuleItemInjectEntity) {
    let el = this.getContextDocument(rule.context).querySelector(rule.realPath);
    if (!el) return;
    if (el.classList.contains('mini-checkboxlist-item')) {
      let realId = this.getMiniRealId(el);
      if (!realId) return;
      let elList = this.getContextDocument(rule.context).querySelectorAll(`.mini-checkboxlist-item[id^="${realId}"]`);
      this.clickOnRandomAnyElement(elList);
    } else { // 如果只有一个checkbox 那就当开关来使用
      this.mockInjectSwitch(rule);
    }
  }

  mockInjectRadio(rule: RuleItemInjectEntity) {
    let el = this.getContextDocument(rule.context).querySelector(rule.realPath);
    if (!el) return;
    if (el.classList.contains('mini-radiobuttonlist-item')) {
      let realId = this.getMiniRealId(el);
      if (!realId) return;
      let elList = this.getContextDocument(rule.context).querySelectorAll(`.mini-radiobuttonlist-item[id^="${realId}"]`);
      this.clickOnEnElement(elList);
    } else { // 如果只有一个checkbox 那就当开关来使用
      this.mockInjectSwitch(rule);
    }
  }

  private getMiniRealId(el: Element) {
    let id = el.getAttribute('id');
    if (!id) return '';
    return id.substring(0, id.indexOf('$'));
  }
}