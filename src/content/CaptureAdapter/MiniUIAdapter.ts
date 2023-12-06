import AdapterInterface, {AdapterResolveItem} from "@/content/CaptureAdapter/AdapterInterface";
import {getDomPath, getFormItemTypeText, getInputPlaceholder} from "@/content/util";

export default class MiniUIAdapter implements AdapterInterface {
    adapterName = 'MiniUI';

    checkbox(target: Element): AdapterResolveItem | undefined {
        return undefined;
    }

    input(target: Element): AdapterResolveItem | undefined {
        return undefined;
    }

    radio(target: Element): AdapterResolveItem | undefined {
        return undefined;
    }

    select(target: Element): AdapterResolveItem | undefined {
        if (target.classList.contains('mini-buttonedit-input')) {
            let name = getInputPlaceholder(target) || this.getFormItemLabel(target);
            // @ts-ignore
            target = target.parentNode?.parentNode
            if (target.classList.contains('mini-combobox')) {
                let realPath = getDomPath(target)
                let type = 'select'
                return {
                    name,
                    mockKey: type,
                    adapter: this.adapterName,
                    mockName: getFormItemTypeText(type) + '随机',
                    realPath: realPath,
                    tagName: target.tagName,
                    type: type
                };
            }
        }
        return undefined;
    }

    switch(target: Element): AdapterResolveItem | undefined {
        return undefined;
    }

    getFormItemLabel(target: Element) {
        return ''
    }


}