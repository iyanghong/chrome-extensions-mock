import AdapterInterface, { AdapterResolveItem } from '@/common/core/UIAdapter/AdapterInterface';
import { getDomPath, getFormItemTypeText } from '@/content/util';
import BaseMockInjectAdapter from '@/common/core/UIAdapter/BaseMockInjectAdapter';


export default class BaseAdapter extends BaseMockInjectAdapter implements AdapterInterface{
  captureCheckbox(target:Element): AdapterResolveItem | undefined {
    if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox' && target.parentElement) {
      target = target.parentElement
      return this.getRuleItem('checkbox', target, ' input[type="checkbox"]')
    }
    return undefined;
  }

  captureInput(target:Element): AdapterResolveItem | undefined {
    if (['INPUT', 'TEXTAREA'].indexOf(target.tagName) > -1) {
      return this.getRuleItem('input', target, '')
    }
    return undefined;
  }

  captureRadio(target: Element): AdapterResolveItem | undefined {
    if (target.tagName === 'INPUT' && target.getAttribute('type') === 'radio' && target.parentElement) {
      target = target.parentElement
      return this.getRuleItem('radio', target, ' input[type="radio"]')
    }
    return undefined;
  }

  captureSelect(target: Element): AdapterResolveItem | undefined {
    if (target.tagName === 'SELECT') {
      return this.getRuleItem('select', target, '')
    }
    return undefined;
  }

  captureSwitch(target: Element): AdapterResolveItem | undefined {
    return undefined;
  }

  protected getRuleItem(type: string, target: Element, suffixRealPath: string = ''): AdapterResolveItem {
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