<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="场景码名称" field="name">
        <a-input v-model="formModel.name" placeholder="请输入场景码名称" />
      </a-form-item>
      <a-form-item
        label="二维码图片"
        direction="vertical"
        field="RealQrcodeLink"
      >
        <div>
          <a-upload
            :limit="1"
            list-type="picture-card"
            :custom-request="uploadCoverImage"
            :file-list="state.coverUrlList"
            image-preview
            :on-before-remove="changeCoverImage"
          />
          <p class="tips" style="color: rgb(255, 165, 0); font-size: 12px"
            >tips:用户扫描活码自动跳转至这个二维码</p
          >
        </div>
      </a-form-item>
      <a-form-item label="使用员工" direction="vertical" field="owner">
        <a-select
          v-model="formModel.owner"
          allow-search
          multiple
          :style="{ width: '200px' }"
          placeholder="请选择员工"
          allow-clear
        >
          <a-option
            v-for="(item, index) in prop.usersList"
            :key="index"
            :value="item.weWorkUserId"
            >{{ item.name }}</a-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="二维码到期" field="expiryDate">
        <a-date-picker
          v-model="formModel.expiryDate"
          style="width: 220px"
          format="YYYY-MM-DD"
        />
      </a-form-item>
      <a-form-item label="描述信息" field="desc">
        <a-input
          v-model="formModel.desc"
          placeholder="联系方式的备注信息，用于助记，超过30个字符将被截断"
        />
      </a-form-item>
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
  import { watch, reactive, ref, PropType } from 'vue';
  import {
    FieldRule,
    Message,
    RequestOption,
    UploadRequest,
  } from '@arco-design/web-vue';
  import uploadMediaImages from '@/utils/media-resource';
  import {
    createQrcode,
    CreateQrcodeRequest,
    editQrcode,
  } from '@/api/scrm/enterprise-qr';

  const prop = defineProps({
    usersList: {
      type: Array as PropType<any>,
      default: () => {
        return [];
      },
    },
    editData: {
      type: Object as PropType<any>,
      default: () => {
        return [];
      },
    },
  });

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const apiUrl = import.meta.env.VITE_API_API_URL;

  const formRef = ref();
  const qrcodeUrl = import.meta.env.VITE_BASE_QRCODE_URL;
  const formModel = ref({
    qid: '',
    name: '',
    desc: '',
    owner: [],
    RealQrcodeLink: '',
    sceneLink: qrcodeUrl,
    expiryDate: '',
  } as CreateQrcodeRequest);
  const rules = {
    name: [
      { required: true, message: '请输入图文标题' },
      { max: 128, message: '图文标题称长度不能超过 128 个字符' },
    ],
    desc: [
      { required: true, message: '请输入图文描述' },
      { max: 512, message: '图文图文描述长度不能超过 512 个字符' },
    ],
    url: [{ required: true, message: '请输入跳转链接' }],
    expiryDate: [{ required: true, message: '请选择活码过期时间' }],
    RealQrcodeLink: [{ required: true, message: '请选择消息图片' }],
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
      formModel.value.RealQrcodeLink = apiUrl + data.url;
    });
  };
  const handlereset = () => {
    formModel.value.owner = [];
    formModel.value.RealQrcodeLink = '';
    state.coverUrlList = [];
    formRef.value.resetFields();
  };

  const changeCoverImage = async () => {
    // formModel.value.coverImageId = 0;
    return true;
  };

  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }
    const err = await formRef.value.validate();
    if (err) {
      return;
    }
    const formModelData = formModel.value;
    if (formModel.value.expiryDate) {
      const date: any = new Date(formModel.value.expiryDate);
      formModelData.expiryDate = Date.parse(date);
    }
    state.submitLoading = true;
    if (formModelData.qid) {
      editQrcode(
        {
          ...formModelData,
        },
        formModelData.qid,
      )
        .then(() => {
          handlereset();
          Message.success('群活码编辑成功');
          emits('submitSuccess');
        })
        .catch(() => {
          emits('submitFailed');
        })
        .finally(() => {
          state.submitLoading = false;
        });
    } else {
      createQrcode({
        ...formModelData,
      })
        .then(() => {
          handlereset();
          Message.success('群活码创建成功');
          emits('submitSuccess');
        })
        .catch(() => {
          emits('submitFailed');
        })
        .finally(() => {
          state.submitLoading = false;
        });
    }
  };
  watch(
    () => prop.editData,
    () => {
      if (prop.editData && prop.editData.qid) {
        const editData = JSON.parse(JSON.stringify(prop.editData));
        delete editData.state;
        formModel.value = editData;
        state.coverUrlList = [
          {
            url: prop.editData.RealQrcodeLink,
          },
        ];
      } else {
        formModel.value.qid = '';
        handlereset();
        // 获取当前日期
        const currentDate = new Date();
        // 将当前日期向后加7天
        currentDate.setDate(currentDate.getDate() + 7);
        // 获取新日期
        const newDate = Date.parse(currentDate.toDateString());
        formModel.value.expiryDate = newDate;
      }
    },
  );
</script>
