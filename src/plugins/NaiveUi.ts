import {App} from '@vue/runtime-core';
import {
  NButton,
  NEl,
  NInput,
  NSpace,
  NTabPane,
  NTabs,
  NText
} from 'naive-ui'

const Components:any = {
  NEl,
  NSpace,
  NText,
  NInput,
  NButton,
  NTabs,
  NTabPane
}


export const install = (app:App) =>{
  for (const componentsKey in Components) {
    app.component(componentsKey,Components[componentsKey])
  }
}

export default {
  install
}