<!--
 * @Description: 标签
 * @Author: George
 * @Date: 2023-06-13 23:39:18
 * @LastEditors: George
 * @LastEditTime: 2023-07-30 23:13:38
-->
<template>
  <div class="container">
    <a-form
      :model="tagParams"
      layout="vertical"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-space>
        <a-form-item label-width="0">
          <a-input
            v-model="tagParams.groupName"
            allow-clear
            placeholder="请输入标签组标题"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">搜索</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-space>
    </a-form>
    <a-row :gutter="{ xs: 24, sm: 24, md: 24, lg: 24 }">
      <a-col :xs="24" :sm="24" :md="24" :lg="24">
        <a-card>
          <div class="right">
            <a-button
              type="primary"
              style="margin: 0 10px"
              @click="handleAddGroup"
              >新增标签组</a-button
            >
            <!-- <a-button style="margin:0 10px"  type="primary" @click="fetchDeleteAll">批量删除标签</a-button> -->
            <a-button type="primary" @click="fetchWechatTagSync"
              >同步企微标签</a-button
            >
          </div>

          <a-table
            v-model:selectedKeys="selectedKeys"
            :pagination="pagination"
            :data="tagList.list"
            :loading="state.loading"
            column-resizable
            scrollbar
            row-key="tagId"
            :bordered="{ cell: true }"
            @page-change="pageChanged"
            @page-size-change="pageSizeChanged"
          >
            <template #columns>
              <a-table-column title="序号" :width="70">
                <template #cell="{ rowIndex }">
                  {{ rowIndex + 1 }}
                </template>
              </a-table-column>
              <a-table-column
                title="标签组"
                :width="180"
                data-index="groupName"
                :ellipsis="true"
                :tooltip="true"
              ></a-table-column>
              <a-table-column title="标签" data-index="name" :ellipsis="true">
                <template #cell="{ record }">
                  <template v-if="record.tags && record.tags.length > 5">
                    <a-popover style="width: 300px">
                      <div v-if="record.tags && record.tags.length > 5">
                        <span
                          v-for="(item, index) in record.tags"
                          :key="index"
                          style="margin: 0 8px"
                        >
                          <a-tag
                            v-if="item.name && item.name != ' '"
                            color="arcoblue"
                          >
                            {{ item.name }}
                          </a-tag>
                        </span>
                        <a-tag style="margin: 0 8px" color="arcoblue">
                          ···
                        </a-tag>
                      </div>
                      <div v-else>
                        <span
                          v-for="(item, index) in record.tags"
                          :key="index"
                          style="margin: 0 8px"
                        >
                          <a-tag
                            v-if="item.name && item.name != ' '"
                            color="arcoblue"
                          >
                            {{ item.name }}
                          </a-tag>
                        </span>
                      </div>
                      <template #content>
                        <span v-for="(item, index) in record.tags" :key="index">
                          <a-tag
                            v-if="item.name && item.name != ' '"
                            color="arcoblue"
                            style="margin: 4px 8px"
                          >
                            {{ item.name }}
                          </a-tag>
                        </span>
                      </template>
                    </a-popover>
                  </template>
                  <template v-else>
                    <span
                      v-for="(item, index) in record.tags"
                      :key="index"
                      style="margin: 0 8px"
                    >
                      <a-tag
                        v-if="item.name && item.name != ' '"
                        color="arcoblue"
                      >
                        {{ item.name }}
                      </a-tag>
                    </span>
                  </template>
                </template>
              </a-table-column>
              <a-table-column
                fixed="right"
                title="操作"
                data-index="Mobile"
                :width="180"
              >
                <template #cell="{ record }">
                  <a-link @click="handleAdd(record)"> 新增 </a-link>
                  <a-divider direction="vertical" />
                  <a-link @click="handleEdit(record)"> 编辑 </a-link>
                  <!-- <a-divider direction="vertical" />
                  <a-link >
                    <a-popconfirm content="确定要删除当前标签？" type="warning" @ok="handleDelete(record)">
                      <span>删除</span>
                    </a-popconfirm>
                  </a-link> -->
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <a-drawer
      v-model:visible="state.visible"
      width="500px"
      ok-text="关闭抽屉"
      :title="state.title"
      :hide-cancel="true"
    >
      <edit-tag
        :users-list="usersList.list"
        :edit-data="state.recordObj"
        @submit-success="handleEditSuccess"
      ></edit-tag>
    </a-drawer>

    <a-drawer
      v-model:visible="state.addVisible"
      width="500px"
      ok-text="关闭抽屉"
      title="新增标签组"
      :hide-cancel="true"
    >
      <add-tag @submit-success="handleAddSuccess"></add-tag>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import {
    getGroupTagList,
    GetTagRequest,
    wechatTagSync,
    corpOption,
  } from '@/api/scrm/tag';
  import EditTag from './components/edit-tag.vue';
  import AddTag from './components/add-tag.vue';

  const state = reactive({
    loading: false,
    visible: false,
    addVisible: false,
    preViewvisible: false,
    title: '新增标签',
    tagKeyValue: {},
    recordObj: {
      type: 1,
      groupId: '',
      tags: [],
    },
  });
  const selectedKeys = ref([]);
  const tagParams = ref({
    name: '',
    groupName: '',
    pageIndex: 1,
    pageSize: 10,
  } as GetTagRequest);
  const usersList = reactive<any>({
    list: [],
  });
  const pagination = reactive({
    'total': 0,
    'currentPage': tagParams.value.pageSize,
    'pageSize': tagParams.value.pageSize,
    'show-total': true,
    'show-jumper': true,
    'show-page-size': true,
  });

  const tagList = reactive<any>({
    list: [],
  });

  async function fetchCorpOption() {
    const res = await corpOption();
    try {
      state.tagKeyValue = res.data.list;
    } finally {
      state.loading = false;
    }
  }
  async function fetchTagList() {
    const data = tagParams.value;
    state.loading = true;
    const res = await getGroupTagList({
      ...data,
    });
    try {
      tagList.list = res.data?.list;
      pagination.total = res.data?.total;
    } finally {
      state.loading = false;
    }
  }

  async function fetchWechatTagSync() {
    const res = await wechatTagSync();
    try {
      if (res.status) {
        Message.success('同步成功');
        fetchTagList();
      }
    } finally {
      Message.error('同步失败');
    }
  }
  const handleSubmit = () => {
    fetchTagList();
  };
  const form = toRaw({
    ...tagParams.value,
  });
  const handleReset = () => {
    tagParams.value = { ...form };
    fetchTagList();
  };
  const handleEditSuccess = () => {
    state.visible = false;
    fetchTagList();
  };
  const handleAddSuccess = () => {
    state.addVisible = false;
    fetchTagList();
  };
  const handleAddGroup = () => {
    state.title = '新增标签';
    state.addVisible = true;
  };

  const handleAdd = (record: any) => {
    state.title = '新增标签';
    state.recordObj.type = 1;
    state.recordObj.groupId = record.groupId;
    state.recordObj.tags = record.tags ? record.tags : [];
    state.visible = true;
  };
  const handleEdit = (record: any) => {
    state.title = '编辑标签';
    state.recordObj.type = 2;
    state.recordObj.groupId = record.groupId;
    state.recordObj.tags = record.tags ? record.tags : [];
    state.visible = true;
  };

  const pageChanged = (page: number) => {
    pagination.currentPage = page;
    tagParams.value.pageIndex = page;
    fetchTagList();
  };
  const pageSizeChanged = (pageSize: number) => {
    tagParams.value.pageSize = pageSize;
    pagination.pageSize = pageSize;
    fetchTagList();
  };
  onMounted(async () => {
    await fetchCorpOption();
    fetchTagList();
  });
</script>

<style lang="less" scoped>
  #qrcode {
    width: 100px;
    height: 100px;
  }
  #qrcode1 {
    width: 150px;
    height: 150px;
  }
  .header {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .right {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }
  :deep(.arco-table-cell) {
    display: block;
    width: 100%;
    text-align: center;
  }
  :deep(.arco-table-td-content) {
    display: block;
    width: 100%;
    text-align: center;
  }
  .arco-table-cell .arco-table-th-title {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
</style>
