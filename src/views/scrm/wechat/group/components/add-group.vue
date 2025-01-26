<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="群名称" field="name">
        <a-input v-model="formModel.name" placeholder="请输入群名称" />
      </a-form-item>

      <a-form-item label="群主" field="owner">
        <a-select
          v-model="formModel.owner"
          value-key="weWorkUserId"
          placeholder="请选择群主..."
        >
          <a-option
            v-for="(item, index) in usersList?.list"
            :key="index"
            :value="item.weWorkUserId"
            :label="item.name"
          ></a-option>
        </a-select>
      </a-form-item>

      <a-form-item label="群成员" field="userlist">
        <a-select
          v-model="formModel.userlist"
          value-key="weWorkUserId"
          placeholder="请选择群成员..."
          multiple
        >
          <a-option
            v-for="(item, index) in usersList?.list"
            :key="index"
            :value="item.weWorkUserId"
            :label="item.name"
          ></a-option>
        </a-select>
      </a-form-item>
      <a-divider />
      <a-form-item>
        <a-space size="large">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import {
    CreateWechatGroupRequest,
    createWechatGroup,
  } from '@/api/scrm/customer';
  import { listUsers } from '@/api/scrm/user';

  const usersList = reactive<any>({
    list: [],
  });

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const formRef = ref();
  const formModel = ref({
    name: '',
    chatid: '',
    owner: '',
    userlist: [],
  } as CreateWechatGroupRequest);

  const rules = {
    name: [
      { required: true, message: '请输入群名称' },
      { max: 128, message: '群名称长度不能超过 128 个字符' },
    ],
    owner: [{ required: true, message: '请选择群主' }],
    userlist: [{ required: true, message: '请选择群成员' }],
  } as Record<string, FieldRule[]>;

  const state = reactive({
    submitLoading: false,
  });
  async function fetchtUsers() {
    const res = await listUsers({});
    try {
      usersList.list = res.data?.list;
    } catch (err) {
      usersList.list = [];
    }
  }

  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }
    const err = await formRef.value.validate();
    if (err) {
      return;
    }
    formModel.value.userlist = [
      ...formModel.value.userlist,
      ...formModel.value.owner,
    ];
    createWechatGroup(formModel.value)
      .then(() => {
        Message.success('创建成功');
        emits('submitSuccess');
      })
      .catch(() => {
        emits('submitFailed');
      })
      .finally(() => {
        state.submitLoading = false;
      });
  };

  onMounted(() => {
    fetchtUsers();
  });
</script>
