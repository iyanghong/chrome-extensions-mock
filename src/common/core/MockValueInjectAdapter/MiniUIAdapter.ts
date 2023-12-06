import {RuleItemInjectEntity} from '@/common/entitys/PageEntity';
import BaseAdapter from '@/common/core/MockValueInjectAdapter/BaseAdapter';
import {getContextDocument} from "@/common/core/MockValueInjectAdapter/util/InjectUtile";
import TaskQueue from "@/common/utils/TaskQueue";

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
            //@ts-ignore
            el.click();
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

}