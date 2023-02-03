import mock from "../lib/mock.js";
import Region from "../lib/region.js";
import network from "../lib/network.js";
import idioms from "../lib/idiom.js";


const MOCK_LIST = [
    {
        id: 'Top',
        title: '数据模拟'
    },
    /*{
        id: 'PushToRule',
        parentId: 'Top',
        title: '添加进规则...'
    },
    {
        id: 'Separator',
        parentId: 'Top',
        type: 'separator'
    },*/
    {
        id: 'CNPersonName',
        parentId: 'Top',
        title: '中文姓名'
    },
    {
        id: 'CNPersonNameFullName',
        parentId: 'CNPersonName',
        title: '姓名-中文',
        handle: mock.cn.fullName
    },
    {
        id: 'CNPersonNameMaleName',
        parentId: 'CNPersonName',
        title: '男姓名-中文',
        handle: mock.cn.maleName
    },
    {
        id: 'CNPersonNameFemaleName',
        parentId: 'CNPersonName',
        title: '女姓名-中文',
        handle: mock.cn.femaleName
    },
    {
        id: 'ENPersonName',
        parentId: 'Top',
        title: '英文姓名'
    },
    {
        id: 'ENPersonNameFullName',
        parentId: 'ENPersonName',
        title: '姓名-英文',
        handle: mock.en.fullName
    },
    {
        id: 'ENPersonNameMaleName',
        parentId: 'ENPersonName',
        title: '男姓名-英文',
        handle: mock.en.maleName
    },
    {
        id: 'ENPersonNameFemaleName',
        parentId: 'ENPersonName',
        title: '女姓名-英文',
        handle: mock.en.femaleName
    },
    {
        id: 'ENPersonNameCountry',
        parentId: 'ENPersonName',
        title: '国名',
        handle: mock.en.country
    },
    {
        id: 'IdCard',
        parentId: 'Top',
        title: '身份证',
        handle: mock.cn.idcard
    },
    {
        id: 'Mobile',
        parentId: 'Top',
        title: '手机号',
        handle: mock.cn.mobile
    },
    {
        id: 'Phone',
        parentId: 'Top',
        title: '电话号码-座机',
        handle: mock.cn.phone
    },
    {
        id: 'Email',
        parentId: 'Top',
        title: '邮箱',
        handle: mock.web.email
    },
    {
        id: 'UUID',
        parentId: 'Top',
        title: 'UUID',
        handle: mock.util.uuid
    },
    {
        id: 'Idioms',
        parentId: 'Top',
        title: '成语',
        handle: () => {
            let index = Math.round(Math.random() * idioms.length);
            return idioms[index]
        }
    },


    // 行政区域 start
    {
        id: 'Address',
        parentId: 'Top',
        title: '行政区域'
    },
    {
        id: 'FullAddress',
        parentId: 'Address',
        title: '详细地址',
        handle() {
            let region = new Region();
            return region.province(true) + region.prefecture(true) + region.county()
        }
    },
    {
        id: 'AddressProvince',
        parentId: 'Address',
        title: '省份',
        handle() {
            let region = new Region();
            return region.province()
        }
    },
    {
        id: 'AddressPrefecture',
        parentId: 'Address',
        title: '城市',
        handle() {
            let region = new Region();
            return region.prefecture()
        }
    },
    {
        id: 'AddressCounty',
        parentId: 'Address',
        title: '区县',
        handle() {
            let region = new Region();
            return region.county()
        }
    },
    {
        id: 'AddressLongitude',
        parentId: 'Address',
        title: '坐标，经度',
        handle() {
            let region = new Region();
            return region.longitude()
        }
    },
    {
        id: 'AddressLatitude',
        parentId: 'Address',
        title: '坐标，纬度',
        handle() {
            let region = new Region();
            return region.latitude()
        }
    },
    {
        id: 'AddressCode',
        parentId: 'Address',
        title: '县区级6位行政区划代码',
        handle() {
            let region = new Region();
            return region.citycode()
        }
    },
    {
        id: 'Zipcode',
        parentId: 'Address',
        title: '邮编',
        handle() {
            let region = new Region();
            return region.zipcode()
        }
    },
    {
        id: 'Company',
        parentId: 'Address',
        title: '公司名',
        handle: mock.cn.company
    },
    {
        id: 'Build',
        parentId: 'Address',
        title: '建筑名',
        handle: mock.cn.build
    },
    {
        id: 'Road',
        parentId: 'Address',
        title: '路名',
        handle: mock.cn.road
    },
    {
        id: 'Autocard',
        parentId: 'Address',
        title: '车牌号',
        handle: mock.cn.autocard
    },
    // 行政区域 end
    // 时间 start
    {
        id: 'Date',
        parentId: 'Top',
        title: '时间'
    },
    // 时间 end
    // Web start
    {
        id: 'Web',
        parentId: 'Top',
        title: 'Web账号'
    },
    {
        id: 'WebNickName',
        parentId: 'Web',
        title: '昵称',
        handle: network.nickname
    },
    {
        id: 'WebAccount',
        parentId: 'Web',
        title: '账号名',
        handle: mock.web.account
    },
    {
        id: 'WebPassword',
        parentId: 'Web',
        title: '密码',
        handle: mock.web.password
    },
    {
        id: 'WebPersonDescription',
        parentId: 'Web',
        title: '个性签名',
        handle: network.personDescription
    },
    {
        id: 'WebQQ',
        parentId: 'Web',
        title: 'QQ',
        handle: mock.web.qq
    },
    {
        id: 'WebDomain',
        parentId: 'Web',
        title: '域名',
        handle: mock.web.domain
    },
    {
        id: 'WebUrl',
        parentId: 'Web',
        title: 'URL',
        handle: mock.web.url
    },
    {
        id: 'WebIP',
        parentId: 'Web',
        title: '公网IP',
        handle: mock.web.ip
    },
    {
        id: 'WebIPLan',
        parentId: 'Web',
        title: '局域网IP',
        handle() {
            return mock.web.ip(true)
        }
    },
    {
        id: 'WebBankIdCard',
        parentId: 'Web',
        title: '银行卡号',
        handle: network.bankIdCard
    },
    {
        id: 'WebColor',
        parentId: 'Web',
        title: '颜色值',
        handle: mock.web.color
    },
    // Web end

    {
        id: 'Number',
        parentId: 'Top',
        title: '数字'
    },
    {
        id: 'Letter',
        parentId: 'Top',
        title: '字母'
    },
    {
        id: 'LetterNumber',
        parentId: 'Top',
        title: '字母+数字'
    },
    {
        id: 'ChineseText',
        parentId: 'Top',
        title: '随机汉字',
        // handle: mock.text.chinese
    },
]

