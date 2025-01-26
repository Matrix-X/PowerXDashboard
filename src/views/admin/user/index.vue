<template>
  <div class="container">
    <a-card>
      <a-space>
        <a-button type="primary" @click="state.createUserVisible = true"
          >新增员工</a-button
        >
      </a-space>
    </a-card>
    <br />
    <a-card>
      <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
        <a-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="8"
          :style="{ minWidth: '300px', maxWidth: '20%' }"
        >
          <a-card>
            <a-scrollbar style="width: 100%; height: 100%; overflow: auto">
              <DepartmentSide v-model="state.depId" style="min-height: 60vh" />
            </a-scrollbar>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="16">
          <SearchUserTable
            ref="searchUserTableRef"
            v-model:dep-ids="searchDepIds"
          />
        </a-col>
      </a-row>
    </a-card>

    <a-drawer
      v-model:visible="state.createUserVisible"
      title="新增员工"
      width="500px"
      :footer="false"
    >
      <CreateUser ref="createUserRef" @submit-success="closeCreate" />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import CreateUser from '@/views/admin/user/components/create-user.vue';
  import SearchUserTable from '@/views/admin/user/components/search-user-table.vue';
  import DepartmentSide from '@/views/admin/user/components/department-side.vue';

  const createUserRef = ref();
  const searchUserTableRef = ref();

  const state = reactive({
    createUserVisible: false,
    depId: 0,
  });

  const searchDepIds = computed(() => {
    return [state.depId];
  });

  const closeCreate = () => {
    state.createUserVisible = false;
    searchUserTableRef.value.refresh();
  };
</script>

<script lang="ts">
  export default {
    name: 'UserList',
  };
</script>

<style lang="less" scoped></style>
