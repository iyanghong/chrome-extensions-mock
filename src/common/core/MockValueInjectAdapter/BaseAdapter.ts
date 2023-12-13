import {IAdapter} from '@/common/core/MockValueInjectAdapter/IAdapter';
import {RuleItemInjectEntity} from '@/common/entitys/PageEntity';
import {getContextDocument} from '@/common/core/MockValueInjectAdapter/util/InjectUtile';
import {isFunction} from '@/common/utils/is';

/**
 * BaseAdapter class that implements the IAdapter interface.
 * This class provides methods to interact with different types of HTML elements.
 */
export default class BaseAdapter implements IAdapter {
  adapterName = 'Base';

  /**
   * Method to interact with checkbox elements.
   * @param {RuleItemInjectEntity} rule - The rule object containing the context and realPath.
   */
  checkbox(rule: RuleItemInjectEntity): void {
    let elList = getContextDocument(rule.context).querySelectorAll(rule.realPath);
    if (elList.length) {
      this.clickOnRandomAnyElement(elList)
    }
  }

  /**
   * Method to interact with input elements.
   * @param {RuleItemInjectEntity} rule - The rule object containing the context, realPath and value.
   */
  input(rule: RuleItemInjectEntity): void {
    let inputEl = getContextDocument(rule.context).querySelector(rule.realPath);
    if (inputEl) {
      //@ts-ignore
      inputEl.value = rule.value;
      let event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      event.initEvent('change', false, true);
      inputEl.dispatchEvent(event);
    }
  }

  /**
   * Method to interact with radio elements.
   * @param {RuleItemInjectEntity} rule - The rule object containing the context and realPath.
   */
  radio(rule: RuleItemInjectEntity): void {
    let elList = getContextDocument(rule.context).querySelectorAll(rule.realPath);
    if (elList.length) {
      this.clickOnEnElement(elList)
    }
  }

  /**
   * Method to interact with select elements.
   * @param {RuleItemInjectEntity} rule - The rule object containing the context and realPath.
   */
  select(rule: RuleItemInjectEntity): void {
    let selectEl = getContextDocument(rule.context).querySelector(rule.realPath);
    if (selectEl) {
      let options = selectEl.querySelectorAll('option');
      if (options.length){
        options[this.getRandomIndex(options.length)].dispatchEvent(new Event('click', {
          bubbles: true,
          cancelable: true
        }));
      }
    }
  }

  /**
   * Method to interact with switch elements.
   * @param {RuleItemInjectEntity} rule - The rule object containing the context and realPath.
   */
  switch(rule: RuleItemInjectEntity): void {
    let el = getContextDocument(rule.context).querySelector(rule.realPath);
    if (!el) return
    let isSwitchOpen = this.getRandomNumBoth(0, 1);
    if (isSwitchOpen) {
      if (isFunction((el as HTMLElement).click)) {
        (el as HTMLElement).click()
      } else {
        el.dispatchEvent(new Event('click', {
          bubbles: true,
          cancelable: true
        }));
      }
    }
  }

  /**
   * Method to get a random index within the given length.
   * @param {number} length - The length of the array.
   * @returns {number} A random index.
   */
  getRandomIndex(length: number): number {
    return this.getRandomNumBoth(0, length - 1);
  }

  /**
   * Method to get a random number between the given range.
   * @param {number} Min - The minimum number.
   * @param {number} Max - The maximum number.
   * @returns {number} A random number.
   */
  getRandomNumBoth(Min: number, Max: number): number {
    let Range = Max - Min;
    let Rand = Math.random();
     //四舍五入
    return Min + Math.round(Rand * Range);
  }

  /**
   * Method to click on random elements from a given list.
   * @param {NodeListOf<Element>} elList - The list of elements.
   * @protected
   */
  protected clickOnRandomAnyElement(elList: NodeListOf<Element>) {
    if (!elList.length) return
    let keys = Object.keys(elList).sort(() => Math.random() > 0.5 ? -1 : 1).map(value => Number(value));
    let index = this.getRandomIndex(elList.length);
    for (let i = 0; i <= index; i++) {
      let clickEl = elList[keys[i]]
      //@ts-ignore
      if (isFunction(clickEl.click)) {
        //@ts-ignore
        clickEl.click()
      } else {
        clickEl.dispatchEvent(new Event('click', {
          bubbles: true,
          cancelable: true
        }));
      }
    }
  }

  /**
   * Method to click on a single random element from a given list.
   * @param {NodeListOf<Element>} elList - The list of elements.
   * @protected
   */
  protected clickOnEnElement(elList: NodeListOf<Element>) {
    if (!elList.length) return
    let index = this.getRandomIndex(elList.length)
    let clickEl = elList[index]
    // @ts-ignore
    if (isFunction(clickEl.click)) {
      // @ts-ignore
      clickEl.click()
    } else {
      clickEl.dispatchEvent(new Event('click', {
        bubbles: true,
        cancelable: true
      }));
    }
  }
}
