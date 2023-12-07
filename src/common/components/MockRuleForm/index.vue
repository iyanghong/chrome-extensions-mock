<template>
  <n-modal class="ChromeExtensionsMockContainer_MockRule" preset='dialog' v-model:show='visible' title='规则菜单'
           style='width: 800px' :z-index='999999'
           @close='handleClose' :show-icon='false'>
    <n-scrollbar style='height: 600px' v-if="formData">
      <n-form v-model:model="formData" label-width="80px" label-placement="left">
        <n-form-item label="名称">
          <n-input type="text" v-model:value="formData.name" placeholder="请输入名称"></n-input>
        </n-form-item>
        <n-divider>元素规则</n-divider>
        <n-space vertical>
          <n-form-item v-for='item in formData.ruleItems' :key='item.id' class='rule-item'>
            <n-space size='small' :wrap='false' align='center'>
              <n-input type='text' size='small' v-model:value='item.name' placeholder='请输入规则名'
                       style='width: 120px'></n-input>
              <n-el style='width: 80px;' @click='handleShowMenuSelect(item)'>{{ item.mockName || '请选择' }}</n-el>
              <n-button text type='info' size='small' @click='handleEdit(item)'>编辑</n-button>
              <n-button text type='error' size='small' @click='handleDelete(item)'>删除</n-button>
            </n-space>
          </n-form-item>
        </n-space>

      </n-form>
    </n-scrollbar>
  </n-modal>
  <MockMenuModal ref='mockMenuModalRef' :data='treeMockMenuData' @select='handleSelectMenu'></MockMenuModal>
</template>

<script setup lang="ts">

import {NButton, NDivider, NEl, NForm, NFormItem, NInput, NModal, NScrollbar, NSpace} from "naive-ui";

import {PropType, ref} from "vue";
import {RuleEntity, RuleItemEntity} from "@/common/entitys/PageEntity";
import {MenuTreeEntity} from "@/common/core/generate/menu";
import MockMenuModal from '@/common/components/MockMenuModal/index.vue';
import {IHandler} from "@/common/core/handler";

const emit = defineEmits(['close', 'save'])
const props = defineProps({
  handler: {
    type: Object as PropType<IHandler>,
    required: true
  }
})

const visible = ref<boolean>(false);
const formData = ref<RuleEntity>()
const selectRule = ref<RuleItemEntity>();
const treeMockMenuData = ref<MenuTreeEntity[]>([]);
const mockMenuModalRef = ref();

function handleShowMenuSelect(item) {
  selectRule.value = item;
  mockMenuModalRef.value?.open();
}

function handleSelectMenu(menu: MenuTreeEntity) {
  if (!formData.value) return
  formData.value.ruleItems = formData.value.ruleItems.map(it => {
    if (it.id == selectRule.value?.id) {
      it.mockKey = menu.expression || '';
      it.mockName = menu.name;
    }
    return it;
  });
}

function handleDelete(ruleItemEntity: RuleItemEntity) {
  if (!formData.value) return
  formData.value.ruleItems = formData.value.ruleItems.filter(it => it.id != ruleItemEntity.id);
}

function handleEdit(ruleItemEntity: RuleItemEntity) {

}

async function handleLoadTreeMenuData() {
  treeMockMenuData.value = await props.handler?.sendBackgroundMessage('getTreeMockMenuData', {});
}

function handleOpen(rule: RuleEntity) {
  formData.value = JSON.parse(JSON.stringify(rule))
  visible.value = true;
}

function handleClose() {
  visible.value = false;
  emit('close');
}

function handleSave(item) {
  emit('save', item);
  handleClose();
}

handleLoadTreeMenuData()
defineExpose({
  open: handleOpen,
  close: handleClose
});
</script>

<style scoped>

</style>