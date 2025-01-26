<!--
 * @Description: 
 * @Author: George
 * @Date: 2023-08-24 00:13:28
 * @LastEditors: George
 * @LastEditTime: 2023-08-24 00:41:28
-->
<template>
  <a-tree
    v-if="
      departmentTree && departmentTree.list && departmentTree.list.length > 0
    "
    :data="departmentTree.list"
    :show-line="true"
    :field-names="{
      title: 'name',
      key: 'weWorkDepId',
      children: 'children',
    }"
    checked-strategy="child"
    @select="onSelect"
  >
    <template #title="nodeData">
      <span>{{ nodeData.name }}</span>
    </template>
    <template #switcher-icon>
      <icon-user-group />
    </template>
  </a-tree>
</template>

<script lang="ts" setup>
  import { computed, onMounted, PropType, ref } from 'vue';
  import {
    DepartmentNode,
    getDepartmentTree,
    GetDepartmentTreeReply,
  } from '@/api/scrm/department';

  const prop = defineProps({
    modelValue: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  });
  const emit = defineEmits(['update:modelValue', 'departmentSelect']);

  const depId = computed({
    get() {
      return prop.modelValue;
    },
    set(v) {
      emit('update:modelValue', v);
    },
  });

  const departmentTree = ref<GetDepartmentTreeReply>({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    list: [],
  });

  const onSelect = (selectedKeys: any) => {
    depId.value = selectedKeys[0] === 1 ? 0 : selectedKeys[0];
  };
  const departNodes = (data: DepartmentNode[], parentId = 0) => {
    const departNodesList: DepartmentNode[] = [];
    data.forEach((item) => {
      if (item.weWorkParentId === parentId) {
        const children = departNodes(data, item.weWorkDepId);
        if (children.length > 0) {
          item.children = children;
        }
        departNodesList.push(item);
      }
    });
    return departNodesList;
  };
  function fetchDepartmentTree() {
    getDepartmentTree().then((res: any) => {
      const list: DepartmentNode | any = res.data.list || [];
      const departNodesList = departNodes(list);
      res.data.list = departNodesList;
      departmentTree.value = res.data;
    });
  }

  onMounted(() => {
    fetchDepartmentTree();
  });
</script>
