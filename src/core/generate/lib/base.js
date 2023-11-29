import mock from './mock.js'
import idioms from "@/core/generate/lib/idiom.js";

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    number(min, max) {
        return getRandomNumber(min, max);
    },
    numberPlus(minLength = 1, maxLength = 10, minNumber = 0, maxNumber = 1000) {
        let len = getRandomNumber(minLength, maxLength)
        let str = ''
        for (let i = 0; i < len; i++) {
            str += getRandomNumber(minNumber, maxNumber).toString()
        }
        return Number(str)
    },
    string(length = 10) {
        return mock.rand.letter(length, true, true)
    },
    stringPlus(minLength = 1, maxLength = 10) {
        let len = getRandomNumber(minLength, maxLength)
        return mock.rand.letter(len, true, true)
    },
    chineseText(length = 10) {
        return mock.text.chinese(length)
    },
    chineseTextPlus(minLength = 1, maxLength = 10) {
        let len = getRandomNumber(minLength, maxLength)
        return mock.text.chinese(len)
    },
    /**
     * 获取区域日期
     * @param diffStart 距今多少年前
     * @param diffEnd 距今多少年后
     * @returns {*}
     */
    date(diffStart = 0, diffEnd = 10) {
        let endDate = new Date()
        let startDate = new Date()

        startDate.setFullYear(startDate.getFullYear() + parseInt(diffStart.toString()))
        endDate.setFullYear(endDate.getFullYear() + parseInt(endDate.toString()))
        return mock.date.time(startDate, endDate, 'yyyy-MM-dd')
    },
    /**
     * 随机指定数量的成语
     * @param num 数量
     * @param separator
     * @returns {string}
     */
    idioms(num = 1, separator = '') {
        return this.idiomsPlus(num, num, separator)
    },
    /**
     * 随机区间数量的成语
     * @param minNum 最小数量
     * @param maxNum 最大数量
     * @param separator 分隔符
     * @returns {string}
     */
    idiomsPlus(minNum = 1, maxNum = 10, separator = '') {
        let len = getRandomNumber(minNum, maxNum)
        let list = []
        for (let i = 0; i < len; i++) {
            let index = Math.round(Math.random() * idioms.length);
            list.push(idioms[index])
        }
        return list.join(separator)
    }
}

