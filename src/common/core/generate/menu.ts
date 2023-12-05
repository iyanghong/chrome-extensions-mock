import getUUID from '@/common/utils';

export interface MenuEntity {
  id: string,
  name: string,
  expression: string | null,
  parentId: string
  sort: number,
  parentPathText?: string
}
export interface MenuTreeEntity extends MenuEntity{
  children?: MenuTreeEntity[]
}

const defaultMenu = [
  {
    name: '成语',
    expression: '@idioms()'
  },
  {
    name: '个人信息',
    expression: null,
    children: [
      { name: '姓名-中文', expression: '@fullNameCN()' },
      { name: '男姓名-中文', expression: '@maleNameCN()' },
      { name: '女姓名-中文', expression: '@femaleNameCN()' },
      { name: '姓名-英文', expression: '@fullNameEN()' },
      { name: '男姓名-英文', expression: '@maleNameEN()' },
      { name: '女姓名-英文', expression: '@femaleNameEN()' },
      { name: '身份证', expression: '@idCard()' },
      { name: '手机号', expression: '@mobile()' },
      { name: '电话号码-座机', expression: '@landline()' },
      { name: '邮箱', expression: '@email()' },
      { name: '银行卡号', expression: '@bankIdCard()' }
    ]
  },
  {
    name: '网路信息',
    expression: null,
    children: [
      { name: '昵称', expression: '@nickname()' },
      { name: '个性签名', expression: '@personDescription()' },
      { name: '账号名', expression: '@account()' },
      { name: '密码', expression: '@password()' },
      { name: 'qq', expression: '@qq()' },
      { name: '域名', expression: '@domain()' },
      { name: 'URL', expression: '@url()' },
      { name: '公网IP', expression: '@ip()' },
      { name: '局域网IP', expression: '@ipLan()' },
      { name: '十六进制颜色值', expression: '@colorHex()' }
    ]
  },
  {
    name: '行政区域',
    expression: null,
    children: [
      { name: '国名-中文', expression: '@countryCN()' },
      { name: '国名-英文', expression: '@countryEN()' },
      { name: '省份', expression: '@province()' },
      { name: '城市', expression: '@city()' },
      { name: '区县', expression: '@county()' },
      { name: '详细地址', expression: '@fullAddress()' },
      { name: '坐标，经度', expression: '@longitude()' },
      { name: '坐标，纬度', expression: '@latitude()' },
      { name: '县区级6位行政区划代码', expression: '@addressCode()' },
      { name: '邮编', expression: '@zipcode()' },
      { name: '公司名', expression: '@company()' },
      { name: '建筑名', expression: '@build()' },
      { name: '路名', expression: '@road()' },
      { name: '车牌号', expression: '@cartCard()' }
    ]
  },
  {
    name: '基本常规',
    expression: null,
    children: [
      { name: '随机32位字符串', expression: '@string(32)' }
    ]
  }
];

export function getDefaultMenu(): MenuEntity[] {
  const list: MenuEntity[] = [];

  function generateMenu(data: any[], parentId = '-1', parentPathText: string = '顶层') {
    data.forEach(item => {
      let id = getUUID();
      list.push({
        id,
        name: item.name,
        parentId: parentId,
        expression: item.expression,
        parentPathText: parentPathText,
        sort: 0,
      });
      if (item.children && item.children.length) generateMenu(item.children, id, `${parentPathText}/${item.name}`);
    });
  }

  generateMenu(defaultMenu, '-1');

  return list;
}

