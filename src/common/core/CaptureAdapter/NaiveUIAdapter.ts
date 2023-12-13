import AdapterInterface, {AdapterResolveItem} from "./AdapterInterface";
import {getDomPath, getFormItemTypeText, getInputPlaceholder} from "@/content/util";

export default class NaiveUIAdapter implements AdapterInterface {
    adapterName = 'NaiveUI';

    checkbox(target: Element): AdapterResolveItem | undefined {
        if (target.classList.contains('n-checkbox__label') && target.parentElement?.parentElement?.parentElement?.parentElement) {
            target = target.parentElement.parentElement.parentElement.parentElement
        }
        if (target.classList.contains('n-checkbox-group')) {
            return this.getRuleItem('checkbox', target)
        }
    }

    input(target: Element): AdapterResolveItem | undefined {
        if (target.classList.contains('n-input__input-el') || target.classList.contains('n-input__textarea-el')) {
            return this.getRuleItem('input', target)
        }
    }

    radio(target: Element): AdapterResolveItem | undefined {
        if (target.classList.contains('n-radio-input') && target.parentElement?.parentElement?.parentElement?.parentElement) {
            target = target.parentElement.parentElement.parentElement.parentElement
        } else if (target.classList.contains('n-radio-button') && target.parentElement) {
            target = target.parentElement
        } else if (target.classList.contains('n-radio__label') && target.parentElement?.parentElement) {
            target = target.parentElement.parentElement
        }
        if (target.classList.contains('n-radio-group')) {
            return this.getRuleItem('radio', target)
        }
    }

    select(target: Element): AdapterResolveItem | undefined {
        if (target.classList.contains('n-base-selection-label') && target.parentElement?.parentElement) {
            target = target.parentElement?.parentElement
        } else if (target.classList.contains('n-base-selection-input__content') && target.parentElement?.parentElement?.parentElement?.parentElement) {
            target = target.parentElement?.parentElement?.parentElement?.parentElement
        }
        if (target.classList.contains('n-select')) {
            return this.getRuleItem('select', target)
        }
    }

    switch(target: Element): AdapterResolveItem | undefined {
        if (target.classList.contains('n-switch__button') && target.parentElement?.parentElement) {
            target = target.parentElement.parentElement
        } else if (target.classList.contains('n-switch__rail') && target.parentElement) {
            target = target.parentElement
        }
        if (target.classList.contains('n-switch')) {
            return this.getRuleItem('switch', target)
        }
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

    getFormItemLabel(el: Element | HTMLElement, deep: number = 4): string {
        while (deep > 0) {
            if (el.classList.contains('n-form-item')) {
                return (el.querySelector('.n-form-item-label__text') as HTMLElement).innerText;
            }
            deep--;
            if (!el || !el.parentElement) return ''
            el = el.parentElement;
        }
        return '';
    }
}