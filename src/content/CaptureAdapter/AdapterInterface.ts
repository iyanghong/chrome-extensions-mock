export interface AdapterResolveItem {
  tagName: string
  realPath: string
  adapter: string
  type: string
  mockName: string
}

export default interface AdapterInterface{
  adapterName: string
  input: (target: Element, basePath: string) => (AdapterResolveItem | undefined)
  select: (target: Element, basePath: string) => (AdapterResolveItem | undefined)
  radio: (target:Element, basePath: string) => (AdapterResolveItem | undefined)
  checkbox: (target: Element, basePath: string) => (AdapterResolveItem | undefined)
}