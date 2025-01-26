<template>
  <div class="content">
    <w-media
      :action="`${PrefixUriAdmin + UriOAMedia}/upload`"
      :headers="header"
      :media-data="mediaData"
      :total="total"
      :current="current"
      :page-size="pageSize"
      :page-size-options="[5, 10, 20, 30, 50, 100]"
      :preview-url="temUrl"
      @on-down-load="downLoadImage"
      @on-delete="onDeleteMedia"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @onChangeTab="onChangeTab"
      @onPreview="onPreview"
      @on-upload-success="onUploadSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { WMedia } from '@yaoyaochi/weyui';
  import {
    DeleteMedia,
    GetMedia,
    GetMediaByVideo,
    GetMediaOtherList,
    UriOAMedia,
  } from '@/api/wechat/official-account/media';
  import { PrefixUriAdmin } from '@/api';
  import { getToken } from '@/utils/auth';

  const header = ref<Record<string, any>>({});
  const token = getToken();
  header.value.Authorization = `Bearer ${token}`;

  const total = ref(0); // 总条数
  const pageSize = ref(10); // 每页条数
  const current = ref(1); // 当前页码
  const dataType = ref('image'); // 素材类型

  const mediaData = ref({} as any); // 素材数据
  const temUrl = ref(''); // 临时url

  const refreshMediaList = async (type: string) => {
    const res = await GetMediaOtherList({
      type,
      offset: current.value,
      count: pageSize.value,
    });
    // console.log(res);
    mediaData.value.item = res.data.item;
    total.value = res.data.total_count;
    // console.log(total.value);
  };

  const getMediaById = async (mediaId: string, type: string) => {
    // 获取素材
    // console.log(mediaId, type);
    // if ((res.data && type === 'video') || type === 'news') {
    if (type === 'video') {
      const res: any = await GetMediaByVideo({ mediaId });
      temUrl.value = res.data.down_url;
      // console.log(temUrl);
    } else {
      const res: any = await GetMedia({ mediaId });
      // 将 Base64 字符串转换为 Uint8Array
      const arrayBuffer = Uint8Array.from(atob(res.data.media), (c) =>
        c.charCodeAt(0),
      );

      // 创建 Blob 对象
      const blob = new Blob([arrayBuffer], {
        type: 'application/octet-stream',
      });

      temUrl.value = URL.createObjectURL(blob);
    }
  };

  const onDeleteMedia = async (itemId: string) => {
    // 删除图片
    // console.log(itemId);
    const res = await DeleteMedia({ mediaId: itemId });
    if (res.data.success) {
      await refreshMediaList(dataType.value);
    }
  };

  const onChangeTab = async (item: any) => {
    // 切换tab
    dataType.value = item;
    await refreshMediaList(item);
    // console.log(dataType.value);
  };
  const downLoadImage = (item: any) => {
    // 获取图片URL
    // console.log(item);
  };

  const onUploadSuccess = async () => {
    // console.log('onUploadSuccess', dataType.value);
    setInterval(() => {
      refreshMediaList(dataType.value);
    }, 2000);
  };

  const deleteImg = (item: any) => {
    // 删除图片
    console.log(item);
  };

  const pageChange = async (page: number) => {
    // 页码改变 建议offset = (page - 1) * pageSize
    current.value = page;
    refreshMediaList(dataType.value);
  };

  const pageSizeChange = async (size: number) => {
    // 每页条数改变
    pageSize.value = size;
    mediaData.value.item = [];
    refreshMediaList(dataType.value);
  };

  const onPreview = async (mediaId: string, type: string) => {
    // 预览素材 仅用于语音 视频'
    // console.log(mediaId, type);
    await getMediaById(mediaId, type);
  };

  onMounted(() => {
    refreshMediaList('image');
  });
</script>

<style scoped lang="less">
  .content {
    padding: 20px;
  }
</style>
