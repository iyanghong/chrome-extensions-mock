import {getStorage, setStorage} from "@/common/utils/cache";

export interface MockMenuEntity {
    id: string
    name: string
    command: string
    parentId: string
    isAllowEdit: boolean
}

export interface MockMenuTreeEntity extends MockMenuEntity {
    children: MockMenuTreeEntity[]
}

const MOCK_MENU_CACHE_KEY = 'MockMenu'

function recursiveTreeData(list: MockMenuEntity[], parentId: string = '-1'): MockMenuTreeEntity[] {
    return list.filter(it => it.parentId == parentId).map(it => {
        return {...it, children: recursiveTreeData(list, it.id)}
    })
}

export default class MockMenuStore {
    menus: MockMenuEntity[] = []

    constructor() {
        this.refreshData().then()
    }

    async doCache() {
        await setStorage(MOCK_MENU_CACHE_KEY, this.menus)
    }

    async refreshData() {
        this.menus = await getStorage<MockMenuEntity[]>(MOCK_MENU_CACHE_KEY, [])
    }

    async saveMenu(menu: MockMenuEntity) {
        let checkMenu = this.menus.filter(it => it.id == menu.id)[0]
        if (checkMenu) {
            this.menus = this.menus.map(it => {
                if (it.id == menu.id) return menu
                return it
            })
        } else {
            this.menus.push(menu)
        }
        await this.doCache()
    }

    async deleteMenu(id: string) {
        this.menus = this.menus.filter(it => it.id != id)
        await this.doCache()
    }

    async getMenu(id: string) {
        let menu = this.menus.filter(it => it.id == id)[0]
        if (!menu) menu = {id: ''} as MockMenuEntity
        return menu
    }

    async getTreeMenu() {
        return recursiveTreeData(this.menus, '-1')
    }
}