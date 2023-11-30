<template>
  <Modal title="编辑规则" @close="handleClose">
    <n-space :wrap="false" align="center">
      <n-text>名称：</n-text>
      <n-input type="text" size="small" placeholder="请输入关键字查找"></n-input>
    </n-space>
    <n-text class="description">注：点击页面上的控件来添加控件</n-text>
  </Modal>
</template>
<script setup lang="ts">

import Modal from '@/common/components/Modal/index.vue'
import { getGlobalEvents } from '@/content/util';
import { EventListener } from '@/common/utils/DomUtils';
import CaptureAdapter from './CaptureAdapter/index'

const captureAdapter = new CaptureAdapter()
const events = getGlobalEvents()


/**
 * 递归注册监听器，递归所有iframe
 * @param target
 * @param basePath
 */
function recurveMonitorLayer(target: EventTarget | Element | Document,basePath:string = ''){
  captureAdapter.monitor(target,basePath)
  //@ts-ignore
    target?.querySelectorAll('iframe').forEach((item:Element,index) => {
      //@ts-ignore
      if (item && item.contentWindow){
        //@ts-ignore
        const doc:Document = item.contentWindow.document
        const iframeSrc = item.getAttribute('src')
        // iframe 连src都没有肯定是空的，不需要往下执行
        if (!iframeSrc) return
        let basePath = `iframe[src="${iframeSrc}"] `
        recurveMonitorLayer(doc,basePath)
      }
    })
}

recurveMonitorLayer(document)



function handleClose() {
}

</script>
<style scoped lang="scss">
.description {
  width: 100%;
  font-size: 12px;
  color: #5e6d82;
  line-height: 24px;
}
</style>