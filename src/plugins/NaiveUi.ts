import {App} from '@vue/runtime-core';
import {
  NButton,
  NEl,
  NH3,
  NInput,
  NSpace,
  NTabPane,
  NTabs,
  NText,
    NModal,
} from 'naive-ui'

const Components:any = {
  NEl,
  NSpace,
  NText,
  NInput,
  NButton,
  NTabs,
  NTabPane,
  NH3,
  NModal,
}


export const install = (app:App) =>{
  for (const componentsKey in Components) {
    app.component(componentsKey,Components[componentsKey])
  }
}

export default {
  install
}