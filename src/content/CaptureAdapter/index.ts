import AdapterInterface, { AdapterResolveItem } from '@/content/CaptureAdapter/AdapterInterface';
import BaseAdapter from '@/content/CaptureAdapter/BaseAdapter';
import ElementUiAdapter from '@/content/CaptureAdapter/ElementUiAdapter';
import AntdDesignAdapter from '@/content/CaptureAdapter/AntdDesignAdapter';
import NaiveUIAdapter from '@/content/CaptureAdapter/NaiveUIAdapter';
import MiniUIAdapter from '@/content/CaptureAdapter/MiniUIAdapter';
import { getContainerId, getGlobalEvents } from '@/content/util';
import { EventListener } from '@/common/utils/DomUtils';

export default class CaptureAdapter {
  adapterList: AdapterInterface[] = [];
  containerId = '';
  events = getGlobalEvents();

  constructor() {
    this.registerAdapter(new ElementUiAdapter());
    this.registerAdapter(new AntdDesignAdapter());
    this.registerAdapter(new NaiveUIAdapter());
    this.registerAdapter(new MiniUIAdapter());
    this.registerAdapter(new BaseAdapter());
    this.containerId = getContainerId();
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

  monitor(target: EventTarget | Element | Document, basePath: string = '') {
    this.events.value.push(EventListener.listen(target, 'mousedown', e => {
      if (e.target) {
        //@ts-ignore
        const result = this.resolve(e.target, basePath);
        console.log('result = ', result);
      }
    }));
  }
}