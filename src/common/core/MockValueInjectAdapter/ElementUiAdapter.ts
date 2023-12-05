import { IAdapter } from '@/common/core/MockValueInjectAdapter/IAdapter';
import { RuleItemInjectEntity } from '@/common/entitys/PageEntity';
import { getContextDocument } from '@/common/core/MockValueInjectAdapter/util/InjectUtile';
import BaseAdapter from '@/common/core/MockValueInjectAdapter/BaseAdapter';
import TaskQueue from '@/common/utils/TaskQueue';

export default class ElementUiAdapter extends BaseAdapter {
  adapterName = 'ElementUI';
  selectQueue = new TaskQueue();

  select(rule: RuleItemInjectEntity) {
    this.selectQueue.addTask(() => new Promise<void>(resolve => {
      let doc = getContextDocument(rule.context);
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
                let keys = Object.keys(elSelectOptionList).sort(() => Math.random() > 0.5 ? -1 : 1).map(value => Number(value));
                let sIndex = this.getRandomIndex(elSelectOptionList.length);
                for (let i = 0; i <= sIndex; i++) {
                  elSelectOptionList[keys[i]].click();
                }
              } else {
                let index = this.getRandomIndex(elSelectOptionList.length);
                elSelectOptionList[index].click();
              }
            }
          }
        }
        resolve();
      }, 100);
    }));
  }
}