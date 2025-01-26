<template>
  <div class="content">
    <a-form class="inline-query-form" layout="inline" :model="queryForm">
      <a-form-item label="用户名">
        <a-input v-model="queryForm.likeName" @change="queryChange" />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-model="queryForm.likeEmail" @change="queryChange" />
      </a-form-item>
      <a-form-item label="手机号码">
        <a-input v-model="queryForm.likePhoneNumber" @change="queryChange" />
      </a-form-item>
      <a-form-item label="职位">
        <a-select
          v-model="queryForm.positionIds"
          :options="option.positions"
          multiple
          allow-clear
          @change="queryChange"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="角色">
        <a-select
          v-model="queryForm.roleCodes"
          :options="option.roles"
          :field-names="{ label: 'roleName', value: 'roleCode' }"
          multiple
          allow-clear
          @change="queryChange"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="状态">
        <a-select
          v-model="queryForm.isEnable"
          allow-clear
          @clear="
            () => {
              queryForm.isEnable = undefined;
            }
          "
          @change="queryChange"
        >
          <a-option :value="0">未启用</a-option>
          <a-option :value="1">已启用</a-option>
        </a-select>
      </a-form-item>
    </a-form>
    <a-divider />
    <a-table
      :data="pageData.list"
      :loading="state.tableLoading"
      column-resizable
      scrollbar
    >
      <template #columns>
        <a-table-column title="姓名" :width="100">
          <template #cell="{ record }">
            <a-link @click="gotoUserDetail(record.id)"
              >{{ record.name }}
            </a-link>
          </template>
        </a-table-column>
        <a-table-column title="账号" data-index="account" :width="100" />
        <a-table-column title="性别" :width="75">
          <template #cell="{ record }">
            <span>{{ getGenderLabel(record.gender) }}</span>
          </template>
        </a-table-column>
        <a-table-column title="邮箱" data-index="email" :width="175" ellipsis />
        <a-table-column title="手机" data-index="mobilePhone" :width="150" />
        <a-table-column title="状态" :width="150">
          <template #cell="{ record }">
            <a-switch
              :model-value="record.isEnabled"
              @change="
                (v) => {
                  changeUserStatus(record.id, v);
                }
              "
            />
          </template>
        </a-table-column>
        <a-table-column
          title="创建日期"
          data-index="createdAt"
          :width="175"
          ellipsis
        />
        <a-table-column title="操作" :width="200">
          <template #cell="{ record }">
            <a-space>
              <!-- 编辑员工按钮 -->
              <a-button @click="openEditUserModal(record.id)">
                <template #icon>
                  <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
                </template>
              </a-button>
              <!-- 强退用户按钮（禁用） -->
              <a-button title="导出" disabled>
                <template #icon>
                  <icon-export :style="{ fontSize: '16px', color: 'gray' }" />
                </template>
              </a-button>
              <!-- 删除员工按钮 -->
              <a-popconfirm
                content="确定要删除用户吗?"
                :ok-loading="state.deleteUserLoading"
                @ok="deleteUserById(record.id)"
              >
                <a-button>
                  <template #icon>
                    <icon-delete :style="{ fontSize: '16px', color: 'red' }" />
                  </template>
                </a-button>
              </a-popconfirm>
            </a-space>
            <a-drawer
              v-if="
                state.editUser.visible && state.editUser.userId === record.id
              "
              v-model:visible="state.editUser.visible"
              title="编辑员工"
              width="500px"
            >
              <EditUser
                :id="state.editUser.userId"
                @submit-success="queryChange()"
              />
            </a-drawer>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { getUserQueryOptions, getOptions } from '@/api/common';
  import EditUser from '@/views/admin/user/components/edit-user.vue';
  import {
    deleteUser,
    listUsers,
    ListUsersReply,
    ListUsersRequest,
    updateUser,
  } from '@/api/user';

  const { t } = useI18n();
  const router = useRouter();

  const option = ref({} as any);

  const props = defineProps({
    depIds: {
      type: Array as () => number[],
      default: [] as number[],
    },
  });

  const emit = defineEmits(['update:depIds']);

  const depIds = computed({
    get() {
      return props.depIds;
    },
    set(v) {
      emit('update:depIds', v);
    },
  });

  const queryForm = reactive({
    likeName: '',
    likeEmail: '',
    positionIds: [],
    likePhoneNumber: '',
    roleCodes: [] as string[],
    isEnable: undefined as undefined | boolean,
    depIds: [],
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

  function fetchOption() {
    getUserQueryOptions().then((res) => {
      option.value.roles = res.data.roles;
      option.value.departments = res.data.departments;
    });
    getOptions({ type: 'position' }).then((res) => {
      option.value.positions = res.data.options;
    });
  }

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

  // --- other code ---

  function getGenderLabel(gender: string): string {
    if (gender === 'male') {
      return t('user.genderUnKnown');
    }
    if (gender === 'female') {
      return t('user.genderMale');
    }
    if (gender === 'un_know') {
      return t('user.genderFemale');
    }
    return '';
  }

  function gotoUserDetail(id: number) {
    router.push(`/admin/user/detail/${id}`);
  }

  function changeUserStatus(id: number, value: any) {
    const status = value ? 'enabled' : 'disabled';
    updateUser({ id, status })
      .then((res) => {
        pageData.value.list.forEach((item) => {
          if (item.id === id) {
            item.isEnabled = res.data.isEnabled;
          }
        });
      })
      .finally(() => {
        state.tableLoading = false;
      });
  }

  const deleteUserById = (id: number) => {
    if (state.deleteUserLoading) {
      return;
    }
    state.deleteUserLoading = true;
    deleteUser({ id })
      .then((res) => {
        queryChange();
      })
      .finally(() => {
        state.deleteUserLoading = false;
      });
  };

  function openEditUserModal(id: number) {
    state.editUser.userId = id;
    state.editUser.visible = true;
  }

  watch(depIds, () => {
    queryForm.depIds = depIds.value;
    queryChange();
  });

  onMounted(() => {
    fetchOption();
    queryChange();
  });

  defineExpose({
    refresh: queryChange,
  });
</script>

<style scoped></style>
