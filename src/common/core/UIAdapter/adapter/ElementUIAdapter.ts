
import AdapterInterface, { AdapterResolveItem } from '@/common/core/UIAdapter/AdapterInterface';
import { getDomPath, getFormItemTypeText, getInputPlaceholder } from '@/content/util';
import TaskQueue from '@/common/utils/TaskQueue';
import { RuleItemInjectEntity } from '@/common/entitys/PageEntity';
import BaseMockInjectAdapter from '@/common/core/UIAdapter/BaseMockInjectAdapter';

export default class ElementUIAdapter extends BaseMockInjectAdapter implements AdapterInterface {
  adapterName = 'ElementUI';
  selectQueue = new TaskQueue();
  /**
   * Method to get the form item label
   * @param {Element} el - The element to get the label from
   * @param {number} deep - The depth to search for the label
   * @returns {string} - The label text
   */
  getFormItemLabel(el: Element | HTMLElement, deep: number = 4): string {
    while (deep > 0) {
      if (el.classList.contains('el-form-item')) {
        return (el.querySelector('.el-form-item__label') as HTMLElement).innerText;
      }
      deep--;
      if (!el || !el.parentElement) return '';
      el = el.parentElement;
    }
    return '';
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
   * Method to handle checkbox elements
   * @param {Element} target - The target element
   * @returns {AdapterResolveItem | undefined} - The resolved adapter item
   */
  captureCheckbox(target: Element): AdapterResolveItem | undefined {
    if (!target.classList.contains('el-checkbox__label') && !target.classList.contains('el-checkbox__inner')) {
      return undefined;
    }
    if (target.parentElement?.parentElement) target = target.parentElement.parentElement as Element;
    if (target.classList.contains('el-checkbox') && target.parentElement) target = target.parentElement as Element;
    let type = 'checkbox';
    return this.resolveAdapterItem(target, type, ' .el-checkbox__original');
  }

  /**
   * Method to handle input elements
   * @param {Element} target - The target element
   * @returns {AdapterResolveItem | undefined} - The resolved adapter item
   */
  captureInput(target: Element): AdapterResolveItem | undefined {
    if (!target.classList.contains('el-input__inner') && !target.classList.contains('el-textarea__inner')) return undefined;
    return this.resolveAdapterItem(target, 'input');
  }

  /**
   * Method to handle radio elements
   * @param {Element} target - The target element
   * @returns {AdapterResolveItem | undefined} - The resolved adapter item
   */
  captureRadio(target: Element): AdapterResolveItem | undefined {
    if (!target.classList.contains('el-radio__label') && !target.classList.contains('el-radio__inner')) {
      return undefined;
    }
    if (target.parentElement?.parentElement) target = target.parentElement.parentElement as Element;
    if (target.classList.contains('el-radio') && target.parentElement) target = target.parentElement as Element;
    return this.resolveAdapterItem(target, 'radio', ' .el-radio__original');
  }

  /**
   * Method to handle select elements
   * @param {Element} target - The target element
   * @returns {AdapterResolveItem | undefined} - The resolved adapter item
   */
  captureSelect(target: Element): AdapterResolveItem | undefined {
    // @ts-ignore
    if (!(target.classList.contains('el-input__inner') && target.parentElement?.parentElement?.classList?.contains('el-select')) && !target.classList.contains('el-select__tags')) {
      return undefined;
    }
    target = target.parentElement as Element;
    if (!target.classList.contains('el-select__tags')) target = target.parentElement as Element;
    let type = 'select';
    return this.resolveAdapterItem(target, type);
  }

  /**
   * Method to handle switch elements
   * @param {Element} target - The target element
   * @returns {AdapterResolveItem | undefined} - The resolved adapter item
   */
  captureSwitch(target: Element): AdapterResolveItem | undefined {
    if (!target.classList.contains('el-switch__core')) {
      return undefined;
    }
    let type = 'switch';
    return this.resolveAdapterItem(target, type);
  }




  mockInjectSelect(rule: RuleItemInjectEntity) {
    this.selectQueue.addTask(() => new Promise<void>(resolve => {
      let doc = this.getContextDocument(rule.context);
      let el = doc.querySelector(rule.realPath);
      if (!el) {
        resolve();
        return;
      }
      el.dispatchEvent(new Event('click'));
      setTimeout(() => {
        let elSelectPopperList = doc.querySelectorAll('.el-select-dropdown.el-popper');
        // @ts-ignore
        for (let item of elSelectPopperList) {
          let isMultiple = item.classList.contains('is-multiple');
          if (getComputedStyle(item).display !== 'none') {
            let elSelectOptionList = item.querySelectorAll('.el-select-dropdown__item');
            if (elSelectOptionList.length) {
              if (isMultiple) {
                this.clickOnRandomAnyElement(elSelectOptionList)
              } else {
                this.clickOnEnElement(elSelectOptionList)
              }
            }
          }
        }
        resolve();
      }, 100);
    }));
  }
}