<template>
  <n-el style='padding: 10px'>
    <n-space vertical item-style="padding-left:10px">
      <n-space>
        <n-button type='primary' size='small' @click='handleShowMockModal'>查看所有Mock</n-button>
        <n-button type='primary' size='small' @click='handleShowMockSelectModal'>预览Mock选择</n-button>
      </n-space>
      <n-input v-model:value="pattern" placeholder="搜索" style="width: 260px"/>
      <n-tree
          block-line
          :show-irrelevant-nodes="false"
          :data="mockMenuTreeOptions"
          :default-expand-all="true"
          :selectable="false"
          :pattern="pattern"
          virtual-scroll
          key-field="id"
          label-field="name"
      />
    </n-space>
  </n-el>
  <MockListModal ref='mockListModalRef'></MockListModal>
  <MockMenuForm ref='mockMenuFormRef' @close="handleMockMenuFormClose"></MockMenuForm>
  <MockMenuSelectModal ref='mockMenuSelectModalRef' :data='treeMockMenuData' @select='handleSelectMenu'></MockMenuSelectModal>
</template>

<script setup lang='ts'>
import {NButton, NEl, NInput, NSpace, NTree, TreeOption, useMessage} from 'naive-ui';
import MockListModal from './MockListModal.vue';
import MockMenuForm from './MockMenuForm.vue';
import MockMenuSelectModal  from '@/common/components/MockMenuModal/index.vue'
import {h, ref} from 'vue';
import Clipboard from 'clipboard';
import {MenuTreeEntity} from "@/common/core/generate/menu";
import Handler from "@/common/core/handler";

const message = useMessage()
const handler = new Handler('Options');
const mockListModalRef = ref();
const mockMenuFormRef = ref();
const mockMenuSelectModalRef = ref();
const mockMenuTreeOptions = ref<TreeOption[]>([])
const treeMockMenuData = ref<MenuTreeEntity[]>([])
const pattern = ref<string>('')
function handleShowMockModal() {
  mockListModalRef.value?.open();
}

async function handleLoad() {
  treeMockMenuData.value = await handler.sendBackgroundMessage('getTreeMockMenuData')
  mockMenuTreeOptions.value = handleResolve(treeMockMenuData.value)
  console.log(treeMockMenuData.value);
}

function handleResolve(list: MenuTreeEntity[]): TreeOption[] {
  return list.map((it: MenuTreeEntity) => {
    const option: TreeOption = {
      id: it.id,
      name: it.name,
      expression: it.expression,
      parentId: it.parentId,
      parentPathText: it.parentPathText
    }
    if (!it.expression) {
      option.suffix = () => {
        return h(NButton, {
          text: true, type: 'primary', onClick: () => {
            console.log(`${it.name}=${it.id} create child`)
          }
        }, {default: () => '新增'})
      }
      option.children = handleResolve(it.children || [])
    } else {
      option.suffix = () => {
        return h(NSpace, {}, {
          default: () => [
            h(NButton, {
              text: true, type: 'info', onClick: async () => {
                let value = await handler.sendBackgroundMessage('getMockValue', it.expression)
                await handleCopy(value, `${it.name}Mock成功，并复制到剪切板`)
              }
            }, {default: () => 'mock'}),
            h(NButton, {
              text: true, type: 'primary', onClick: () => {
                console.log(`${it.name}=${it.id} edit`)
                mockMenuFormRef.value?.open(it.id)
              }
            }, {default: () => '编辑'}),
            h(NButton, {
              text: true, type: 'error', onClick: () => {
                console.log(`${it.name}=${it.id} delete`)
              }
            }, {default: () => '删除'})
          ]
        })

      }
    }
    return option
  })
}

async function handleCopy(content: string, successMessage: string = 'Mock成功，并复制到剪切板') {
  try {
    Clipboard.copy(content)
    message.success(successMessage);
  } catch (e) {
    console.log('该浏览器不支持自动复制', e);
  }
}

function handleMockMenuFormClose(flag:boolean){
  if (flag) handleLoad()
}
function handleShowMockSelectModal(){
  mockMenuSelectModalRef.value?.open()
}
function handleSelectMenu(item:MenuTreeEntity){
  console.log(item);
}
handleLoad()
</script>


<style scoped>

</style>