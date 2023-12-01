<template>
  <n-space style="margin: 10px" justify="space-between" :wrap="false">
    <n-button size="large" v-text="data?.name"></n-button>
    <n-space :wrap="false">
      <n-button type="primary" size="small" text>编辑</n-button>
      <n-button type="error" size="small" text>删除</n-button>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {RuleEntity} from "@/common/entitys/PageEntity";

const props = defineProps({
  data: {
    type: Object as PropType<RuleEntity>,
    required: true
  }
})
</script>


<style scoped>

</style>