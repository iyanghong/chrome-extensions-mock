<template>
  <Modal title='编辑规则' @close='handleClose' class="page-rule-form-modal" style="width: 300px!important">
    <n-space :wrap='false' align='center' style="width: 300px">
      <n-text>名称：</n-text>
      <n-input type='text' size='small' placeholder='请输入名称' v-model:value='ruleData.name'></n-input>
    </n-space>
    <n-text class='description'>注：点击页面上的控件来添加控件</n-text>
    <n-scrollbar style='height: 500px;width: 300px'>
      <n-space vertical>
        <n-el v-for='item in ruleData.ruleItems' :key='item.id' class='rule-item' style="width: 300px">
          <n-space size='small' :wrap='false' align='center'>
            <n-input type='text' size='small' v-model:value='item.name' placeholder='请输入规则名'
                     style='width: 120px'></n-input>
            <n-el style='width: 80px;cursor: pointer' @click='handleShowMenuSelect(item)'>{{ item.mockName || '请选择' }}</n-el>
            <n-button text type='error' size='small' @click='handleDelete(item)'>删除</n-button>
          </n-space>
        </n-el>

      </n-space>
    </n-scrollbar>

    <n-space justify='space-around' content-style="width: unset">
      <n-button size='small' type='default' @click='handleClose'>取消</n-button>
      <n-button size='small' type='info' @click='handleMock'>Mock</n-button>
      <n-button size='small' type='primary' @click='handleSave'>保存</n-button>
    </n-space>
    <MockMenuModal ref='mockMenuModalRef' :data='treeMockMenuData' @select='handleSelectMenu'></MockMenuModal>
  </Modal>
</template>
<script setup lang='ts'>
import { NScrollbar,NSpace,NButton,NEl,NInput,NText } from 'naive-ui';
import Modal from '@/common/components/Modal/index.vue';
import { getCurrentInstance, ref } from 'vue';
import GlobalProperties, { IGlobalProperties } from '@/content/GlobalProperties';
import MockMenuModal from '@/common/components/MockMenuModal/index.vue';
import { MenuTreeEntity } from '@/common/core/generate/menu';
import { RuleItemEntity, RuleItemInjectEntity } from '@/common/entitys/PageEntity';
import { CaptureAdapter, MockValueInjectAdapter } from '@/common/core/UIAdapter';

//@ts-ignore
const globalProperties: IGlobalProperties = new GlobalProperties(getCurrentInstance());
const mockMenuModalRef = ref();
const captureAdapter = new CaptureAdapter(globalProperties);
const ruleData = globalProperties.getRuleData();
const treeMockMenuData = ref<MenuTreeEntity[]>([]);
const selectRule = ref<RuleItemEntity>();

function handleSave() {
  if (!ruleData.value.name) {
    alert('请输入名称');
    return;
  }
  let data = JSON.parse(JSON.stringify(ruleData.value));
  globalProperties.sendMessageToBackground('savePageRule', data);
  handleClose();
}

function handleDelete(ruleItemEntity: RuleItemEntity) {
  ruleData.value.ruleItems = ruleData.value.ruleItems.filter(it => it.id != ruleItemEntity.id);
}

async function handleMock() {
  let data: RuleItemInjectEntity[] =  await globalProperties.sendMessageToBackground('getInjectRuleValues', ruleData.value.ruleItems)
  const adapter = new MockValueInjectAdapter();
  adapter.inject(data);

}
/**
 * 递归注册监听器，递归所有iframe
 * @param target
 * @param context
 */
function recurveMonitorLayer(target: EventTarget | Element | Document, context: string[] = []) {
  captureAdapter.monitor(target, context);
  //@ts-ignore
  target?.querySelectorAll('iframe').forEach((item: Element, index) => {
    try {
      //@ts-ignore
      if (item && item.contentWindow && item.contentWindow.document) {
        //@ts-ignore
        const doc: Document = item.contentWindow.document;
        let iframeSrc = item.getAttribute('src');

        // iframe 连src都没有肯定是空的，不需要往下执行
        if (!iframeSrc) return;
        let iframeSrcArray = iframeSrc.split('?')
        let iframePath = `iframe[src*="${iframeSrcArray[0]}"] `;
        recurveMonitorLayer(doc, [...context, iframePath]);
      }
    }catch (_){ // 存在跨域情况则无法注入监听器

    }


  });
}

recurveMonitorLayer(document);

function handleShowMenuSelect(item) {
  selectRule.value = item;
  mockMenuModalRef.value?.open();
}

function handleSelectMenu(menu: MenuTreeEntity) {
  ruleData.value.ruleItems = ruleData.value.ruleItems.map(it => {
    if (it.id == selectRule.value?.id) {
      it.mockKey = menu.expression || '';
      it.mockName = menu.name;
    }
    return it;
  });
}

async function handleLoadTreeMenuData() {
  treeMockMenuData.value = await globalProperties.sendMessageToBackground('getTreeMockMenuData', {});
}

function handleClose() {
  globalProperties.handleDestroy();
  // captureAdapter.clearMonitor();
  console.log(captureAdapter.events);
}

handleLoadTreeMenuData();
</script>

<style scoped lang='scss'>
.description {
  width: 100%;
  font-size: 12px;
  color: #5e6d82;
  line-height: 24px;
}
:deep(div){
  width: auto;
  margin: 0;
}
</style>