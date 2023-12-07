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
        <template v-for='item in btnList' :key='item.id'>
          <n-button v-if="item.expression !== 'fix'" type='default' @click='handleItemClick(item)'>{{
              item.name
            }}
          </n-button>
          <n-input v-if="item.expression === 'fix'" type="text" v-model:value="fixValue"
                   placeholder="请输入固定值"></n-input>
          <n-button v-if="item.expression === 'fix'" type='default' @click='handleFixClick(item)'>设置固定值</n-button>
        </template>
      </n-space>
      <MockItem v-for='item in folderList' :key='item.id' :data='item'></MockItem>
    </n-el>
  </n-card>
</template>
<script setup lang='ts'>
import {NButton, NCard, NEl, NH6, NInput, NSpace, NText} from 'naive-ui';
import {computed, PropType, ref} from 'vue';
import {MenuTreeEntity} from '@/common/core/generate/menu';


const emit = defineEmits(['itemClick'])
const props = defineProps({
  data: {
    type: Object as PropType<MenuTreeEntity>,
    default: () => {
      return {};
    }
  }
});

const fixValue = ref<string>('')
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

function handleFixClick(item) {
  let data = JSON.parse(JSON.stringify(item))
  data.expression = fixValue.value
  emit('itemClick', data)
}

</script>


<style scoped lang='scss'>
:deep(.chrome-extensions-mock-menu-item .n-card__content){
  padding: 10px;
}
</style>