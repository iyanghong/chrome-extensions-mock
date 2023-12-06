/**
 * Importing necessary interfaces and utility functions
 */
import AdapterInterface, { AdapterResolveItem } from '@/content/CaptureAdapter/AdapterInterface';
import { getDomPath, getFormItemTypeText, getInputPlaceholder } from '@/content/util';

/**
 * Class ElementUiAdapter implementing AdapterInterface
 * This class provides methods to interact with Element UI components
 */
export default class ElementUiAdapter implements AdapterInterface {
  adapterName = 'ElementUI';

  /**
   * Method to get the form item label
   * @param {Element} el - The element to get the label from
   * @param {number} deep - The depth to search for the label
   * @returns {string} - The label text
   */
  getFormItemLabel(el, deep: number = 4): string {
    while (deep > 0) {
      if (el.classList.contains('el-form-item')) {
        return el.querySelector('.el-form-item__label')?.innerText;
      }
      deep--;
      el = el.parentNode;
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
  checkbox(target: Element): AdapterResolveItem | undefined {
    if (!target.classList.contains('el-checkbox__label') && !target.classList.contains('el-checkbox__inner')) {
      return undefined;
    }
    if (target.parentNode?.parentNode) target = target.parentNode.parentNode as Element;
    if (target.classList.contains('el-checkbox') && target.parentNode) target = target.parentNode as Element;
    let type = 'checkbox';
    return this.resolveAdapterItem(target, type,' .el-checkbox__original');
  }

  /**
   * Method to handle input elements
   * @param {Element} target - The target element
   * @returns {AdapterResolveItem | undefined} - The resolved adapter item
   */
  input(target: Element): AdapterResolveItem | undefined {
    if (!target.classList.contains('el-input__inner') && !target.classList.contains('el-textarea__inner')) return undefined;
    return this.resolveAdapterItem(target, 'input');
  }

  /**
   * Method to handle radio elements
   * @param {Element} target - The target element
   * @returns {AdapterResolveItem | undefined} - The resolved adapter item
   */
  radio(target: Element): AdapterResolveItem | undefined {
    if (!target.classList.contains('el-radio__label') && !target.classList.contains('el-radio__inner')) {
      return undefined;
    }
    if (target.parentNode?.parentNode) target = target.parentNode.parentNode as Element;
    if (target.classList.contains('el-radio') && target.parentNode) target = target.parentNode as Element;
    return this.resolveAdapterItem(target, 'radio',' .el-radio__original');
  }

  /**
   * Method to handle select elements
   * @param {Element} target - The target element
   * @returns {AdapterResolveItem | undefined} - The resolved adapter item
   */
  select(target: Element): AdapterResolveItem | undefined {
    // @ts-ignore
    if (!(target.classList.contains('el-input__inner') && target.parentNode?.parentNode?.classList?.contains('el-select')) && !target.classList.contains('el-select__tags')) {
      return undefined;
    }
    target = target.parentNode as Element;
    if (!target.classList.contains('el-select__tags')) target = target.parentNode as Element;
    let type = 'select';
    return this.resolveAdapterItem(target, type);
  }

  /**
   * Method to handle switch elements
   * @param {Element} target - The target element
   * @returns {AdapterResolveItem | undefined} - The resolved adapter item
   */
  switch(target: Element): AdapterResolveItem | undefined {
    if (!target.classList.contains('el-switch__core')) {
      return undefined;
    }
    let type = 'switch';
    return this.resolveAdapterItem(target, type);
  }
}