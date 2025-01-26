<template>
  <div class="content">
    <w-custom-menu
      :is-remote="true"
      :menu-data="menuDataList"
      @submit-data="submitMenuData"
    />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { WCustomMenu } from '@yaoyaochi/weyui';
  import {
    getOAMenuTree,
    GetOAMenuTreeReply,
    syncOAMenu,
  } from '@/api/wechat/official-account/menu';
  import { Message } from '@arco-design/web-vue';

  const submitMenuData = async (menuData: any) => {
    const res = await syncOAMenu(menuData);
    if (res.data.success) {
      Message.info('同步菜单成功');
    } else {
      Message.error('同步菜单失败');
    }
  };

  const menuDataList = ref<GetOAMenuTreeReply>();
  onMounted(async () => {
    const res = await getOAMenuTree();
    menuDataList.value = res.data;
    // console.log(menuDataList.value);
  });
</script>

<style scoped lang="less">
  .content {
    padding: 20px;
  }
</style>
