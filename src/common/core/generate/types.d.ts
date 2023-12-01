export interface MockItemType {
  //唯一标识
  key: string;
  // 说明
  comment: string;
  // 参数
  params?: string[];

  // 生成主方法
  handle(...params: any[]);

  // 获取占位符
  getPlaceholder(): string;

  exampleValue?: string | number;
}

// 这是去掉方法的实体
export interface MockItemEntity {
  //唯一标识
  key: string;
  // 说明
  comment: string;
  // 参数
  params?: string[];
  placeholder: string;
  exampleValue?: string | number;
}

export interface MockListType {
  [key: string]: MockItemType;
}

export interface MockMenuItemType {
  id: string;
  name: string;
  parentId?: string;
  handle?: Function | string;
  sort: number;
}