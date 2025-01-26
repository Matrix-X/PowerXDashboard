<!--
 * @Description: 活码
 * @Author: George
 * @Date: 2023-06-13 23:39:18
 * @LastEditors: George
 * @LastEditTime: 2023-08-02 17:22:37
-->
<template>
  <div class="container">
    <a-form
      :model="qrcodeParams"
      layout="vertical"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-space>
        <a-form-item label-width="0">
          <a-input
            v-model="qrcodeParams.name"
            allow-clear
            placeholder="请输入场景码标题"
          />
        </a-form-item>
        <a-form-item label-width="0">
          <a-select
            v-model="qrcodeParams.state"
            :style="{ width: '200px' }"
            placeholder="请选择场景码状态"
            allow-clear
          >
            <a-option :value="1">启用</a-option>
            <a-option :value="2">禁用</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label-width="0">
          <a-select
            v-model="qrcodeParams.userId"
            allow-search
            :style="{ width: '200px' }"
            placeholder="请选择员工"
            allow-clear
          >
            <a-option
              v-for="(item, index) in usersList.list"
              :key="index"
              :value="item.weWorkUserId"
              >{{ item.name }}</a-option
            >
          </a-select>
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
            <a-button type="primary" @click="handleAddQrcode"
              >新增活码</a-button
            >
          </div>
          <a-table
            :pagination="pagination"
            :data="customersList.list"
            :loading="state.loading"
            column-resizable
            scrollbar
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
                title="场景码标题"
                data-index="name"
                :width="200"
                :ellipsis="true"
                :tooltip="true"
              ></a-table-column>
              <a-table-column
                title="场景码"
                :width="200"
                data-index="RealQrcodeLink"
                :ellipsis="true"
                :tooltip="true"
              >
                <template #cell="{ record }">
                  <a-popover>
                    <vue-qr
                      :id="'qrcode' + record.qid"
                      class="qrcode"
                      logo-src="/logo.png"
                      :text="qrcodeUrl + '?qid=' + record.qid"
                      :size="300"
                    ></vue-qr>
                    <template #content>
                      <vue-qr
                        class="qrcode1"
                        logo-src="/logo.png"
                        :text="qrcodeUrl + '?qid=' + record.qid"
                        :size="300"
                      ></vue-qr>
                    </template>
                  </a-popover>
                </template>
              </a-table-column>
              <a-table-column
                title="使用员工"
                :width="200"
                :ellipsis="true"
                :tooltip="true"
              >
                <template #cell="{ record }">
                  <template v-if="record && record.owner.length > 0">
                    {{ record.owner.join(',') }}
                  </template>
                </template>
              </a-table-column>
              <a-table-column
                title="累计访问次数"
                :width="120"
                data-index="cpa"
                :ellipsis="true"
                :tooltip="true"
              ></a-table-column>
              <a-table-column title="二维码到期时间" :width="150">
                <template #cell="{ record }">
                  <span>{{ getTime(record.expiryDate) }}</span>
                </template>
              </a-table-column>
              <a-table-column title="场景码状态" :width="120">
                <template #cell="{ record }">
                  <a-tag v-if="record.state === 1" color="#7bc616">启用</a-tag>
                  <a-tag v-if="record.state === 2" color="#f53f3f">禁用</a-tag>
                </template>
              </a-table-column>
              <a-table-column title="二维码状态" :width="120">
                <template #cell="{ record }">
                  <a-tag v-if="record.expiryState > 0" color="#7bc616"
                    >正常</a-tag
                  >
                  <a-tag v-if="record.expiryState === 0" color="#f53f3f"
                    >过期</a-tag
                  >
                </template>
              </a-table-column>
              <a-table-column
                title="描述信息"
                data-index="desc"
                :width="200"
                :ellipsis="true"
                :tooltip="true"
              ></a-table-column>
              <a-table-column
                fixed="right"
                title="操作"
                data-index="Mobile"
                :width="320"
              >
                <template #cell="{ record }">
                  <a-link @click="handleEdit(record)"> 编辑 </a-link>
                  <a-divider direction="vertical" />
                  <a-link @click="handleDownload(record)"> 下载 </a-link>
                  <a-divider v-if="record.state === 1" direction="vertical" />
                  <a-link
                    v-if="record.state === 1"
                    @click="handlePreview(record)"
                  >
                    预览
                  </a-link>
                  <a-divider direction="vertical" />
                  <a-link>
                    <a-popconfirm
                      content="确定要删除当前活码？"
                      type="warning"
                      @ok="handleDelete(record)"
                    >
                      <span>删除</span>
                    </a-popconfirm>
                  </a-link>
                  <a-divider
                    v-if="record.state === 1 || record.state === 2"
                    direction="vertical"
                  />
                  <a-link
                    v-if="record.state === 1 || record.state === 2"
                    @click="handleEnableQrcode(record)"
                  >
                    <span v-if="record.state === 1">禁用</span>
                    <span v-if="record.state === 2">启用</span>
                  </a-link>
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
      <edit-qr
        :users-list="usersList.list"
        :edit-data="state.recordObj"
        @submit-success="handleSendSuccess"
      ></edit-qr>
    </a-drawer>
    <a-drawer
      v-model:visible="state.preViewvisible"
      width="375px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <iframe
        v-if="state.preViewvisible"
        id="iframeid"
        height="600"
        :src="
          'https://scrm.superman.net.cn/h5/#/pages/index/index?qid=' +
          state.recordObj.qid
        "
        frameborder="0"
      ></iframe>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import {
    getQrcodeList,
    GetQrcodeRequest,
    deleteQrcode,
    enableQrcode,
    disableQrcode,
  } from '@/api/scrm/enterprise-qr';
  import { listUsers } from '@/api/scrm/user';

  const qrcodeUrl = import.meta.env.VITE_BASE_QRCODE_URL;
  const state = reactive({
    loading: false,
    visible: false,
    preViewvisible: false,
    title: '新增活码',
    recordObj: {
      qid: '',
      state: 1,
    },
  });
  const qrcodeParams = ref({
    userId: '',
    name: '',
    cursor: '',
    qid: '',
    state: '',
    pageIndex: 1,
    expiryState: '',
    pageSize: 10,
  } as GetQrcodeRequest);
  const usersList = reactive<any>({
    list: [],
  });
  const pagination = reactive({
    'total': 0,
    'currentPage': qrcodeParams.value.pageSize,
    'pageSize': qrcodeParams.value.pageSize,
    'show-total': true,
    'show-jumper': true,
    'show-page-size': true,
  });

  const customersList = reactive<any>({
    list: [],
  });
  async function fetchQrcodeList() {
    const data = qrcodeParams.value;
    if (!qrcodeParams.value.state) {
      data.state = undefined;
    }
    state.loading = true;
    const res = await getQrcodeList({
      ...data,
    });
    try {
      customersList.list = res.data?.list;
      pagination.total = res.data?.total;
    } finally {
      state.loading = false;
    }
  }
  async function fetchtDeleteQrcode() {
    const recordQid = state.recordObj.qid;
    const res = await deleteQrcode(recordQid);
    try {
      if (res.status) {
        Message.success('删除成功');
        fetchQrcodeList();
      }
    } finally {
      state.loading = false;
    }
  }
  const handleSubmit = () => {
    fetchQrcodeList();
  };
  const formData = toRaw({
    ...qrcodeParams.value,
  });
  const handleReset = () => {
    qrcodeParams.value = { ...formData };
    fetchQrcodeList();
  };
  const handleSendSuccess = () => {
    state.visible = false;
    fetchQrcodeList();
  };
  const handleAddQrcode = () => {
    state.title = '新增活码';
    state.recordObj = {
      qid: '',
      state: 1,
    };
    state.visible = true;
  };
  const handleEdit = (record: any) => {
    state.title = '编辑活码';
    state.recordObj = record;
    state.visible = true;
  };
  const handlePreview = (record: any) => {
    state.recordObj = record;
    state.preViewvisible = true;
  };
  const handleDelete = (record: any) => {
    state.recordObj = record;
    fetchtDeleteQrcode();
  };
  async function getQrcodeState() {
    const qrcodeQid = state.recordObj.qid;
    if (state.recordObj.state === 1) {
      const res = await disableQrcode(qrcodeQid);
      try {
        if (res.status) {
          Message.success('禁用成功');
          fetchQrcodeList();
        }
      } finally {
        Message.error('禁用失败');
      }
    } else if (state.recordObj.state === 2) {
      const res = await enableQrcode(qrcodeQid);
      try {
        if (res.status) {
          Message.success('启用成功');
          fetchQrcodeList();
        }
      } finally {
        state.loading = false;
      }
    }
  }
  const handleEnableQrcode = (record: any) => {
    state.recordObj = record;
    getQrcodeState();
  };

  function saveImage(data: string, filename: string) {
    const saveLink: any = document.createElement('a');
    saveLink.style = 'display: none';
    saveLink.href = data;
    saveLink.download = filename;
    const event = document.createEvent('MouseEvents');
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null,
    );
    saveLink.dispatchEvent(event);
    setTimeout(() => {
      document.body.removeChild(saveLink);
    }, 500);
  }
  const handleDownload = (record: any) => {
    const picData: any = document.getElementById(`qrcode${record.qid}`);
    const a = document.createElement('a');
    a.href = picData.src;
    saveImage(picData.src, 'qrcode.png');
  };
  const pageChanged = (page: number) => {
    pagination.currentPage = page;
    qrcodeParams.value.pageIndex = page;
    fetchQrcodeList();
  };
  const pageSizeChanged = (pageSize: number) => {
    qrcodeParams.value.pageSize = pageSize;
    pagination.pageSize = pageSize;
    fetchQrcodeList();
  };
  async function fetchtUsers() {
    const res = await listUsers({});
    try {
      usersList.list = res.data?.list;
    } catch (err) {
      usersList.list = [];
    }
  }
  function getTime(timestamp: number): string {
    const date = new Date(timestamp);
    const Y = date.getFullYear();
    const M =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${Y} - ${M} - ${D}`;
  }
  onMounted(() => {
    fetchQrcodeList();
    fetchtUsers();
  });
</script>

<style lang="less" scoped>
  .qrcode {
    width: 100px;
    height: 100px;
  }
  .qrcode1 {
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
  .arco-table-cell {
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
  }
</style>
