<template>
    <n-modal class="ChromeExtensionsMockContainer_MockRuleEventForm" preset="dialog" v-model:show="visible"
             title="页面规则事件编辑"
             style="width: 800px" :z-index="999999"
             @close="handleClose" :show-icon="false">
        <n-form v-if="eventData" ref="eventFormRef" v-model:model="eventData" label-placement="top" size="small"
                :rules="rules">
            <n-form-item>
                <n-space size="small" justify="center" style="width: 100%">
                    <n-button type="primary" size="small" @click="handleSave">保存</n-button>
                    <n-button type="default" size="small" @click="handleClose">取消</n-button>
                </n-space>
            </n-form-item>
            <n-form-item label="名称" path="name">
                <n-input type="text" v-model:value="eventData.name" placeholder="请输入名称"></n-input>
            </n-form-item>
            <n-form-item label="事件类型" path="type">
                <n-select v-model:value="eventData.type" placeholder="请选择事件类型" :options="eventTypes"></n-select>
            </n-form-item>
            <n-form-item label="事件内容" path="content">
                <n-input type="textarea" v-model:value="eventData.content" placeholder="请输入事件内容"></n-input>
            </n-form-item>
        </n-form>
    </n-modal>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { RuleEventEntity } from "@/common/entitys/PageEntity";
import { NModal, NForm, NFormItem, NSelect, NButton, NInput, NSpace } from "naive-ui";
import getUUID from "@/common/utils";
import { FormRules } from "naive-ui/es/form/src/interface";

const emit = defineEmits(["close", "save"]);
const eventData = ref<RuleEventEntity>();
const visible = ref<boolean>(false);
const eventFormRef = ref();
const eventTypes = ref<any[]>([{ label: "Mock之前", value: "before" }, { label: "Mock之后", value: "after" }]);

const rules = ref<FormRules>({
    name: [
        { required: true, message: "请输入名称", trigger: "blur" },
        { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
    ],
    type: [{ required: true, message: "请选择事件类型", trigger: "blur" }],
    content: [{ required: true, message: "请输入事件内容", trigger: "blur" }]
});
const handleSave = () => {
    if (!eventData.value) return;
    if (!eventData.value.id) eventData.value.id = getUUID();
    if (!eventFormRef.value) return;
    eventFormRef.value?.validate((errors: any) => {
        if (!errors) {
            emit("save", eventData.value);
            handleClose();
        }
    });
};
const handleOpen = (data: RuleEventEntity) => {
    eventData.value = JSON.parse(JSON.stringify(data));
    visible.value = true;
};
const handleClose = () => {
    visible.value = false;
    emit("close");
};

defineExpose({
    open: handleOpen,
    close: handleClose
});

</script>
<style scoped>

</style>