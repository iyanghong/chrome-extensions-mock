import { IAdapter } from '@/common/core/MockValueInjectAdapter/IAdapter';
import ElementUiAdapter from './ElementUiAdapter';
import AntdDesignAdapter from './AntdDesignAdapter';
import NaiveUIAdapter from './NaiveUIAdapter';
import MiniUIAdapter from './MiniUIAdapter';
import BaseAdapter from './BaseAdapter';
import { RuleItemInjectEntity } from '@/common/entitys/PageEntity';
import {isFunction} from '@/common/utils/is'
export default class MockValueInjectAdapter {
  adapterList: IAdapter[] = [];

  constructor() {
    this.registerAdapter(new ElementUiAdapter());
    this.registerAdapter(new AntdDesignAdapter());
    this.registerAdapter(new NaiveUIAdapter());
    this.registerAdapter(new MiniUIAdapter());
    this.registerAdapter(new BaseAdapter());
  }

  registerAdapter(adapter: IAdapter) {
    let check = this.adapterList.filter(it => it.adapterName == adapter.adapterName)[0];
    if (check) return false;
    this.adapterList.push(adapter);
  }

  inject(data: RuleItemInjectEntity[]) {
    for (let rule of data) {
      let adapter = this.adapterList.filter(it => it.adapterName == rule.adapter)[0];
      if (isFunction(adapter[rule.type])) {
        adapter[rule.type](rule);
      }
    }
  }
}