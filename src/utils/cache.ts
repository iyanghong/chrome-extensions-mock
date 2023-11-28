const CACHE_KEY_PREFIX:string = 'Mock_'
export async function getStorage<T>(key:string,defaultValue:any=null) {
    key = getCacheKey(key)
    const result = await chrome.storage.local.get([key])
    return (result[key] || defaultValue) as T
}

export async function setStorage(key:string,data :any){
    key = getCacheKey(key)
    const storageData:{[key:string]:any} = {}
    storageData[key] = data
    return await chrome.storage.local.set(storageData)
}

function getCacheKey(key:string){
    return `${CACHE_KEY_PREFIX}${key}`
}