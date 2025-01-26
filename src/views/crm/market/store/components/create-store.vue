<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="门店名称" field="name">
        <a-input v-model="formModel.name" />
      </a-form-item>

      <a-form-item label="联系方式" field="contactNumber">
        <a-input v-model="formModel.contactNumber" />
      </a-form-item>

      <a-form-item label="门店地址" field="address">
        <a-input v-model="formModel.address" />
      </a-form-item>

      <a-form-item label="经度" field="longitude">
        <a-input-number v-model="formModel.longitude" />
      </a-form-item>

      <a-form-item label="纬度" field="latitude">
        <a-input-number v-model="formModel.latitude" />
      </a-form-item>

      <a-form-item label="营业开始" field="startWork">
        <a-time-picker v-model="formModel.startWork" style="width: 194px" />
      </a-form-item>

      <a-form-item label="营业结束" field="sndWork">
        <a-time-picker v-model="formModel.endWork" style="width: 194px" />
      </a-form-item>

      <a-form-item label="描述" field="description">
        <a-textarea v-model="formModel.description" />
      </a-form-item>

      <a-divider />
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="上传头图" field="coverUrl">
            <a-upload
              :limit="1"
              list-type="picture-card"
              :custom-request="uploadCoverImage"
              :default-file-list="state.coverUrlList"
              image-preview
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="上传详细图片" field="detailUrls">
            <a-upload
              :limit="10"
              :multiple="true"
              :draggable="true"
              list-type="picture-card"
              :custom-request="uploadDetailImages"
              :file-list="state.detailUrlList"
              image-preview
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider />

      <a-form-item>
        <a-space size="large">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { createStore, Store } from '@/api/crm/market/store';
  import {
    FieldRule,
    Message,
    RequestOption,
    UploadRequest,
  } from '@arco-design/web-vue';
  import uploadMediaImages from '@/utils/media-resource';

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const formRef = ref();
  const formModel = ref({
    name: '',
    // userId: '',
    contactNumber: '',
    address: '',
    longitude: 0.0,
    latitude: 0.0,
    startWork: '',
    endWork: '',
    coverImageId: 0,
    detailImageIds: [] as number[],
  } as Store);

  const rules = {
    name: [
      { required: true, message: '请输入门店名称' },
      { max: 10, message: '门店名称长度不能超过 10 个字符' },
    ],
    contactNumber: [
      { required: true, message: '请输入门店联系号码' },
      { max: 20, message: '门店名称长度不能超过 20 个字符' },
    ],
    address: [
      { required: true, message: '请输入门店地址' },
      { max: 50, message: '门店名称长度不能超过 60 个字符' },
    ],
    description: [{ max: 100, message: '描述长度不能超过 100 个字符' }],
  } as Record<string, FieldRule[]>;

  const state = reactive({
    coverUrlList: [],
    detailUrlList: [],
    submitLoading: false,
  });

  const uploadCoverImage: (option: RequestOption) => UploadRequest = (
    option: RequestOption,
  ) => {
    return uploadMediaImages(option, 0, (data: any) => {
      formModel.value.coverImageId = data.id;
    });
  };

  const uploadDetailImages: (option: RequestOption) => UploadRequest = (
    option: RequestOption,
  ) => {
    return uploadMediaImages(option, 0, (data: any) => {
      formModel.value.detailImageIds?.push(data.id);
    });
  };

  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }
    const err = await formRef.value.validate();
    if (err) {
      return;
    }
    state.submitLoading = true;
    createStore(formModel.value)
      .then(() => {
        Message.success('创建成功');
        emits('submitSuccess');
      })
      .catch(() => {
        emits('submitFailed');
      })
      .finally(() => {
        state.submitLoading = false;
      });
  };

  // onMounted(() => {});
</script>
