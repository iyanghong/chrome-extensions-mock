import AdapterInterface, {AdapterResolveItem} from './AdapterInterface';
import {getDomPath, getFormItemTypeText} from "@/content/util";

export default class BaseAdapter implements AdapterInterface{
    adapterName = "Base"

    checkbox(target:Element): AdapterResolveItem | undefined {
        if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {
            // @ts-ignore
            target = target.parentNode
            return this.getRuleItem('checkbox', target, ' input[type="checkbox"]')
        }
        return undefined;
    }

    input(target:Element): AdapterResolveItem | undefined {
        if (['INPUT', 'TEXTAREA'].indexOf(target.tagName) > -1) {
            return this.getRuleItem('input', target, '')
        }
        return undefined;
    }

    radio(target: Element): AdapterResolveItem | undefined {
        if (target.tagName === 'INPUT' && target.getAttribute('type') === 'radio') {
            // @ts-ignore
            target = target.parentNode
            return this.getRuleItem('radio', target, ' input[type="radio"]')
        }
        return undefined;
    }

    select(target: Element): AdapterResolveItem | undefined {
        if (target.tagName === 'SELECT') {
            return this.getRuleItem('select', target, '')
        }
        return undefined;
    }

    switch(target: Element): AdapterResolveItem | undefined {
        return undefined;
    }

    private getRuleItem(type: string, target: Element, suffixRealPath: string = ''): AdapterResolveItem {
        let realPath = getDomPath(target);
        let name = ''
        if (target.getAttribute('placeholder')) {
            // @ts-ignore
            name = target.getAttribute('placeholder').replace('请选择', '').replace('请输入', '').replace('Please enter', '').replace('please enter', '')
        }
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