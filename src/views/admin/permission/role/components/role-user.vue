<template>
  <div>
    <a-spin :loading="state.loading">
      <a-transfer
        v-if="state.loading === false"
        :data="transferData"
        :default-value="selected"
        show-search
        :title="['未分配', '已分配']"
        @change="onChange"
      >
      </a-transfer>
      <div style="width: 100%; margin-top: 24px; text-align: center">
        <a-button type="primary" @click="submit">更新</a-button>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive, computed } from 'vue';
  import {
    getRoleUsers,
    GetRoleUsersRequest,
    RoleUser,
    setRoleUsers,
  } from '@/api/permission';
  import { UserOption, getUserOptions } from '@/api/common';
  import { Message } from '@arco-design/web-vue';
  import { MaxPageSize } from '@/api';

  const prop = defineProps({
    roleCode: {
      type: String,
      required: true,
      default: '',
    },
  });

  const emit = defineEmits(['submitSuccess']);

  const data = ref([] as RoleUser[]);

  const option = reactive({
    userList: [] as UserOption[],
  });

  const transferData = computed(() =>
    option.userList.map(
      (user) =>
        ({
          value: user.id.toString(),
          label: `${user.name}(${user.email})` !== '' ? `${user.name}` : '',
        }) as any,
    ),
  );

  const selected = computed(() => data.value.map((user) => user.id.toString()));

  const selectValue = ref([] as number[]);

  const state = reactive({
    loading: true,
  });

  const onChange = (values: string[]) => {
    selectValue.value = values.map((value) => parseInt(value, 10));
  };

  const fetchRoleUsers = async (roleCode: string) => {
    state.loading = true;
    const request: GetRoleUsersRequest = {
      roleCode,
      pageIndex: 1,
      pageSize: MaxPageSize,
    };

    getRoleUsers(request)
      .then((res) => {
        data.value = res.data.list;
      })
      .finally(() => {
        state.loading = false;
      });
  };

  // todo pagination
  function fetchOption() {
    getUserOptions({
      pageIndex: 1,
      pageSize: MaxPageSize,
    }).then((res) => {
      option.userList = res.data.list;
    });
  }

  const submit = () => {
    setRoleUsers({
      roleCode: prop.roleCode,
      userIds: selectValue.value,
    }).then(() => {
      Message.success('更新成功');
      emit('submitSuccess');
    });
  };

  onMounted(() => {
    fetchOption();
    fetchRoleUsers(prop.roleCode);
  });
</script>
