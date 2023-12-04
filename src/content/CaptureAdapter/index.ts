import AdapterInterface, {AdapterResolveItem} from '@/content/CaptureAdapter/AdapterInterface';
import BaseAdapter from '@/content/CaptureAdapter/BaseAdapter';
import ElementUiAdapter from '@/content/CaptureAdapter/ElementUiAdapter';
import AntdDesignAdapter from '@/content/CaptureAdapter/AntdDesignAdapter';
import NaiveUIAdapter from '@/content/CaptureAdapter/NaiveUIAdapter';
import MiniUIAdapter from '@/content/CaptureAdapter/MiniUIAdapter';
import {EventListener} from '@/common/utils/DomUtils';
import getUUID from "@/common/utils";
import {IGlobalProperties} from "@/content/GlobalProperties";
import {Ref} from "vue";
import {RuleEntity} from "@/common/entitys/PageEntity";

export default class CaptureAdapter {
  adapterList: AdapterInterface[] = [];
  containerId = '';
  events: Ref<({ remove: () => void } | undefined)[]>
  ruleData: Ref<RuleEntity>

  constructor(globalProperties: IGlobalProperties) {
    this.registerAdapter(new ElementUiAdapter());
    this.registerAdapter(new AntdDesignAdapter());
    this.registerAdapter(new NaiveUIAdapter());
    this.registerAdapter(new MiniUIAdapter());
    this.registerAdapter(new BaseAdapter());
    this.events = globalProperties.getEvents()
    this.ruleData = globalProperties.getRuleData()
    this.containerId = globalProperties.getContainerId();
  }

  registerAdapter(adapter: AdapterInterface) {
    let check = this.adapterList.filter(it => it.adapterName == adapter.adapterName)[0];
    if (check) return false;
    this.adapterList.push(adapter);
  }

  resolve(target: Element, basePath: string): AdapterResolveItem | undefined {
    if (this.checkIsContainer(target, basePath)) return undefined;
    console.log('target => ', target);
    for (const adapter of this.adapterList) {
      let result: AdapterResolveItem | undefined = undefined;
      result = adapter.select(target, basePath);
      if (result) return result;

      result = adapter.checkbox(target, basePath);
      if (result) return result;

      result = adapter.radio(target, basePath);
      if (result) return result;

      result = adapter.input(target, basePath);
      if (result) return result;


      result = adapter.switch(target, basePath);
      if (result) return result;

    }
    return undefined;
  }

  checkIsContainer(el, basePath) {
    if (el.tagName === 'HTML' || el.tagName === 'BODY') return false;
    if (el.tagName === 'DIV' && el.id === this.containerId) {
      return true;
    }
    if (el.parentNode) return this.checkIsContainer(el.parentNode, basePath);
    return false;
  }

  monitor(target: EventTarget | Element | Document, context :string[]= []) {
    this.events.value.push(EventListener.listen(target, 'mousedown', e => {
      if (e.target) {
        //@ts-ignore
        const result = this.resolve(e.target, basePath);
        if (result && !this.ruleData.value.ruleItems.filter(it => it.realPath == result.realPath)[0]) {
          this.ruleData.value.ruleItems.push({
            adapter: result.adapter,
            id: getUUID(),
            context:context,
            mockKey: result.mockKey,
            mockName: result.mockName,
            name: result.name,
            order: 0,
            realPath: result.realPath,
            tagName: result.tagName,
            type: result.type

          })
        }
      }
    }));
  }
}