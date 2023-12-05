<template>
  <n-modal v-model:show='visible' preset='dialog' title='菜单编辑' :show-icon='false' style='width: 500px'>
    <n-form v-if="menuData" label-placement="left" label-width="80px">
      <n-form-item label="上级">
        <n-text>{{ menuData.parentPathText}}</n-text>
      </n-form-item>
      <n-form-item label="名称">
        <n-input v-model:value="menuData.name" placeholder="请输入名称"></n-input>
      </n-form-item>
      <n-form-item label="表达式">
        <n-input type="textarea" v-model:value="menuData.expression" placeholder="请输入表达式"></n-input>
      </n-form-item>
      <n-form-item>
        <n-space justify="center" style="width: 100%">
          <n-button type="primary" @click="handleSave">保存</n-button>
          <n-button type="default" @click="close(false)">取消</n-button>
        </n-space>
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup lang="ts">

import {NModal,NForm,NFormItem,NText,NButton,NSpace,NInput} from "naive-ui";
import {ref} from "vue";
import Handler from "@/common/core/handler";
import {MenuEntity} from "@/common/core/generate/menu";


const emit = defineEmits(['close'])
const visible = ref<boolean>(false)
const handler = new Handler('Options');
const menuData = ref<MenuEntity>()


async function handleLoad(id: string) {
  menuData.value = await handler.sendBackgroundMessage('getMockMenu', id)
}

async function handleSave() {
  await handler.sendBackgroundMessage('saveMockMenu', menuData.value)
  close(true)
}

async function open(id: string) {
  await handleLoad(id);
  visible.value = true;
}

function close(flag = false) {
  visible.value = false;
  emit('close', flag)
}

defineExpose({
  open,
  close
});

</script>


<style scoped>

</style>