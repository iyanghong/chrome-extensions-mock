export interface IStore<Entity, TreeEntity extends Entity> {
  data: Entity[];
  get: (id: string) => Promise<Entity | null>;
  getAll: () => Promise<Entity[]>;
  getTreeData: () => Promise<TreeEntity[]>;
  remove: (id: string) => Promise<void>;
  save: (t: Entity) => Promise<void>;
  refresh: () => Promise<void>;
  doCache: () => Promise<void>;
}