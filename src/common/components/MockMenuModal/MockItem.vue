<template>
  <n-card :bordered='false' class='chrome-extensions-mock-menu-item'>
    <n-el class='chrome-extensions-mock-menu-item-header'>
      <n-h6 prefix="bar" align-text>
        <n-text type="primary">
          {{ data.name }}
        </n-text>
      </n-h6>
    </n-el>
    <n-el class='chrome-extensions-mock-menu-item-content'>
      <n-space>
        <n-button v-for='item in btnList' :key='item.id' type='default' @click='handleItemClick(item)'>{{ item.name }}</n-button>
      </n-space>
      <MockItem v-for='item in folderList' :key='item.id' :data='item'></MockItem>
    </n-el>
  </n-card>
</template>
<script setup lang='ts'>
import { NEl, NButton, NSpace, NCard,NH6,NText } from 'naive-ui';
import { computed, PropType } from 'vue';
import { MenuTreeEntity } from '@/common/core/generate/menu';


const emit = defineEmits(['itemClick'])
const props = defineProps({
  data: {
    type: Object as PropType<MenuTreeEntity>,
    default: () => {
      return {};
    }
  }
});
const folderList = computed<MenuTreeEntity[]>((): MenuTreeEntity[] => {
  if (props.data?.children) {
    return props.data.children.filter(it => !it.expression && it.children);
  }
  return [];
});
const btnList = computed<MenuTreeEntity[]>((): MenuTreeEntity[] => {
  if (props.data?.children) {
    return props.data.children.filter(it => it.expression);
  }
  return [];
});


function handleItemClick(item){
  emit('itemClick',item)
}
</script>


<style scoped lang='scss'>
:deep(.chrome-extensions-mock-menu-item .n-card__content){
  padding: 10px;
}
</style>