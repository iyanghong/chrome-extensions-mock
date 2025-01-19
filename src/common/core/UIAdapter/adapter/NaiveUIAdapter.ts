import AdapterInterface, { AdapterResolveItem } from '@/common/core/UIAdapter/AdapterInterface';
import { getDomPath, getFormItemTypeText, getInputPlaceholder } from '@/content/util';
import TaskQueue from '@/common/utils/TaskQueue';
import { RuleItemInjectEntity } from '@/common/entitys/PageEntity';
import BaseMockInjectAdapter from '@/common/core/UIAdapter/BaseMockInjectAdapter';


export default class NaiveUIAdapter extends BaseMockInjectAdapter implements AdapterInterface {
  adapterName = 'NaiveUI';
  selectQueue = new TaskQueue();

  captureCheckbox(target: Element): AdapterResolveItem | undefined {
    if (target.classList.contains('n-checkbox__label') && target.parentElement?.parentElement?.parentElement?.parentElement) {
      target = target.parentElement.parentElement.parentElement.parentElement;
    }
    if (target.classList.contains('n-checkbox-group')) {
      return this.getRuleItem('checkbox', target);
    }
  }

  captureInput(target: Element): AdapterResolveItem | undefined {
    if (target.classList.contains('n-input__input-el') || target.classList.contains('n-input__textarea-el')) {
      return this.getRuleItem('input', target);
    }
  }

  captureRadio(target: Element): AdapterResolveItem | undefined {
    if (target.classList.contains('n-radio-input') && target.parentElement?.parentElement?.parentElement?.parentElement) {
      target = target.parentElement.parentElement.parentElement.parentElement;
    } else if (target.classList.contains('n-radio-button') && target.parentElement) {
      target = target.parentElement;
    } else if (target.classList.contains('n-radio__label') && target.parentElement?.parentElement) {
      target = target.parentElement.parentElement;
    }
    if (target.classList.contains('n-radio-group')) {
      return this.getRuleItem('radio', target);
    }
  }

  captureSelect(target: Element): AdapterResolveItem | undefined {
    if (target.classList.contains('n-base-selection-label') && target.parentElement?.parentElement) {
      target = target.parentElement?.parentElement;
    } else if (target.classList.contains('n-base-selection-input__content') && target.parentElement?.parentElement?.parentElement?.parentElement) {
      target = target.parentElement?.parentElement?.parentElement?.parentElement;
    }
    if (target.classList.contains('n-select')) {
      return this.getRuleItem('select', target);
    }
  }

  captureSwitch(target: Element): AdapterResolveItem | undefined {
    if (target.classList.contains('n-switch__button') && target.parentElement?.parentElement) {
      target = target.parentElement.parentElement;
    } else if (target.classList.contains('n-switch__rail') && target.parentElement) {
      target = target.parentElement;
    }
    if (target.classList.contains('n-switch')) {
      return this.getRuleItem('switch', target);
    }
  }

  protected getRuleItem(type: string, target: Element, suffixRealPath: string = ''): AdapterResolveItem {
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

  getFormItemLabel(el: Element | HTMLElement, deep: number = 4): string {
    while (deep > 0) {
      if (el.classList.contains('n-form-item')) {
        return (el.querySelector('.n-form-item-label__text') as HTMLElement).innerText;
      }
      deep--;
      if (!el || !el.parentElement) return '';
      el = el.parentElement;
    }
    return '';
  }


  mockInjectInput(rule: RuleItemInjectEntity) {
    let el = this.getContextDocument(rule.context).querySelector(rule.realPath);
    if (el) {
      (el as any).value = rule.value;
      el.dispatchEvent(new Event('input'));
      el.dispatchEvent(new Event('change'));
    }
  }

  mockInjectCheckbox(rule: RuleItemInjectEntity) {
    let el = this.getContextDocument(rule.context).querySelector(rule.realPath);
    if (!el) return;
    let elList = el.querySelectorAll('.n-checkbox');
    this.clickOnRandomAnyElement(elList);
  }

  mockInjectRadio(rule: RuleItemInjectEntity) {
    let el = this.getContextDocument(rule.context).querySelector(rule.realPath);
    if (!el) return;
    let elList = el.querySelectorAll('.n-radio-input');
    this.clickOnEnElement(elList);
  }

  mockInjectSelect(rule: RuleItemInjectEntity) {
    this.selectQueue.addTask(() => new Promise<void>(resolve => {
      let doc = this.getContextDocument(rule.context);
      let el = doc.querySelector(rule.realPath + ' .n-base-selection');
      if (!el) {
        resolve();
        return;
      }
      el.dispatchEvent(new Event('click', {
        bubbles: true,
        cancelable: true
      }));
      setTimeout(() => {
        let selectMenu = Array.from(doc.querySelectorAll('.n-select-menu')).find(e => (e as HTMLElement).style.display != 'none');
        if (!selectMenu) {
          resolve();
          return;
        }
        let selectOptions = selectMenu.querySelectorAll('.n-base-select-option');
        this.clickOnEnElement(selectOptions);
        resolve();
      }, 200);
    }));
  }
}