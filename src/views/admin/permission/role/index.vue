<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="state.createRole.visible = true">
          新增角色
        </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <a-table :data="data.list">
        <template #columns>
          <a-table-column title="角色编码" data-index="roleCode" />
          <a-table-column title="角色名称" data-index="name" />
          <a-table-column title="角色描述" data-index="desc" />
          <a-table-column title="操作" data-index="id">
            <template #cell="{ record }">
              <a-space>
                <!-- 编辑角色按钮 -->
                <a-tooltip content="编辑角色">
                  <a-button @click="editRoleOnClick(record.roleCode)">
                    <template #icon>
                      <icon-edit
                        :style="{ fontSize: '16px', color: 'green' }"
                      />
                    </template>
                  </a-button>
                </a-tooltip>
                <!--                &lt;!&ndash; 编辑员工按钮 &ndash;&gt;-->
                <!--                <a-tooltip content="分配员工">-->
                <!--                  <a-button @click="editUserOnClick(record.roleCode)">-->
                <!--                    <template #icon>-->
                <!--                      <icon-user-->
                <!--                        :style="{ fontSize: '16px', color: 'green' }"-->
                <!--                      />-->
                <!--                    </template>-->
                <!--                  </a-button>-->
                <!--                </a-tooltip>-->
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-drawer
      v-model:visible="state.createRole.visible"
      width="500px"
      :footer="false"
    >
      <CreateRole v-if="state.createRole.visible" @submit-success="fetch" />
    </a-drawer>
    <a-drawer
      v-model:visible="state.editRole.visible"
      width="500px"
      :footer="false"
    >
      <EditRole
        v-if="state.editRole.visible"
        :role-code="state.editRole.roleCode"
        @submit-success="fetch"
      />
    </a-drawer>
    <a-drawer
      v-model:visible="state.editUser.visible"
      width="500px"
      :footer="false"
    >
      <RoleUser
        v-if="state.editUser.visible"
        :role-code="state.editUser.roleCode"
        @submit-success="fetch"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import CreateRole from '@/views/admin/permission/role/components/create-role.vue';
  import EditRole from '@/views/admin/permission/role/components/edit-role.vue';
  import { onMounted, reactive, ref } from 'vue';
  import { listRoles, ListRolesReply } from '@/api/permission';
  import RoleUser from '@/views/admin/permission/role/components/role-user.vue';

  const state = reactive({
    createRole: {
      visible: false,
    },
    editRole: {
      visible: false,
      roleCode: '',
    },
    editUser: {
      visible: false,
      roleCode: '',
    },
  });

  const data = ref({} as ListRolesReply);

  function fetch() {
    listRoles().then((res) => {
      data.value = res.data;
      state.createRole.visible = false;
      state.editRole.visible = false;
      state.editUser.visible = false;
    });
  }

  function editUserOnClick(roleCode: string) {
    state.editUser.visible = true;
    state.editUser.roleCode = roleCode;
  }

  function editRoleOnClick(roleCode: string) {
    state.editRole.visible = true;
    state.editRole.roleCode = roleCode;
  }

  onMounted(() => {
    fetch();
  });
</script>

<script lang="ts">
  export default {
    name: 'RoleList',
  };
</script>
