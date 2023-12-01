<template>
  <n-el class='options-header' style='padding: 12px'>
    <n-space :wrap='false'>
      <n-el class='logo'>
        <img :src='iconPath' alt=''>
      </n-el>
      <n-space vertical justify='space-between' align='end'>
        <n-el>
          <n-text class='title-text'>Mock 表单数据模拟<sup>®</sup></n-text>
        </n-el>
        <n-el>
          <n-text class='subtitle'>by 孤鸿渺影</n-text>
        </n-el>
      </n-space>
    </n-space>
  </n-el>
  <n-tabs v-model:value='activeTab' type='card' animated size='small'>
    <n-tab-pane tab='页面规则' name='PageRule'>
      <PageRuleAdmin></PageRuleAdmin>
    </n-tab-pane>
    <n-tab-pane tab='规则菜单' name='MockRule'>
      <MockAdmin></MockAdmin>
    </n-tab-pane>
  </n-tabs>
</template>
<script setup lang='ts'>
import MockAdmin from './MockAdmin.vue';
import PageRuleAdmin from './PageRuleAdmin.vue';
import { NTabPane, NTabs,NSpace,NEl } from 'naive-ui';
import { ref } from 'vue';
import Handler from '@/common/core/handler';

const iconPath = '/icon/icon-64.png';
const activeTab = ref<string>('MockRule');


</script>
<style lang='scss' scoped>
.title-text{
  font-size: 24px;
  font-weight: bold;
}
.subtitle{
  text-align: center;
  vertical-align: middle;
  font-size: 12px;
  cursor: pointer;
}
</style>
