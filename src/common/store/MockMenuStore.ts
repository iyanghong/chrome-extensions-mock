import {getStorage, setStorage} from '@/common/utils/cache';
import {getDefaultMenu, MenuEntity, MenuTreeEntity} from '@/common/core/generate/menu';
import {IStore} from '@/common/store/IStore';

const MOCK_MENU_CACHE_KEY = 'MockMenus';

function recursiveTreeData(list: MenuEntity[], parentId: string = '-1'): MenuTreeEntity[] {
  return list.filter(it => it.parentId == parentId).map(it => {
    let children = recursiveTreeData(list, it.id)
    let item:MenuTreeEntity =  { ...it  }
    if (children && children.length > 0){
      item.children = children
    }
    return item;
  });
}

export default class MockMenuStore implements IStore<MenuEntity, MenuTreeEntity> {
  data: MenuEntity[] = [];
  isInitialized: boolean = false;
  constructor() {
    this.refresh().then();
  }

  async doCache() {
    await setStorage(MOCK_MENU_CACHE_KEY, this.data);
  }

  async refresh() {
    this.data = await getStorage<MenuEntity[]>(MOCK_MENU_CACHE_KEY, getDefaultMenu());
    this.isInitialized = true
  }

  async getAll() {
    if(!this.isInitialized) await this.refresh();
    return this.data;
  }

  async remove(id: string) {
    this.data = this.data.filter(it => it.id != id);
    await this.doCache()
  }


  getTreeData() {
    return recursiveTreeData(this.data, '-1');
  }

  async save(data: MenuEntity): Promise<void> {
    let checkMenu = this.data.filter(it => it.id == data.id)[0];
    if (checkMenu) {
      this.data = this.data.map(it => {
        if (it.id == data.id) return data;
        return it;
      });
    } else {
      this.data.push(data);
    }
    await this.doCache();
  }

  get(id: string): MenuEntity | null {
    return this.data.filter(it => it.id == id)[0];
  }

}