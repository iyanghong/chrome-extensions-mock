import AdapterInterface, { AdapterResolveItem } from '@/content/CaptureAdapter/AdapterInterface';
import { getDomPath, getFormItemTypeText, getInputPlaceholder } from '@/content/util';

export default class ElementUiAdapter implements AdapterInterface {
  adapterName = 'ElementUI';

  getFormItemLabel(el, deep = 4) {
    while (deep > 0) {
      if (el.classList.contains('el-form-item')) {
        return el.querySelector('.el-form-item__label')?.innerText;
      }
      deep--;
      el = el.parentNode;
    }
    return '';
  }

  checkbox(target: Element, basePath: string): AdapterResolveItem | undefined {
    if (!target.classList.contains('el-checkbox__label') && !target.classList.contains('el-checkbox__inner')) {
      return undefined;
    }
    if (target.parentNode?.parentNode) target = target.parentNode.parentNode as Element;
    if (target.classList.contains('el-checkbox') && target.parentNode) target = target.parentNode as Element;
    let realPath = basePath + getDomPath(target) + ' .el-checkbox__original';
    let name = getInputPlaceholder(target) || this.getFormItemLabel(target);
    let type = 'radio';
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

  input(target: Element, basePath: string): AdapterResolveItem | undefined {
    if (!target.classList.contains('el-input__inner') && !target.classList.contains('el-textarea__inner')) return undefined;
    let realPath = basePath + getDomPath(target) + ' .el-radio__original';
    let name = getInputPlaceholder(target) || this.getFormItemLabel(target);
    let type = 'radio';
    return {
      name,
      mockKey: '',
      adapter: this.adapterName,
      mockName: '',
      realPath: realPath,
      tagName: target.tagName,
      type: type
    };
  }

  radio(target: Element, basePath: string): AdapterResolveItem | undefined {
    if (!target.classList.contains('el-radio__label') && !target.classList.contains('el-radio__inner')) return undefined;
    if (target.parentNode?.parentNode) target = target.parentNode.parentNode as Element;
    if (target.classList.contains('el-radio') && target.parentNode) target = target.parentNode as Element;

    let realPath = basePath + getDomPath(target) + ' .el-radio__original';
    let name = getInputPlaceholder(target) || this.getFormItemLabel(target);
    let type = 'radio';
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

  select(target: Element, basePath: string): AdapterResolveItem | undefined {
    //@ts-ignore
    if (!(target.classList.contains('el-input__inner') && target.parentNode?.parentNode?.classList.contains('el-select')) && !target.classList.contains('el-select__tags')) return undefined;
    let name = getInputPlaceholder(target);
    target = target.parentNode as Element;
    if (!target.classList.contains('el-select__tags')) target = target.parentNode as Element;
    let realPath = basePath + getDomPath(target);
    let type = 'elSelect';
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