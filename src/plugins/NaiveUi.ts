import { App, Plugin } from '@vue/runtime-core';
import {NEl,NSpace,NText,NInput}from 'naive-ui'

const Components:any = {
  NEl,NSpace,NText,NInput
}


export const install = (app:App) =>{
  for (const componentsKey in Components) {
    app.component(componentsKey,Components[componentsKey])
  }
}

export default {
  install
}