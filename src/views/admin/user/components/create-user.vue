<template>
  <div>
    <a-form ref="formRef" :model="formModel" :rules="rules" @submit="onSubmit">
      <a-form-item label="账号" field="account">
        <a-input v-model="formModel.account" />
      </a-form-item>
      <a-form-item label="姓名" field="name">
        <a-input v-model="formModel.name" />
      </a-form-item>
      <a-form-item label="昵称" field="nickName">
        <a-input v-model="formModel.nickName" />
      </a-form-item>
      <a-form-item label="描述" field="desc">
        <a-input v-model="formModel.desc" />
      </a-form-item>
      <a-form-item label="邮箱" field="email">
        <a-input v-model="formModel.email" />
      </a-form-item>
      <a-form-item label="头像" field="avatar">
        <a-upload disabled></a-upload>
      </a-form-item>
      <a-form-item label="外部邮箱" field="externalEmail">
        <a-input v-model="formModel.externalEmail" />
      </a-form-item>
      <a-form-item label="手机号" field="mobilePhone">
        <a-input v-model="formModel.mobilePhone" />
      </a-form-item>
      <a-form-item label="性别" field="gender">
        <a-radio-group v-model="formModel.gender">
          <a-radio value="male">男</a-radio>
          <a-radio value="female">女</a-radio>
          <a-radio value="un_know">未知</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="部门" field="depId">
        <a-select
          v-model="formModel.depId"
          :options="option.departments"
          :field-names="{ label: 'departmentName', value: 'departmentId' }"
        />
      </a-form-item>
      <a-form-item label="职位" field="positionId">
        <a-select
          v-model="formModel.positionId"
          :options="option.positions"
          filter-option
          :field-names="{ label: 'label', value: 'value' }"
        />
      </a-form-item>
      <a-form-item label="职称" field="jobTitle">
        <a-input v-model="formModel.jobTitle" />
      </a-form-item>
      <a-form-item label="密码" field="password">
        <a-input v-model="formModel.password" type="password" />
      </a-form-item>
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
  import { onMounted, ref } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import { getUserQueryOptions, getOptions } from '@/api/common';
  import { createUser } from '@/api/user';

  const emit = defineEmits(['submitSuccess', 'submitFailed']);

  const formRef = ref();
  const formModel = ref({
    account: '',
    name: '',
    nickName: '',
    desc: '',
    email: '',
    avatar: '',
    externalEmail: '',
    mobilePhone: '',
    gender: '',
    depId: 1,
    positionId: undefined,
    jobTitle: '',
    password: '',
  });

  const rules = {
    account: [
      { required: true, message: '请输入账号' },
      {
        min: 4,
        max: 20,
        message: '账号长度应在 4 到 20 个字符之间',
      },
    ],
    name: [
      { required: true, message: '请输入姓名' },
      {
        min: 2,
        max: 20,
        message: '姓名长度应在 2 到 20 个字符之间',
      },
    ],
    nickName: [{ max: 20, message: '昵称长度不能超过 20 个字符' }],
    desc: [{ max: 100, message: '描述长度不能超过 100 个字符' }],
    email: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入正确的邮箱格式' },
    ],
    externalEmail: [{ type: 'email', message: '请输入正确的邮箱格式' }],
    mobilePhone: [
      {
        match: /^1[3-9]\d{9}$/,
        message: '请输入正确的手机号',
      },
    ],
    gender: [{ required: true, message: '请选择性别' }],
    depId: [{ required: true, message: '请选择部门' }],
    positionId: [{ required: true, message: '请选择职位' }],
    jobTitle: [{ max: 50, message: '职称长度不能超过 50 个字符' }],
    password: [
      {
        min: 6,
        max: 20,
        message: '密码长度应在 6 到 20 个字符之间',
      },
    ],
  } as Record<string, FieldRule[]>;

  const option = ref({} as any);

  async function fetchOption() {
    const userQueryOptions = await getUserQueryOptions();
    option.value = userQueryOptions.data;
    const positionOptions = await getOptions({ type: 'position' });
    option.value.positions = positionOptions.data.options;
  }

  const onSubmit = async () => {
    const err = await formRef.value.validate();
    if (err !== undefined) {
      Message.warning({
        content: '请检查表单输入',
        duration: 5000,
      });
      return;
    }

    createUser(formModel.value)
      .then((res) => {
        Message.success({
          content: '提交成功',
          duration: 5000,
        });
        emit('submitSuccess');
      })
      .catch((error) => {
        Message.error({
          content: `提交失败: ${error.message}`,
          duration: 5000,
        });
        emit('submitFailed', error);
      });
  };

  onMounted(() => {
    fetchOption();
  });

  defineExpose({
    reFetchOption: fetchOption,
  });
</script>
