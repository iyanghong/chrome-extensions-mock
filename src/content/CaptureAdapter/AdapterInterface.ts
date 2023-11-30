export interface AdapterResolveItem {
  tagName: string
  realPath: string
  adapter: string
  type: string
  mockName: string
}

export default interface AdapterInterface{
  adapterName: string
  input: (target: EventTarget | Element | Document, basePath: string) => (AdapterResolveItem | undefined)
  select: (target: EventTarget | Element | Document, basePath: string) => (AdapterResolveItem | undefined)
  radio: (target: EventTarget | Element | Document, basePath: string) => (AdapterResolveItem | undefined)
  checkbox: (target: EventTarget | Element | Document, basePath: string) => (AdapterResolveItem | undefined)
}