import { getStorage, setStorage } from '@/common/utils/cache';
import { RuleEntity } from '@/common/entitys/PageEntity';
import { MenuEntity, MenuTreeEntity } from '@/common/core/generate/menu';
import { MockRuleEntity, MockRuleTreeEntity } from '@/common/store/MockRuleStore';
import { IStore } from '@/common/store/IStore';

const MOCK_MENU_CACHE_KEY = 'MockMenus';

function recursiveTreeData(list: MenuEntity[], parentId: string = '-1'): MenuTreeEntity[] {
  return list.filter(it => it.parentId == parentId).map(it => {
    return { ...it, children: recursiveTreeData(list, it.id) };
  });
}

export default class MockMenuStore implements IStore<MenuEntity, MenuTreeEntity> {
  data: MenuEntity[] = [];

  constructor() {
    this.refresh().then();
  }

  async doCache() {
    await setStorage(MOCK_MENU_CACHE_KEY, this.data);
  }

  async refresh() {
    this.data = await getStorage<MenuEntity[]>(MOCK_MENU_CACHE_KEY, []);
  }

  async getAll() {
    return this.data;
  }

  async remove(id: string) {
    this.data = this.data.filter(it => it.id != id);
  }


  async getTreeData() {
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

  async get(id: string): Promise<MenuEntity | null> {
    return this.data.filter(it => it.id == id)[0];
  }

}