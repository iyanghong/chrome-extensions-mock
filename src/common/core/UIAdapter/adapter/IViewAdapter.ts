import BaseMockInjectAdapter from '@/common/core/UIAdapter/BaseMockInjectAdapter';
import AdapterInterface, { AdapterResolveItem } from '@/common/core/UIAdapter/AdapterInterface';
import { getDomPath, getFormItemTypeText, getInputPlaceholder } from '@/content/util';
import { RuleItemInjectEntity } from '@/common/entitys/PageEntity';
import TaskQueue from '@/common/utils/TaskQueue';

export default class IViewAdapter extends BaseMockInjectAdapter implements AdapterInterface {
  adapterName = 'IView';
  selectQueue = new TaskQueue();

  captureCheckbox(target: Element): AdapterResolveItem | undefined {
    if (target.classList.contains('ivu-checkbox-input')){
      if(target.parentElement?.parentElement?.parentElement?.classList.contains('ivu-checkbox-group')){
        return this.resolveAdapterItem(target.parentElement?.parentElement?.parentElement, 'checkbox', ' .ivu-checkbox-input');
      }
    }
    if (target.tagName == 'SPAN' && target.previousElementSibling?.classList.contains('ivu-checkbox')){
      if(target.parentElement?.parentElement?.classList.contains('ivu-checkbox-group')){
        return this.resolveAdapterItem(target.parentElement?.parentElement, 'checkbox', ' .ivu-checkbox-input');
      }
    }
    return undefined;
  }

  captureInput(target: Element): AdapterResolveItem | undefined {
    return undefined;
  }

  captureRadio(target: Element): AdapterResolveItem | undefined {
    if (!target.classList.contains('ivu-radio-group-item') && !target.classList.contains('ivu-radio-input')) {
      return undefined;
    }
    if (target.classList.contains('ivu-radio-group-item')) {
      if (target?.parentElement?.classList.contains('ivu-radio-group')) target = target.parentElement as Element;
    }
    if (target.classList.contains('ivu-radio-input')) {
      if (target?.parentElement?.parentElement?.parentElement?.classList.contains('ivu-radio-group')) target = target?.parentElement?.parentElement?.parentElement as Element;
    }
    return this.resolveAdapterItem(target, 'radio', ' .ivu-radio-input');
  }

  captureSelect(target: Element): AdapterResolveItem | undefined {
    if (!target.classList.contains('ivu-select-placeholder') && !target.classList.contains('ivu-select-arrow') && !target.classList.contains('ivu-select-selection')) {
      return undefined;
    }
    if (target.classList.contains('ivu-select-placeholder') || target.classList.contains('ivu-select-arrow')) {
      if (target?.parentElement?.parentElement?.parentElement?.classList.contains('ivu-select')) {
        target = target?.parentElement?.parentElement?.parentElement as Element;
      }
    }
    if (target.classList.contains('ivu-select-selection')) {
      if (target?.parentElement?.classList.contains('ivu-select')) {
        target = target?.parentElement as Element;
      }
    }


    return this.resolveAdapterItem(target, 'select');
  }

  captureSwitch(target: Element): AdapterResolveItem | undefined {
    if (target.classList.contains('ivu-switch')){
      return this.resolveAdapterItem(target, 'switch');
    }
    if (target.tagName == 'SPAN' && target.parentElement?.classList.contains('ivu-switch-inner')){
      if (target.parentElement?.parentElement?.classList.contains('ivu-switch')){
        return this.resolveAdapterItem(target.parentElement?.parentElement, 'switch');
      }
    }
    return undefined;
  }

  /**
   * Method to resolve adapter item
   * @param {Element} target - The target element
   * @param {string} type - The type of the element
   * @param {string} suffixPath
   * @returns {AdapterResolveItem | undefined} - The resolved adapter item
   */
  resolveAdapterItem(target: Element, type: string, suffixPath: string = ''): AdapterResolveItem | undefined {
    let realPath = getDomPath(target) + suffixPath;
    let name = getInputPlaceholder(target) || this.getFormItemLabel(target);
    if (name && (name.endsWith(':') || name.endsWith('：'))) {
      name = name.substring(0, name.length - 1);
    }
    let mockName = getFormItemTypeText(type);
    return {
      name,
      mockKey: type,
      adapter: this.adapterName,
      mockName: mockName ? mockName + '随机' : '',
      realPath: realPath,
      tagName: target.tagName,
      type: type
    };
  }

  /**
   * Method to get the form item label
   * @param {Element} el - The element to get the label from
   * @param {number} deep - The depth to search for the label
   * @returns {string} - The label text
   */
  getFormItemLabel(el: Element | HTMLElement, deep: number = 10): string {
    while (deep > 0) {
      if (el.classList.contains('ivu-form-item')) {
        const labelEL = (el.querySelector('.ivu-form-item-label') as HTMLElement);
        if (labelEL) {
          return labelEL.innerText;
        }
      }
      deep--;
      if (!el || !el.parentElement) return '';
      el = el.parentElement;
    }
    return '';
  }

  mockInjectSelect(rule: RuleItemInjectEntity) {
    this.selectQueue.addTask(() => new Promise<void>(resolve => {
      let doc = this.getContextDocument(rule.context);
      let el = doc.querySelector(rule.realPath) as HTMLElement;
      if (!el) {
        resolve();
        return;
      }
      el.dispatchEvent(new Event('click'));
      setTimeout(() => {
        let isMultiple = el.classList.contains('ivu-select-multiple');
        let selectOptions = el.querySelectorAll('.ivu-select-item');
        if (isMultiple) {
          this.clickOnRandomAnyElement(selectOptions)
        } else {
          this.clickOnEnElement(selectOptions)
        }
        resolve();
      }, 300);
    }));
  }

}