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
      <a-form-item label="链接" field="url">
        <a-input v-model="formModel.url" placeholder="请输入描述" />
      </a-form-item>
      <a-form-item label="群发员工" direction="vertical" field="owner">
        <div>
          <a-select
            v-model="formModel.sender"
            allow-search
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
          <p class="tips" style="color: rgb(255, 165, 0); font-size: 12px"
            >说明：选择群发的成员，即该条消息发送至该成员下的所有客户群</p
          >
        </div>
      </a-form-item>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="消息图片" field="picUrl">
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
  import { onMounted, reactive, ref } from 'vue';
  import {
    FieldRule,
    Message,
    RequestOption,
    UploadRequest,
  } from '@arco-design/web-vue';
  import uploadMediaImages from '@/utils/media-resource';
  import {
    wechatMessageTemplate,
    GetWechatGroupArticlesRequest,
    GetMessageTemplateRequest,
  } from '@/api/scrm/customer';
  import { listUsers } from '@/api/scrm/user';

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const apiUrl = import.meta.env.VITE_API_API_URL;
  const usersList = reactive<any>({
    list: [],
  });
  const formRef = ref();
  const formModel = ref({
    chatIds: [],
    title: '',
    description: '',
    url: '',
    picUrl: '',
    sendTime: null,
    sender: '',
  } as GetWechatGroupArticlesRequest);

  const formModelData = reactive({
    text: {
      content: '',
    },
    chatType: 'group',
    externalUserid: [],
    attachments: [
      {
        link: {
          msgType: 'link',
          title: '',
          desc: '',
          picUrl: formModel.value.picUrl,
          url: '',
        },
      },
    ],
    sender: '',
    sendTime: null,
  } as GetMessageTemplateRequest);

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
    sender: [{ required: true, message: '请选择群发员工' }],
    picUrl: [{ required: true, message: '请选择消息图片' }],
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
      formModel.value.picUrl = apiUrl + data.url;
    });
  };
  const handlereset = () => {
    formModel.value.picUrl = '';
    formModel.value.sendTime = null;
    state.coverUrlList = [];
    formRef.value.resetFields();
  };

  const changeCoverImage = async () => {
    return true;
  };
  async function fetchtUsers() {
    const res = await listUsers({});
    try {
      usersList.list = res.data?.list;
    } catch (err) {
      usersList.list = [];
    }
  }
  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }
    const err = await formRef.value.validate();
    if (err) {
      return;
    }
    state.submitLoading = true;
    // formModelData.text.content = formModel.value.title
    formModelData.attachments[0].link.picUrl = formModel.value.picUrl;
    formModelData.attachments[0].link.title = formModel.value.title;
    formModelData.attachments[0].link.desc = formModel.value.description;
    formModelData.attachments[0].link.url = formModel.value.url;
    formModelData.sender = formModel.value.sender || '';
    if (formModel.value.sendTime) {
      const date: any = new Date(formModel.value.sendTime);
      formModelData.sendTime = Date.parse(date);
    }
    wechatMessageTemplate(formModelData)
      .then(() => {
        handlereset();
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
  onMounted(() => {
    fetchtUsers();
  });
  // watch(
  //   () => prop.sender,
  //   () => {
  //     formModelData.sender = prop.sender
  //   }
  // );
</script>
