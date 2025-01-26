<template>
  <a-tree
    v-if="data.depTree.length > 0"
    v-model:expanded-keys="state.expandKeys"
    :data="data.depTree"
    :show-line="true"
    :field-names="{
      title: 'depName',
      key: 'id',
      children: 'children',
    }"
    checked-strategy="child"
    @select="onSelect"
  >
    <template #title="nodeData">
      <span>{{ nodeData.depName }}</span>
    </template>
    <template #extra="nodeData">
      <a-dropdown position="bl">
        <a-button type="text" style="margin-right: 16px"
          ><icon-settings
        /></a-button>
        <template #content>
          <a-doption @click="openAddDepDrawer(nodeData.id)"
            >添加子部门</a-doption
          >
        </template>
      </a-dropdown>
      <a-drawer
        v-if="
          nodeData.id === state.addDepDrawer.pId && state.addDepDrawer.visible
        "
        v-model:visible="state.addDepDrawer.visible"
        title="添加子部门"
        width="500px"
        :footer="false"
      >
        <CreateDepartment
          :id="state.addDepDrawer.pId"
          @submit-success="afterCreate"
        />
      </a-drawer>
    </template>
    <template #switcher-icon>
      <icon-user-group />
    </template>
  </a-tree>
</template>

<script lang="ts" setup>
  import { computed, onMounted, PropType, reactive } from 'vue';
  import { DepartmentNode, getDepartmentTree } from '@/api/department';
  import CreateDepartment from '@/views/admin/user/components/create-department.vue';

  const prop = defineProps({
    modelValue: {
      type: Number as PropType<number | undefined>,
      default: 1,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const depId = computed({
    get() {
      return prop.modelValue;
    },
    set(v) {
      emit('update:modelValue', v);
    },
  });

  const data = reactive({
    depTree: [] as DepartmentNode[],
  });

  const state = reactive({
    addDepDrawer: {
      visible: false,
      pId: 0,
    },
    expandKeys: [0] as number[],
  });

  const onSelect = (v: any[]) => {
    depId.value = v.shift();
  };

  function fetch() {
    getDepartmentTree({ depId: 1 }).then((res) => {
      data.depTree = [res.data.depTree];
      if (!state.expandKeys.includes(res.data.depTree.id)) {
        state.expandKeys.push(res.data.depTree.id);
      }
    });
  }

  const afterCreate = () => {
    fetch();
    state.expandKeys.push(state.addDepDrawer.pId);
    state.addDepDrawer.visible = false;
  };

  function openAddDepDrawer(pId: number) {
    state.addDepDrawer.visible = true;
    state.addDepDrawer.pId = pId;
  }

  onMounted(() => {
    fetch();
  });
</script>

<style scoped></style>
