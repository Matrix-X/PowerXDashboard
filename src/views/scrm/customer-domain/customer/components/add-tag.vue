<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item>
        <div class="tag-list" style="width: 100%">
          <div
            v-for="(params, index) in groupTagList.list"
            :key="index"
            style="width: 100%; margin: 8px 0"
          >
            <div class="title">
              {{ params.groupName }}
            </div>
            <div>
              <span v-for="(item, idx) in params.tags" :key="idx">
                <a-tag
                  v-if="item.name && item.name != ' '"
                  checkable
                  style="margin: 6px 8px"
                  color="arcoblue"
                  :checked="item.checked"
                  @check="(checked) => (item.checked = checked)"
                  >{{ item.name }}</a-tag
                >
              </span>
            </div>
          </div>
        </div>
      </a-form-item>
      <a-divider />
      <!-- <a-form-item label="应用" field="name">
        <a-input v-model="formModel.name"  placeholder="请输入选择应用"/>
      </a-form-item> -->
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
  import { watch, reactive, ref, PropType, onMounted } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import {
    customerTag,
    CustomerTagList,
    getGroupTagList,
  } from '@/api/scrm/tag';

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
  interface TagItem {
    tagId: never;
    checked?: boolean;
    tagName?: string;
  }
  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);
  const formRef = ref();
  const tagIds = ref([]);
  const formModel = ref({
    userId: '',
    externalUserId: '',
    addTag: [],
    removeTag: [],
  } as CustomerTagList);

  const groupTagList = reactive<any>({
    list: [],
  });

  const rules = {
    name: [
      { required: true, message: '请输入标签名称' },
      { max: 50, message: '签名称长度不能超过 50 个字符' },
    ],
    sort: [{ required: true, message: '请输入排序' }],
  } as Record<string, FieldRule[]>;

  const state = reactive({
    coverUrlList: [] as Array<any>,
    detailUrlList: [] as Array<any>,
    submitLoading: false,
  });
  const handlereset = () => {
    formRef.value.resetFields();
  };
  async function fetchGroupTagList() {
    const res = await getGroupTagList({
      pageIndex: 1,
      pageSize: 30,
    });
    try {
      groupTagList.list = res.data.list.map((data) => {
        if (data.tags && data.tags.length > 0) {
          data.tags.forEach((params: TagItem) => {
            if (tagIds.value.includes(params.tagId)) {
              params.checked = true;
            } else {
              params.checked = false;
            }
          });
        }
        return data;
      });
    } catch (err) {
      groupTagList.list = [];
    }
  }

  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }
    const addTag: any = [];
    const removeTag: string[] = [];
    interface TagParams {
      tagId: never;
      checked: boolean;
      tags: [];
    }
    groupTagList.list.forEach((data: TagParams) => {
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((params: TagItem) => {
          if (params.checked) {
            addTag.push(params.tagId);
          }
          if (!addTag.includes(params.tagId)) {
            removeTag.push(params.tagId);
          }
        });
      }
    });
    if (addTag && addTag.length === 0) {
      Message.error('请选择要添加的标签');
    } else {
      formModel.value.addTag = addTag;
      formModel.value.removeTag = removeTag;
      state.submitLoading = true;
      customerTag({
        ...formModel.value,
      })
        .then(() => {
          handlereset();
          Message.success('添加成功');
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
  onMounted(async () => {
    await fetchGroupTagList();
  });
  watch(
    () => prop.editData,
    () => {
      if (prop.editData && prop.editData.externalUserId) {
        const editData = JSON.parse(JSON.stringify(prop.editData));
        formModel.value.userId = editData.userId;
        formModel.value.externalUserId = editData.externalUserId;
        tagIds.value = editData.tags;
        fetchGroupTagList();
      }
    },
    { deep: true },
  );
</script>

<style scope lang="less">
  .tag-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .arco-tag {
    background: rgba(242, 243, 245, 1);
  }
  .title {
    color: #222222;
    font-size: 14px;
    font-weight: 500;
    position: relative;
    padding-left: 6px;
    margin-bottom: 12px;
    &::after {
      position: absolute;
      width: 2px;
      height: 16px;
      background: rgb(22, 93, 255);
      content: '';
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
