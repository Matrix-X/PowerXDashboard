<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddStore()">新增门店</a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <StoreTable ref="RefStoreTable" />
    </a-card>
    <a-drawer
      v-model:visible="state.createStore.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreateStore
        v-if="state.createStore.visible"
        @submit-success="refreshStoreList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import StoreTable from '@/views/crm/market/store/components/store-table.vue';
  import CreateStore from '@/views/crm/market/store/components/create-store.vue';
  import { DefaultPageSize } from '@/api';

  const RefStoreTable = ref<any>();

  const state = reactive({
    createStore: {
      visible: false,
      parentNode: {},
    },
  });

  const openAddStore = () => {
    state.createStore.visible = true;
  };

  const pagination = reactive({
    'total': 0,
    'currentPage': 0,
    'pageSize': DefaultPageSize,
    'show-more': true,
    'show-total': true,
    'show-jumper': true,
    'show-page-size': true,
  });

  const refreshStoreList = () => {
    RefStoreTable.value.fetchStoreList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };
</script>

<style scoped lang="less"></style>
