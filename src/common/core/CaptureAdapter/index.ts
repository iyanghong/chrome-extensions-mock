import AdapterInterface, {AdapterResolveItem} from './AdapterInterface';
import BaseAdapter from './BaseAdapter';
import ElementUiAdapter from './ElementUiAdapter';
import AntdDesignAdapter from './AntdDesignAdapter';
import NaiveUIAdapter from './NaiveUIAdapter';
import MiniUIAdapter from './MiniUIAdapter';
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
      result = adapter.select(target);
      if (result) return result;

      result = adapter.checkbox(target);
      if (result) return result;

      result = adapter.radio(target);
      if (result) return result;

      result = adapter.input(target);
      if (result) return result;


      result = adapter.switch(target);
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

  monitor(target: EventTarget | Element | Document, context :string[]= []) {
    this.events.value.push(EventListener.listen(target, 'mousedown', e => {
      if (e.target) {
        //@ts-ignore
        const result = this.resolve(e.target);
        // console.log('result => ',result)
        if (result && !this.ruleData.value.ruleItems.filter(it => it.realPath == result.realPath)[0]) {
          this.ruleData.value.ruleItems.push({
            adapter: result.adapter,
            id: getUUID(),
            context:context,
            mockKey: result.mockKey,
            mockName: result.mockName,
            name: result.name,
            sort: 0,
            realPath: result.realPath,
            tagName: result.tagName,
            type: result.type

          })
        }
      }
    }));
  }
}