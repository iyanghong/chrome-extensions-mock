import { MessageRequestEntity } from '@/common/entitys/MessageType';
import { getCurrentInstance, ref, Ref } from 'vue';

export function handleDestroy() {
  const vm = getCurrentInstance();
  return vm ? vm.appContext.config.globalProperties.$handleDestroy : () => {
  };

}

export function getContainerId() {
  const vm = getCurrentInstance();
  return vm?.appContext.config.globalProperties.$containerId || '';
}

export function getGlobalEvents(): Ref<({ remove: () => void } | undefined)[]> {
  const vm = getCurrentInstance();
  return (vm?.appContext.config.globalProperties.$events || ref<({ remove: () => void } | undefined)[]>([])) as Ref<({
    remove: () => void
  } | undefined)[]>;
}


export function sendMessage(message: MessageRequestEntity) {
  return new Promise<void>(resolve => {
    const vm = getCurrentInstance();
    vm?.appContext.config.globalProperties.$sendMessage(message);
    resolve();
  });
}

export function sendMessageToBackground(handler: string, data: Record<string, any>) {
  return new Promise<void>(resolve => {
    const vm = getCurrentInstance();
    let message: MessageRequestEntity = {
      source: 'Content',
      target: 'Background',
      handler,
      data
    };
    vm?.appContext.config.globalProperties.$sendMessage(message);
    resolve();
  });
}

export function getInputPlaceholder(el): string {
  if (!el.getAttribute('placeholder')) return '';
  let placeholder = el.getAttribute('placeholder');
  let replaceText = ['请输入', '请选择', 'please enter', 'please select', 'Please select', 'Please enter'];
  for (let value of replaceText) {
    placeholder = placeholder.replace(value, '');
  }
  return placeholder;
}

export function getDomPath(el) {
  if (!el) {
    return;
  }
  let stack = [];
  let isShadow = false;
  while (el.parentNode != null) {
    let sibCount = 0;
    let sibIndex = 0;
    // get sibling indexes
    for (let i = 0; i < el.parentNode.childNodes.length; i++) {
      let sib = el.parentNode.childNodes[i];
      if (sib.nodeName == el.nodeName) {
        if (sib === el) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    // if ( el.hasAttribute('id') && el.id != '' ) { no id shortcuts, ids are not unique in shadowDom
    //   stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
    // } else
    let nodeName: string = el.nodeName.toLowerCase();
    if (isShadow) {
      nodeName += '::shadow';
      isShadow = false;
    }
    if (sibCount > 1) {
      // @ts-ignore
      stack.unshift(nodeName + ':nth-of-type(' + (sibIndex + 1) + ')');
    } else {
      // @ts-ignore
      stack.unshift(nodeName);
    }
    el = el.parentNode;
    if (el.nodeType === 11) { // for shadow dom, we
      isShadow = true;
      el = el.host;
    }
  }
  stack.splice(0, 1); // removes the html element
  return stack.join(' > ');
}

export function getFormItemTypeText(type: string) {
  if (!type) return '';
  const typeText = {
    radio: '单选框',
    checkbox: '多选框',
    switch: '开关',
    select: '下拉框',
    elSelect: '下拉框',
    antdSelect: '下拉框'
  };
  return typeText[type] || '';
}