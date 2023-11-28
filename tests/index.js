let str = `@string(10,1),手机号：@phone()
asdasd@string()
,邮箱：@email()`

let matcher =  str.match(/\@(.*?)\((.*?)\)/g)
let list = []

for (let m of matcher){
    let match = /\@(.*?)\((.*?)\)/g.exec(m)
    let params = []
    if (match[2]){
        params = match[2].split(',')
    }
    list.push({
        key : match[1],
        params:params
    })
}

console.log(list)