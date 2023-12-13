import {RuleItemInjectEntity} from '@/common/entitys/PageEntity';
import BaseAdapter from '@/common/core/MockValueInjectAdapter/BaseAdapter';
import {getContextDocument} from "@/common/core/MockValueInjectAdapter/util/InjectUtile";
import TaskQueue from "@/common/utils/TaskQueue";

export default class NaiveUIAdapter extends BaseAdapter {
  adapterName = 'NaiveUI';
  selectQueue = new TaskQueue();

  input(rule: RuleItemInjectEntity) {
    let el = getContextDocument(rule.context).querySelector(rule.realPath)
    if (el) {
      (el as any).value = rule.value
      el.dispatchEvent(new Event('input'))
      el.dispatchEvent(new Event('change'))
    }
  }

  checkbox(rule: RuleItemInjectEntity) {
    let el = getContextDocument(rule.context).querySelector(rule.realPath)
    if (!el) return
    let elList = el.querySelectorAll('.n-checkbox')
    this.clickOnRandomAnyElement(elList)
  }

  radio(rule: RuleItemInjectEntity) {
    let el = getContextDocument(rule.context).querySelector(rule.realPath)
    if (!el) return
    let elList = el.querySelectorAll('.n-radio-input')
    this.clickOnEnElement(elList)
  }

  select(rule: RuleItemInjectEntity) {
    this.selectQueue.addTask(() => new Promise<void>(resolve => {
      let doc = getContextDocument(rule.context);
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
        let selectMenu = Array.from(doc.querySelectorAll('.n-select-menu')).find(e => (e as HTMLElement).style.display != 'none')
        if (!selectMenu) {
          resolve()
          return
        }
        let selectOptions = selectMenu.querySelectorAll('.n-base-select-option')
        this.clickOnEnElement(selectOptions)
        resolve();
      }, 200);
    }));
  }

}