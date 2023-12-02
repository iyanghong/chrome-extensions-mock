import { MockItemEntity, MockItemType, MockListType } from '@/common/core/generate/types';
import {cn, date, en, text, util, web} from 'shai/mock';
import base from './lib/base.js';
import network from './lib/network.js';
import Region from 'shai/region';


function createMockItem(key: string, comment: string, handle: (...params: any[]) => any, params: string[] = []): MockItemType {
  return {
    key,
    comment,
    handle: handle,
    params,
    getPlaceholder(): string {
      return `@${key}(${params.join(',')})`;
    }
  };
}

const DefaultMockList: MockListType = {
  fullNameCN: createMockItem('fullNameCN', '姓名-中文', cn.fullName),
  maleNameCN: createMockItem('maleNameCN', '男姓名-中文', cn.maleName),
  femaleNameCN: createMockItem('femaleNameCN', '女姓名-中文', cn.femaleName),
  fullNameEN: createMockItem('fullNameEN', '姓名-英文', en.fullName),
  maleNameEN: createMockItem('maleNameEN', '男姓名-英文', en.maleName),
  femaleNameEN: createMockItem('femaleNameEN', '女姓名-英文', en.femaleName),
  countryCN: createMockItem('countryCN', '国名-中文', cn.country),
  countryEN: createMockItem('countryEN', '国名-英文', en.country),
  idCard: createMockItem('idCard', '身份证', cn.idcard),
  mobile: createMockItem('mobile', '手机号', cn.mobile),
  landline: createMockItem('landline', '电话号码-座机', cn.phone),
  email: createMockItem('email', '邮箱', web.email),
  uuid: createMockItem('uuid', 'UUID', util.uuid),
  idioms: createMockItem('idioms', '成语(指定数量)', base.idioms, ['num = 1', 'separator = \'\'']),
  idiomsPlus: createMockItem('idiomsPlus', '成语(随机区间数量)', base.idioms, ['minNum = 1', 'maxNum = 10', 'separator = \'\'']),
  fullAddress: createMockItem('fullAddress', '详细地址', function() {
    let region = new Region();
    return region.province() + region.prefecture(true) + region.county();
  }),
  province: createMockItem('province', '省份', function() {
    let region = new Region();
    return region.province();
  }),
  city: createMockItem('city', '城市', function() {
    let region = new Region();
    return region.prefecture();
  }),
  county: createMockItem('county', '区县', function() {
    let region = new Region();
    return region.county();
  }),
  longitude: createMockItem('longitude', '坐标，经度', function() {
    let region = new Region();
    return region.longitude();
  }),
  latitude: createMockItem('latitude', '坐标，纬度', function() {
    let region = new Region();
    return region.latitude();
  }),
  addressCode: createMockItem('addressCode', '县区级6位行政区划代码', function() {
    let region = new Region();
    return region.citycode();
  }),
  zipcode: createMockItem('zipcode', '邮编', function() {
    let region = new Region();
    return region.zipcode();
  }),
  company: createMockItem('company', '公司名', cn.company),
  build: createMockItem('build', '建筑名', cn.build),
  road: createMockItem('road', '路名', cn.road),
  cartCard: createMockItem('cartCard', '车牌号', cn.autocard),
  nickname: createMockItem('nickname', '昵称', network.nickname),
  personDescription: createMockItem('personDescription', '个性签名', network.personDescription),
  account: createMockItem('account', '账号名', web.account),
  password: createMockItem('password', '密码', web.password),
  qq: createMockItem('qq', 'qq', web.qq),
  domain: createMockItem('domain', '域名', web.domain),
  url: createMockItem('url', 'URL', web.url),
  ip: createMockItem('ip', '公网IP', web.ip),
  ipLan: createMockItem('ipLan', '局域网IP', () => web.ip(true)),
  bankIdCard: createMockItem('bankIdCard', '银行卡号', network.bankIdCard),
  colorHex: createMockItem('colorHex', '十六进制颜色值', web.color),
  string: createMockItem('string', '随机字符串(指定长度)', base.string, ['length']),
  stringPlus: createMockItem('stringPlus', '随机字符串(区间随机长度)', base.stringPlus, ['minLength = 1', 'maxLength = 10']),
  number: createMockItem('number', '随机数字(区间随机大小)', base.number, ['minLength = 1', 'maxLength = 10']),
  numberPlus: createMockItem('stringPlus', '随机数字（区间随机长度、区间随机大小）', base.numberPlus, ['minLength = 1', 'maxLength = 10', 'minNumber = 0', 'maxNumber = 1000']),
  date: createMockItem('date', '日期(区间随机)', base.date, ['diffStart = 0', 'diffEnd = 10']),
  chinese: createMockItem('chinese', '随机汉字(指定长度)', base.chineseText, ['length = 10']),
  chinesePlus: createMockItem('chinesePlus', '随机汉字(区间随机长度)', base.chineseText, ['minLength = 1', 'maxLength = 10'])
};

export default class MockHandler {
  list: MockListType = {
    ...DefaultMockList
  };

  register(item: MockItemType) {
    this.list[item.key] = item;
  }

  get(key): MockItemType {
    return this.list[key];
  }

  getAllList() {
    let list: MockItemType[] = [];
    for (let key in this.list) {
      list.push(this.list[key]);
    }
    return list;
  }

  getAllMockEntity() {
    let list: MockItemEntity[] = [];
    for (let key in this.list) {
      let item = this.list[key];
      list.push({
        key: item.key,
        // 说明
        comment: item.comment,
        // 参数
        params: item.params,
        placeholder: item.getPlaceholder(),
        exampleValue: item.handle()
      });
    }
    return list;
  }

  parse(str: string) {
    //获取一个个@xx(xx)格式的
    let strMatcher = str.match(/\@(.*?)\((.*?)\)/g);
    if (strMatcher) {
      strMatcher.forEach((m: string) => {
        let match = /\@(.*?)\((.*?)\)/g.exec(m);
        if (match) {
          let params: any[] = [];
          if (match[2]) {
            params = match[2].split(',');
          }
          let mockItem: MockItemType = this.get(match[1]);
          if (mockItem) {
            str = str.replace(m, mockItem.handle.call(this, ...params));
          }
        }
      });
    }
    return str;

  }
}