// 时间
for (let i = 1; i < 25; i++) {
    let len = i * 5
    if (len > 50 && len < 100 && (len + '').indexOf('5') > -1) {
        continue
    }
    if (i > 20) {
        len = 100 + 50 * (i - 20)
    }
    let endDate = new Date()
    let startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() - len)
    MOCK_LIST.push({
        id: `Date${len}`,
        parentId: 'Date',
        title: `${len}年内日期`,
        handle() {
            return mock.date.time(startDate, endDate, 'yyyy-MM-dd')
        }
    })
}


// 填充数字
for (let i = 1; i < 10; i++) {
    let min = '1', max = '9'
    if (i !== 1) {
        for (let j = 0; j < i - 1; j++) {
            min += '0'
            max += '9'
        }
    }
    min = parseInt(min)
    max = parseInt(max)
    MOCK_LIST.push({
        id: `Number${i}`,
        parentId: 'Number',
        title: `${i}位数字`,
        handle() {
            return mock.rand.int(min, max)
        }
    })
}
// 字母
for (let i = 1; i < 10; i++) {
    let len = Math.pow(2, i)
    MOCK_LIST.push({
        id: `Letter${i}`,
        parentId: 'Letter',
        title: `${len}个字母`,
        handle() {
            return mock.rand.letter(len, true, true)
        }
    })
    MOCK_LIST.push({
        id: `LetterNumber${i}`,
        parentId: 'LetterNumber',
        title: `${len}个字符串`,
        handle() {
            return mock.rand.alphanum(len, true)
        }
    })
}
for (let i = 1; i < 10; i++) {
    let len = i === 1 ? 10 : (50 * (i - 1));
    MOCK_LIST.push({
        id: `ChineseText${len}`,
        parentId: 'ChineseText',
        title: `${len}个汉字`,
        handle() {
            return mock.text.chinese(len)
        }
    })
}


export default MOCK_LIST