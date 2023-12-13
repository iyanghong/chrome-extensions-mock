import {RuleItemInjectEntity} from '@/common/entitys/PageEntity';
import BaseAdapter from '@/common/core/MockValueInjectAdapter/BaseAdapter';
import {getContextDocument} from "@/common/core/MockValueInjectAdapter/util/InjectUtile";
import TaskQueue from "@/common/utils/TaskQueue";
interface MiniUi{

}
export default class MiniUIAdapter extends BaseAdapter {
    adapterName = 'MiniUI';
    selectQueue = new TaskQueue();
    select(rule: RuleItemInjectEntity) {
        this.selectQueue.addTask(() => new Promise<void>(resolve => {
            let doc = getContextDocument(rule.context);
            let el = doc.querySelector(rule.realPath);

            if (!el) {
                resolve();
                return;
            }
            console.log(el)

            el.dispatchEvent(new Event('click', {
                cancelable: true,
                bubbles: true
            }));
            setTimeout(() => {
                // @ts-ignore
                let miniPopup = Array.from(doc.querySelectorAll(".mini-popup")).find(popup => popup.style.display != 'none')
                if (miniPopup) {
                    let options = miniPopup.querySelectorAll('.mini-listbox-items .mini-listbox-item')
                    if (options && options.length) {
                        let index = this.getRandomIndex(options.length)
                        // @ts-ignore
                        options[index].click()
                    }
                }
                resolve();
            }, 100);
        }));
    }

    checkbox(rule: RuleItemInjectEntity) {
        let el = getContextDocument(rule.context).querySelector(rule.realPath);
        if (!el) return
        if (el.classList.contains('mini-checkboxlist-item')) {
            let realId = this.getMiniRealId(el)
            if (!realId) return;
            let elList = getContextDocument(rule.context).querySelectorAll(`.mini-checkboxlist-item[id^="${realId}"]`)
            this.clickOnRandomAnyElement(elList)
        } else { // 如果只有一个checkbox 那就当开关来使用
            this.switch(rule)
        }
    }

    radio(rule: RuleItemInjectEntity) {
        let el = getContextDocument(rule.context).querySelector(rule.realPath);
        if (!el) return
        if (el.classList.contains('mini-radiobuttonlist-item')) {
            let realId = this.getMiniRealId(el)
            if (!realId) return;
            let elList = getContextDocument(rule.context).querySelectorAll(`.mini-radiobuttonlist-item[id^="${realId}"]`)
            this.clickOnEnElement(elList)
        } else { // 如果只有一个checkbox 那就当开关来使用
            this.switch(rule)
        }
    }

    private getMiniRealId(el: Element) {
        let id = el.getAttribute('id')
        if (!id) return '';
        return id.substring(0, id.indexOf('$'))
    }

}