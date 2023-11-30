import {resolve} from 'path';
import fs from 'fs'

const isDirectoryExist = function (path) {
    try {
        return fs.statSync(path).isDirectory()
    } catch (e:any) {
        if (e.code === 'ENOENT') {
            return false
        }
    }
}
const handleCopy = function (from, to) {
    if (!isDirectoryExist(from)) {
        console.error('可复制的文件或者目录不存在')
        return false
    }
    if (!isDirectoryExist(to)) {
        fs.mkdirSync(to)
    }
    const dir = fs.readdirSync(from)
    dir.forEach((file) => {
        const filePath = resolve(from, file)
        fs.stat(filePath, (_, stat) => {
            if (stat.isFile()) {
                // 创建读取流
                const readStream = fs.createReadStream(filePath)
                // 创建写入流
                const writeStream = fs.createWriteStream(resolve(to, file))
                // 复制写入文件
                readStream.pipe(writeStream)
            } else if (stat.isDirectory()) {
                handleCopy(filePath, resolve(to, file))
            }
        })
    })
}

export default function (options: { from: string, to: string }[]) {
    let viteConfig:any = null
    return {
        name: 'vite-plugin-copy',
        apply: 'build',
        configResolved(resolvedConfig:any) {
            viteConfig = resolvedConfig
        },
        async writeBundle() {
            try {
                if (options) {
                    options.forEach((item) => {
                        if (item.from && item.to) {
                            const fromPath = resolve(viteConfig.root, item.from)
                            const toPath = resolve(viteConfig.root, item.to)
                            handleCopy(fromPath, toPath)
                        }
                    })
                }
            } catch (e) {
                console.error(e)
            }
        },
    }
}