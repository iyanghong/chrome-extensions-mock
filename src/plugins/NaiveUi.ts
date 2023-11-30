import {App} from '@vue/runtime-core';
import {NButton, NEl, NH3, NInput, NModal, NSpace, NTabPane, NTabs, NText,NCard,} from 'naive-ui'

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
  NCard,
}


export const install = (app:App) =>{
  for (const componentsKey in Components) {
    app.component(componentsKey,Components[componentsKey])
  }
}

export default {
  install
}