<template>
  <Modal title='编辑规则' @close='handleClose'>
    <n-space :wrap='false' align='center'>
      <n-text>名称：</n-text>
      <n-input type='text' size='small' placeholder='请输入名称' v-model:value="ruleData.name"></n-input>
    </n-space>
    <n-text class='description'>注：点击页面上的控件来添加控件</n-text>
    <n-space vertical>
      <n-el v-for="item in ruleData.ruleItems" :key="item.id" class="rule-item">
        <n-input type="text" v-model:value="item.name"></n-input>
        <n-text>{{ item.mockName }}</n-text>
        <n-button text type="error">删除</n-button>
      </n-el>

    </n-space>

    <n-space justify="space-around">
      <n-button size="small" type="default" @click="handleClose">取消</n-button>
      <n-button size="small" type="primary" @click="handleSave">保存</n-button>
    </n-space>

  </Modal>
</template>
<script setup lang='ts'>
import Modal from '@/common/components/Modal/index.vue'
import {getCurrentInstance} from "vue";
import GlobalProperties, {IGlobalProperties} from "@/content/GlobalProperties";
import CaptureAdapter from "@/content/CaptureAdapter";

//@ts-ignore
const globalProperties: IGlobalProperties = new GlobalProperties(getCurrentInstance())

const captureAdapter = new CaptureAdapter(globalProperties);
const ruleData = globalProperties.getRuleData()
console.log('ruleData', ruleData)


function handleSave() {
  if (!ruleData.value.name) {
    alert('请输入名称')
    return
  }
  let data = JSON.parse(JSON.stringify(ruleData.value))
  globalProperties.sendMessageToBackground('SavePageRule', data)
  handleClose()
}

/**
 * 递归注册监听器，递归所有iframe
 * @param target
 * @param basePath
 */
function recurveMonitorLayer(target: EventTarget | Element | Document, basePath: string = '') {
  captureAdapter.monitor(target, basePath);
  //@ts-ignore
  target?.querySelectorAll('iframe').forEach((item: Element, index) => {
    //@ts-ignore
    if (item && item.contentWindow) {
      //@ts-ignore
      const doc: Document = item.contentWindow.document;
      const iframeSrc = item.getAttribute('src');
      // iframe 连src都没有肯定是空的，不需要往下执行
      if (!iframeSrc) return;
      let basePath = `iframe[src="${iframeSrc}"] `;
      recurveMonitorLayer(doc, basePath);
    }
  });
}

recurveMonitorLayer(document);


function handleClose() {
  globalProperties.handleDestroy()
}

</script>
<style scoped lang='scss'>
.description {
  width: 100%;
  font-size: 12px;
  color: #5e6d82;
  line-height: 24px;
}
</style>