import AdapterInterface, {AdapterResolveItem} from "@/content/CaptureAdapter/AdapterInterface";
import {getDomPath, getFormItemTypeText, getInputPlaceholder} from "@/content/util";

export default class MiniUIAdapter implements AdapterInterface {
    adapterName = 'MiniUI';

    checkbox(target: Element): AdapterResolveItem | undefined {
        if (target.parentElement?.classList.contains('mini-checkbox') || target.parentElement?.classList.contains('mini-checkboxlist-item')){
            return this.getRuleItem('checkbox', target.parentElement)
        }
        return undefined;
    }

    input(target: Element): AdapterResolveItem | undefined {
        if (target.classList.contains('mini-textbox-input') || target.classList.contains('mini-buttonedit-input')) {
            return this.getRuleItem('input', target)
        }
    }

    radio(target: Element): AdapterResolveItem | undefined {
        if (target.parentElement?.classList.contains('mini-radiobutton') || target.parentElement?.classList.contains('mini-radiobuttonlist-item')){
            return this.getRuleItem('radio', target.parentElement)
        }
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

    getFormItemLabel(target: Element, deep = 4) {
        let el = target
        while (deep > 0) {
            // console.log(`deep = ${deep},tag = ${el.tagName}`)
            if (el.tagName == 'TD') {
                // @ts-ignore
                return el.previousElementSibling?.innerText || ''
            }
            if (!el.parentElement) return ''
            el = el.parentElement
            deep--
        }
        return ''
    }

    private getRuleItem(type: string, target: Element): AdapterResolveItem {
        let realPath = getDomPath(target);
        let name = getInputPlaceholder(target) || this.getFormItemLabel(target)
        let mockName = getFormItemTypeText(type) || ''
        if (mockName) mockName += '随机'
        return {
            name,
            mockKey: type,
            adapter: this.adapterName,
            mockName: mockName,
            realPath: realPath,
            tagName: target.tagName,
            type: type
        };
    }


}