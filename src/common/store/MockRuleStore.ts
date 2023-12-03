import { getStorage, setStorage } from '@/common/utils/cache';
import { IStore } from '@/common/store/IStore';

export interface MockRuleEntity {
  id: string;
  name: string;
  command: string;
  parentId: string;
  isAllowEdit: boolean;
}

export interface MockRuleTreeEntity extends MockRuleEntity {
  children: MockRuleTreeEntity[];
}

const MOCK_RULE_CACHE_KEY = 'MockRule';

function recursiveTreeData(list: MockRuleEntity[], parentId: string = '-1'): MockRuleTreeEntity[] {
  return list.filter(it => it.parentId == parentId).map(it => {
    return { ...it, children: recursiveTreeData(list, it.id) };
  });
}

export default class MockRuleStore implements IStore<MockRuleEntity, MockRuleTreeEntity> {
  data: MockRuleEntity[] = [];

  constructor() {
    this.refresh().then();
  }

  async doCache() {
    await setStorage(MOCK_RULE_CACHE_KEY, this.data);
  }

  async refresh() {
    this.data = await getStorage<MockRuleEntity[]>(MOCK_RULE_CACHE_KEY, []);
  }

  async save(menu: MockRuleEntity) {
    let checkMenu = this.data.filter(it => it.id == menu.id)[0];
    if (checkMenu) {
      this.data = this.data.map(it => {
        if (it.id == menu.id) return menu;
        return it;
      });
    } else {
      this.data.push(menu);
    }
    await this.doCache();
  }

  async remove(id: string) {
    this.data = this.data.filter(it => it.id != id);
    await this.doCache();
  }

  async get(id: string) {
    let menu = this.data.filter(it => it.id == id)[0];
    if (!menu) menu = { id: '' } as MockRuleEntity;
    return menu;
  }

  async getTreeData() {
    return recursiveTreeData(this.data, '-1');
  }

  async getAll() {
    return this.data;
  }
}