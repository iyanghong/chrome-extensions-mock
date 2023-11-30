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