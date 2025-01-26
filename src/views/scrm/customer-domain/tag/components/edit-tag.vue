<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="标签名称">
        <div style="width: 100%">
          <div style="display: flex; align-items: center">
            <a-input
              v-model="tagName"
              max-length="50"
              placeholder="请输入标签名称"
            />
            <a-button type="primary" @click="handleAddTag">
              <template #icon>
                <icon-plus />
              </template>
            </a-button>
          </div>
          <div v-if="tagList && tagList.length > 0" style="margin: 16px 0">
            <template v-for="(item, index) in tagList" :key="index">
              <span v-if="item && item.tagName != ' '">
                <a-tag style="margin: 6px 8px" color="arcoblue">
                  {{ item.tagName }}
                  <a-popconfirm
                    content="确定要删除当前标签？"
                    type="warning"
                    @ok="handleTagClose(index)"
                  >
                    <span v-if="type === 2 || !item.tagId" class="close"
                      ><icon-close
                    /></span>
                  </a-popconfirm>
                </a-tag>
              </span>
            </template>
          </div>
        </div>
      </a-form-item>

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
  import { watch, reactive, ref, PropType } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import { editTag, EditTagRequest } from '@/api/scrm/tag';

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
  const formRef = ref();
  const type = ref(1);
  const tagName = ref('');
  interface TagList {
    tagName: string;
    tagId?: string;
  }
  type TagType = {
    name: string;
    tagId: string;
  };
  const removetagIds = ref([] as TagList[]);
  const tagList = ref([] as TagList[]);
  const tagListCopy = ref([] as TagList[]);
  const formModel = ref({
    groupId: '',
    tags: [],
  } as EditTagRequest);

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
    tagList.value = tagListCopy.value;
    removetagIds.value = [];
    tagName.value = '';
  };
  const handleAddTag = () => {
    if (tagName.value) {
      let flag = false;
      flag = tagList.value.some((item) => item.tagName === tagName.value);

      if (!flag) {
        tagList.value.push({
          tagName: tagName.value,
        });
        tagName.value = '';
      } else {
        Message.error('标签不能相同');
      }
    } else {
      Message.error('请输入标签名称');
    }
  };
  const handleTagClose = (index: number) => {
    const arr = tagList.value.splice(index, 1);
    removetagIds.value = [...removetagIds.value, ...arr];
  };
  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }
    state.submitLoading = true;

    const addTag = tagList.value.filter((res) => {
      return !res.tagId;
    });
    const newRemovetagIds = removetagIds.value.filter((res) => {
      return res.tagId;
    });
    formModel.value.tags = [...addTag, ...newRemovetagIds];
    editTag({
      ...formModel.value,
    })
      .then(() => {
        handlereset();
        Message.success('标签编辑成功');
        emits('submitSuccess');
        state.submitLoading = false;
      })
      .catch(() => {
        state.submitLoading = false;
        emits('submitFailed');
      })
      .finally(() => {
        state.submitLoading = false;
      });
  };
  watch(
    () => prop.editData,
    () => {
      if (prop.editData && prop.editData.groupId) {
        const editData = JSON.parse(JSON.stringify(prop.editData));
        type.value = editData.type;
        formModel.value.groupId = editData.groupId;
        tagList.value = editData.tags.map((res: TagType) => {
          return {
            tagName: res.name,
            tagId: res.tagId,
          };
        });
        tagListCopy.value = JSON.parse(JSON.stringify(tagList.value));
      }
    },
    { deep: true },
  );
</script>
