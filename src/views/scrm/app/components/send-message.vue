<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="标题" field="title">
        <a-input v-model="formModel.title" placeholder="请输入标题" />
      </a-form-item>

      <a-form-item label="描述" field="description">
        <a-input v-model="formModel.description" placeholder="请输入描述" />
      </a-form-item>

      <a-form-item label="群成员" field="touser">
        <a-select
          v-model="formModel.touser"
          value-key="weWorkUserId"
          placeholder="请选择群成员..."
          multiple
        >
          <a-option
            v-for="(item, index) in usersList?.list"
            :key="index"
            :value="item.weWorkUserId"
            :label="item.name"
          ></a-option>
        </a-select>
      </a-form-item>

      <a-form-item label="跳转连接" field="url">
        <a-input v-model="formModel.url" placeholder="请输入跳转连接" />
      </a-form-item>

      <a-divider />
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="消息图片" field="picurl">
            <a-upload
              :limit="1"
              list-type="picture-card"
              :custom-request="uploadCoverImage"
              :file-list="state.coverUrlList"
              image-preview
              :on-before-remove="changeCoverImage"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider />
      <a-form-item label="发送时间">
        <a-date-picker
          v-model="formModel.sendTime"
          style="width: 220px"
          show-time
          format="YYYY-MM-DD HH:mm"
        />
      </a-form-item>
      <a-divider />
      <a-form-item>
        <a-space size="large">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="handlereset">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, watch, reactive, ref } from 'vue';
  import {
    FieldRule,
    Message,
    RequestOption,
    UploadRequest,
  } from '@arco-design/web-vue';
  import uploadMediaImages from '@/utils/media-resource';
  import {
    wechatMessageArticles,
    GetMessageArticlesRequest,
    Articles,
  } from '@/api/scrm/customer';
  import { listUsers } from '@/api/scrm/user';

  const prop = defineProps({
    agentid: {
      type: Number,
    },
  });

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const apiUrl = import.meta.env.VITE_API_API_URL;

  const usersList = reactive<any>({
    list: [],
  });
  const formRef = ref();
  const formModel = ref({
    title: '',
    description: '',
    url: '',
    picurl: '',
    appid: '',
    pagepath: '',
    touser: [],
    sendTime: '',
  } as Articles);
  const formModelData = reactive({
    agentid: prop.agentid,
    sendTime: null,
    msgtype: 'news',
    touser: '@all',
    news: {
      articles: [formModel.value],
    },
  } as GetMessageArticlesRequest);

  const rules = {
    title: [
      { required: true, message: '请输入图文标题' },
      { max: 128, message: '图文标题称长度不能超过 128 个字符' },
    ],
    description: [
      { required: true, message: '请输入图文描述' },
      { max: 512, message: '图文图文描述长度不能超过 512 个字符' },
    ],
    url: [{ required: true, message: '请输入跳转链接' }],
    picurl: [{ required: true, message: '请选择消息图片' }],
  } as Record<string, FieldRule[]>;

  const state = reactive({
    coverUrlList: [] as Array<any>,
    detailUrlList: [] as Array<any>,
    submitLoading: false,
  });

  const uploadCoverImage: (option: RequestOption) => UploadRequest = (
    option: RequestOption,
  ) => {
    return uploadMediaImages(option, 0, (data: any) => {
      formModel.value.picurl = apiUrl + data.url;
    });
  };
  const changeCoverImage = async () => {
    return true;
  };
  const handlereset = () => {
    formModel.value.picurl = '';
    formModel.value.sendTime = null;
    state.coverUrlList = [];
    formRef.value.resetFields();
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
    if (formModel.value.sendTime) {
      const date: any = new Date(formModel.value.sendTime);
      formModelData.sendTime = Date.parse(date);
    }
    if (formModel.value.touser && formModel.value.touser.length > 0) {
      formModelData.touser = formModel.value.touser.join('|');
    }
    wechatMessageArticles(formModelData)
      .then(() => {
        formRef.value.resetFields();
        formModel.value.picurl = '';
        Message.success('图文消息发生成功');
        emits('submitSuccess');
      })
      .catch(() => {
        emits('submitFailed');
      })
      .finally(() => {
        state.submitLoading = false;
      });
  };
  watch(
    () => prop.agentid,
    () => {
      formModelData.agentid = prop.agentid;
    },
  );
  async function fetchtUsers() {
    const res = await listUsers({});
    try {
      usersList.list = res.data?.list;
    } catch (err) {
      usersList.list = [];
    }
  }
  onMounted(() => {
    fetchtUsers();
  });
</script>
