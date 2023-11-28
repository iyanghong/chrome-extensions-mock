import {MockItemType, MockListType} from "@/core/generate/types";
import mock from "./lib/mock.js";
import idioms from "./lib/idiom.js";
import Region from "./lib/region.js";
import network from "./lib/network.js";


function createMockItem(key: string, comment: string, handle: Function, params: string[] = []): MockItemType {

    return {
        key,
        comment,
        // @ts-ignore
        handle: handle,
        params,
        getPlaceholder(): string {
            return `@${key}(${params.join(',')})`
        }
    }
}

const DefaultMockList: MockListType = {
    fullNameCN: createMockItem('fullNameCN', '姓名-中文', mock.cn.fullName),
    maleNameCN: createMockItem('maleNameCN', '男姓名-中文', mock.cn.maleName),
    femaleNameCN: createMockItem('femaleNameCN', '女姓名-中文', mock.cn.femaleName),
    fullNameEN: createMockItem('fullNameEN', '姓名-英文', mock.en.fullName),
    maleNameEN: createMockItem('maleNameEN', '男姓名-英文', mock.en.maleName),
    femaleNameEN: createMockItem('femaleNameEN', '女姓名-英文', mock.en.femaleName),
    countryEN: createMockItem('countryEN', '国名', mock.en.country),
    idCard: createMockItem('idCard', '身份证', mock.cn.idcard),
    mobile: createMockItem('mobile', '手机号', mock.cn.mobile),
    landline: createMockItem('landline', '电话号码-座机', mock.cn.phone),
    email: createMockItem('email', '邮箱', mock.web.email),
    uuid: createMockItem('uuid', 'UUID', mock.util.uuid),
    idioms: createMockItem('idioms', '成语', () => {
        let index = Math.round(Math.random() * idioms.length);
        return idioms[index]
    }),
    fullAddress: createMockItem('fullAddress', '详细地址', function () {
        let region = new Region();
        return region.province(true) + region.prefecture(true) + region.county()
    }),
    province: createMockItem('province', '省份', function () {
        let region = new Region();
        return region.province()
    }),
    city: createMockItem('city', '城市', function () {
        let region = new Region();
        return region.prefecture()
    }),
    county: createMockItem('county', '区县', function () {
        let region = new Region();
        return region.county()
    }),
    longitude: createMockItem('longitude', '坐标，经度', function () {
        let region = new Region();
        return region.longitude()
    }),
    latitude: createMockItem('latitude', '坐标，纬度', function () {
        let region = new Region();
        return region.latitude()
    }),
    addressCode: createMockItem('addressCode', '县区级6位行政区划代码', function () {
        let region = new Region();
        return region.citycode()
    }),
    zipcode: createMockItem('zipcode', '邮编', function () {
        let region = new Region();
        return region.zipcode()
    }),
    company: createMockItem('company', '公司名', mock.cn.company),
    build: createMockItem('build', '建筑名', mock.cn.build),
    road: createMockItem('build', '路名', mock.cn.road),
    cartCard: createMockItem('cartCard', '车牌号', mock.cn.autocard),
    nickname: createMockItem('nickname', '昵称', network.nickname),
    personDescription: createMockItem('personDescription', '个性签名', network.personDescription),
    account: createMockItem('account', '账号名', mock.web.account),
    password: createMockItem('password', '密码', mock.web.password),
    qq: createMockItem('qq', 'qq', mock.web.qq),
    domain: createMockItem('domain', '域名', mock.web.domain),
    url: createMockItem('url', 'URL', mock.web.url),
    ip: createMockItem('ip', '公网IP', mock.web.ip),
    ipLan: createMockItem('ipLan', '局域网IP', () => mock.web.ip(true)),
    bankIdCard: createMockItem('bankIdCard', '银行卡号', network.bankIdCard),
    colorHex: createMockItem('colorHex', '十六进制颜色值', mock.web.color),
}

class Mock {
    list: MockListType = {
        ...DefaultMockList
    }

    register(item: MockItemType) {
        this.list[item.key] = item
    }

    get(key): MockItemType {
        return this.list[key]
    }

    parse(str: string) {
        //获取一个个@xx(xx)格式的
        let strMatcher = str.match(/\@(.*?)\((.*?)\)/g)
        if (strMatcher) {
            strMatcher.forEach((m: string) => {
                let match = /\@(.*?)\((.*?)\)/g.exec(m)
                if (match) {
                    let params: any[] = []
                    if (match[2]) {
                        params = match[2].split(',')
                    }
                    let mockItem: MockItemType = this.get(match[1])
                    if (mockItem) {
                        str = str.replace(m, mockItem.handle.call(this, ...params))
                    }
                }
            })
        }
        return str

    }
}


const MOCK_LIST: MockItemType[] = []

export default MOCK_LIST