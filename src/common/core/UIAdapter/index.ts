import { RuleEntity, RuleItemInjectEntity } from '@/common/entitys/PageEntity';
import { Ref } from 'vue';
import { IGlobalProperties } from '@/content/GlobalProperties';
import AdapterInterface, { AdapterResolveItem } from '@/common/core/UIAdapter/AdapterInterface';
import { EventListener } from '@/common/utils/DomUtils';
import getUUID from '@/common/utils';

import AntdDesignAdapter from '@/common/core/UIAdapter/adapter/AntdDesignAdapter';
import ElementUIAdapter from '@/common/core/UIAdapter/adapter/ElementUIAdapter';
import MiniUIAdapter from '@/common/core/UIAdapter/adapter/MiniUIAdapter';
import NaiveUIAdapter from '@/common/core/UIAdapter/adapter/NaiveUIAdapter';
import BaseAdapter from '@/common/core/UIAdapter/adapter/BaseAdapter';
import IViewAdapter from '@/common/core/UIAdapter/adapter/IViewAdapter';


const adapterList: AdapterInterface[] = [
  new AntdDesignAdapter(),
  new ElementUIAdapter(),
  new MiniUIAdapter(),
  new NaiveUIAdapter(),
  new IViewAdapter(),
  new BaseAdapter()
];

export class CaptureAdapter {
  containerId = '';
  events: Ref<({ remove: () => void } | undefined)[]>;
  ruleData: Ref<RuleEntity>;

  constructor(globalProperties: IGlobalProperties) {
    this.events = globalProperties.getEvents();
    this.ruleData = globalProperties.getRuleData();
    this.containerId = globalProperties.getContainerId();
  }

  registerAdapter(adapter: AdapterInterface) {
    let check = adapterList.filter(it => it.adapterName == adapter.adapterName)[0];
    if (check) return false;
    adapterList.push(adapter);
  }

  resolve(target: Element, basePath: string): AdapterResolveItem | undefined {
    if (this.checkIsContainer(target, basePath)) return undefined;
    // console.log('target => ', target);
    for (const adapter of adapterList) {
      let result: AdapterResolveItem | undefined = undefined;
      result = adapter.captureSelect(target);
      if (result) return result;

      result = adapter.captureCheckbox(target);
      if (result) return result;

      result = adapter.captureRadio(target);
      if (result) return result;

      result = adapter.captureInput(target);
      if (result) return result;


      result = adapter.captureSwitch(target);
      if (result) return result;

    }
    return undefined;
  }

  checkIsContainer(el, basePath) {
    if (el.tagName === 'HTML' || el.tagName === 'BODY') return false;
    if (el.tagName === 'DIV' && (el.id === this.containerId || el.classList.contains('ChromeExtensionsMockContainer_SelectMock'))) {
      return true;
    }
    if (el.parentNode) return this.checkIsContainer(el.parentNode, basePath);
    return false;
  }

  monitor(target: EventTarget | Element | Document, context: string[] = []) {
    this.events.value.push(EventListener.listen(target, 'mousedown', e => {
      if (e.target) {
        //@ts-ignore
        const result = this.resolve(e.target);
        if (result && !this.ruleData.value.ruleItems.filter(it => it.realPath == result.realPath)[0]) {
          // console.log('result => ',result)
          this.ruleData.value.ruleItems.push({
            adapter: result.adapter,
            id: getUUID(),
            context: context,
            mockKey: result.mockKey,
            mockName: result.mockName,
            name: result.name,
            sort: 0,
            realPath: result.realPath,
            tagName: result.tagName,
            type: result.type

          });
        }
      }
    }));
  }
  clearMonitor(){
    this.events.value.forEach(e => {
      e?.remove()
    })
    this.events.value = []
  }
}

export class MockValueInjectAdapter {

  registerAdapter(adapter: AdapterInterface) {
    let check = adapterList.filter(it => it.adapterName == adapter.adapterName)[0];
    if (check) return false;
    adapterList.push(adapter);
  }

  inject(data: RuleItemInjectEntity[]) {
    try {
      for (let rule of data) {
        let adapter = adapterList.filter(it => it.adapterName == rule.adapter)[0];
        switch (rule.type) {
          case 'checkbox':
            adapter.mockInjectCheckbox(rule);
            break;
          case 'input':
            adapter.mockInjectInput(rule);
            break;
          case 'radio':
            adapter.mockInjectRadio(rule);
            break;
          case 'select':
            adapter.mockInjectSelect(rule);
            break;
          case 'switch':
            adapter.mockInjectSwitch(rule);
            break;
        }
      }
    }catch (e) {
      console.error('inject error: '+e);
    }

  }
}