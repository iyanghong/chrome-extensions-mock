import getUUID from "@/common/utils";
export interface MenuEntity {
    id: string,
    name: string,
    expression: string | null,
    children: MenuEntity[] | null
}

function createMenu(name: string, expression: string | null, children: MenuEntity[] | null = null): MenuEntity {
    return {
        id: getUUID(),
        name,
        expression: expression,
        children: children
    }
}


const menu: MenuEntity[] = [
    createMenu('成语','@idioms()'),
    {
        id: getUUID(),
        name: '个人信息',
        expression: null,
        children: [
            createMenu('姓名-中文', '@fullNameCN()'),
            createMenu('男姓名-中文', '@maleNameCN()'),
            createMenu('女姓名-中文', '@femaleNameCN()'),
            createMenu('姓名-英文', '@fullNameEN()'),
            createMenu('男姓名-英文', '@maleNameEN()'),
            createMenu('女姓名-英文', '@femaleNameEN()'),
            createMenu('身份证', '@idCard()'),
            createMenu('手机号', '@mobile()'),
            createMenu('电话号码-座机', '@landline()'),
            createMenu('邮箱', '@email()'),
            createMenu('银行卡号', '@bankIdCard()'),
        ]
    },
    {
        id: getUUID(),
        name: '网路信息',
        expression: null,
        children: [
            createMenu('昵称', '@nickname()'),
            createMenu('个性签名', '@personDescription()'),
            createMenu('账号名', '@account()'),
            createMenu('密码', '@password()'),
            createMenu('qq', '@qq()'),
            createMenu('域名', '@domain()'),
            createMenu('URL', '@url()'),
            createMenu('公网IP', '@ip()'),
            createMenu('局域网IP', '@ipLan()'),
            createMenu('十六进制颜色值', '@colorHex()'),
        ]
    },
    {
        id: getUUID(),
        name: '行政区域',
        expression: null,
        children: [
            createMenu('国名-中文', '@countryCN()'),
            createMenu('国名-英文', '@countryEN()'),
            createMenu('省份', '@province()'),
            createMenu('城市', '@city()'),
            createMenu('区县', '@county()'),
            createMenu('详细地址', '@fullAddress()'),
            createMenu('坐标，经度', '@longitude()'),
            createMenu('坐标，纬度', '@latitude()'),
            createMenu('县区级6位行政区划代码', '@addressCode()'),
            createMenu('邮编', '@zipcode()'),
            createMenu('公司名', '@company()'),
            createMenu('建筑名', '@build()'),
            createMenu('路名', '@road()'),
            createMenu('车牌号', '@cartCard()'),
        ]
    },
    {
        id: getUUID(),
        name: '基本常规',
        expression: null,
        children: [
            createMenu('随机32位字符串','@string(32)'),
        ]
    }
]