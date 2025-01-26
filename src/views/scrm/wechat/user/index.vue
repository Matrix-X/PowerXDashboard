<!--
 * @Description:
 * @Author: George
 * @Date: 2023-08-23 23:51:30
 * @LastEditors: George
 * @LastEditTime: 2023-08-24 00:32:21
-->
<template>
  <div class="container">
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
            <DepartmentSide
              style="min-height: 65vh"
              @update:model-value="handleDepartmentChange"
            />
          </a-scrollbar>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="17">
        <a-card>
          <a-table
            :data="pageData.list"
            :loading="state.tableLoading"
            column-resizable
            scrollbar
          >
            <template #columns>
              <a-table-column title="用户id" data-index="Mobile" :width="150" />
              <a-table-column title="姓名" :width="100">
                <template #cell="{ record }">
                  {{ record.name }}
                </template>
              </a-table-column>
              <!-- <a-table-column title="性别" :width="75">
                <template #cell="{ record }">
                  <span>{{ getGenderLabel(record.gender) }}</span>
                </template>
              </a-table-column> -->
              <a-table-column
                title="邮箱"
                data-index="Email"
                :width="175"
                ellipsis
              />
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import DepartmentSide from '@/views/scrm/wechat/user/components/department-side.vue';
  import { listUsers, ListUsersReply, ListUsersRequest } from '@/api/scrm/user';

  const queryForm = reactive({
    weWorkMainDepartmentId: null,
  } as ListUsersRequest);
  const state = reactive({
    tableLoading: false,
    deleteUserLoading: false,
    editUser: {
      visible: false,
      loading: false,
      userId: 0,
    },
  });

  const pageData = ref({} as ListUsersReply);

  const queryChange = () => {
    if (state.tableLoading) {
      return;
    }
    state.tableLoading = true;
    listUsers(queryForm)
      .then((res) => {
        pageData.value = res.data;
      })
      .finally(() => {
        state.tableLoading = false;
      });
  };
  const handleDepartmentChange = (data: number | undefined) => {
    queryForm.weWorkMainDepartmentId = data;
    queryChange();
  };

  onMounted(() => {
    queryChange();
  });
</script>

<style scoped></style>
