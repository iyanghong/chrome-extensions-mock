import { IAdapter } from '@/common/core/MockValueInjectAdapter/IAdapter';
import { RuleItemInjectEntity } from '@/common/entitys/PageEntity';
import { getContextDocument } from '@/common/core/MockValueInjectAdapter/util/InjectUtile';
import { isFunction } from '@/common/utils/is';

export default class BaseAdapter implements IAdapter {
  adapterName = 'Base';

  checkbox(rule: RuleItemInjectEntity): void {
    let elList = getContextDocument(rule.context).querySelectorAll(rule.realPath);
    if (elList.length) {
      let keys = Object.keys(elList).sort(() => Math.random() > 0.5 ? -1 : 1).map(value => Number(value));
      let index = this.getRandomIndex(elList.length);
      for (let i = 0; i <= index; i++) {
        let clickEl = elList[keys[i]]
        //@ts-ignore
        if (isFunction(clickEl.click)){
          //@ts-ignore
          clickEl.click()
        }else {
          let event = document.createEvent('HTMLEvents');
          event.initEvent('click', false, true);
          clickEl.dispatchEvent(event);
        }
      }
    }
  }

  input(rule: RuleItemInjectEntity): void {

    let inputEl = getContextDocument(rule.context).querySelector(rule.realPath);
    console.log('doc => ',getContextDocument(rule.context))
    console.log('inputEl => ',inputEl)
    if (inputEl) {
      //@ts-ignore
      inputEl.value = rule.value;
      let event = document.createEvent('HTMLEvents');
      event.initEvent('input', false, true);
      event.initEvent('change', false, true);
      inputEl.dispatchEvent(event);
    }
  }

  radio(rule: RuleItemInjectEntity): void {
    let elList = getContextDocument(rule.context).querySelectorAll(rule.realPath);
    if (elList.length) {
      let index = this.getRandomIndex(elList.length)
      let clickEl = elList[index]
      // @ts-ignore
      if (isFunction(clickEl.click)){
        // @ts-ignore
        clickEl.click()
      }else {
        let event = document.createEvent('HTMLEvents');
        event.initEvent('click', false, true);
        clickEl.dispatchEvent(event);
      }

    }
  }

  select(rule: RuleItemInjectEntity): void {
    let selectEl = getContextDocument(rule.context).querySelector(rule.realPath);
    if (selectEl) {
      let options = selectEl.querySelectorAll('option');
      if (options.length){
        let event = document.createEvent('HTMLEvents');
        event.initEvent('click', false, true);
        options[this.getRandomIndex(options.length)].dispatchEvent(event);
      }
    }
  }

  switch(rule: RuleItemInjectEntity): void {
    let el = getContextDocument(rule.context).querySelector(rule.realPath);
    if (el) {
      let isSwitchOpen = this.getRandomNumBoth(0, 1);
      if (isSwitchOpen) {
        // @ts-ignore
        if (isFunction(el.click)){
          // @ts-ignore
          el.click()
        }else {
          let event = document.createEvent('HTMLEvents');
          event.initEvent('click', false, true);
          el.dispatchEvent(event);
        }
      }
    }
  }

  getRandomIndex(length: number) {
    return this.getRandomNumBoth(0, length - 1);
  }

  getRandomNumBoth(Min, Max) {
    let Range = Max - Min;
    let Rand = Math.random();
     //四舍五入
    return Min + Math.round(Rand * Range);
  }


}