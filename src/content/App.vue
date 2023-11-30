<template>
  <PageRuleForm></PageRuleForm>
</template>
<script setup lang="ts">
import PageRuleForm from "./PageRuleForm.vue";
import {sendMessageToBackground} from "@/content/util";

sendMessageToBackground('SavePageRule', {id: '123'})

</script>
<style scoped>

</style>