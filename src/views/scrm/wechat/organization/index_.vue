<template>
  <div
    class="base-content-org"
    style="padding: 20px; width: 100%; height: 500px"
  >
    <w-organization
      :data="data"
      :menu-option="menuOption"
      @department-add="onDepartMentAdd"
      @department-delete="onDepartMentDel"
      @department-edit="onDepartMentEdit"
      @on-menu-click="onMenuClick"
    />

    <Modal
      v-model:visible="visible"
      :footer="false"
      hide-title
      :render-to-body="false"
    >
      <div style="padding: 20px; width: 100%; height: 500px">
        <w-department-user :user-list="userList" />
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Modal } from '@arco-design/web-vue';
  import { WOrganization } from '@yaoyaochi/weyui';

  interface OrganizationData {
    id: number;
    name: string;
    parentid: number;
    [key: string]: any;
  }

  const menuOption = [
    {
      name: '查看成员',
      command: 'viewMember',
    },
    {
      name: 'test成员',
      command: 'viewMember123',
    },
  ] as { name: string; command: string }[];

  const visible = ref(false);

  // 添加部门事件
  const onDepartMentAdd = (data: { parentid: number }) => {
    console.log('新增部门事件：父部门ID', data.parentid);
  };

  // 删除部门事件
  const onDepartMentDel = (data: { id: number }) => {
    console.log('删除部门事件：部门ID', data.id);
  };

  // 编辑部门事件
  const onDepartMentEdit = (data: { id: number }) => {
    console.log('编辑部门事件：部门ID', data.id);
  };

  // 菜单点击事件 返回菜单command 和 节点数据
  const onMenuClick = (command: { command: string; data: any; node: any }) => {
    console.log(command.command);
    if (command.command === 'viewMember') {
      visible.value = true;
    }
  };

  const data = ref<OrganizationData[]>([
    {
      id: 1,
      name: '波动网络信息有限公司',
      name_en: '',
      department_leader: [],
      parentid: 0,
      order: 100000000,
    },
    {
      id: 2,
      name: '行政人事',
      name_en: '',
      department_leader: [],
      parentid: 1,
      order: 100000000,
    },
    {
      id: 3,
      name: '董事',
      name_en: '',
      department_leader: [],
      parentid: 1,
      order: 99999000,
    },
    {
      id: 4,
      name: '总裁室',
      name_en: '',
      department_leader: [],
      parentid: 1,
      order: 99998000,
    },
    {
      id: 5,
      name: '信息发展中心',
      name_en: '',
      department_leader: [],
      parentid: 1,
      order: 99997000,
    },
    {
      id: 6,
      name: '商业信息条线',
      name_en: '',
      department_leader: [],
      parentid: 5,
      order: 100000000,
    },
    {
      id: 7,
      name: '策划部',
      name_en: '',
      department_leader: [],
      parentid: 1,
      order: 99996000,
    },
  ]);

  const userList = ref([
    {
      id: 1,
      avatar:
        'https://moonwife.top/upload/2023/06/src%3Dhttp___c-ssl.duitang.com_uploads_blog_202105_09_20210509012315_89541.thumb.1000_0.jpeg%26refer%3Dhttp___c-ssl.duitang.webp',
      nickName: '@Tim',
      job: 'Creater & Design',
      phone: '188********',
    },
    {
      id: 2,
      avatar: '',
      nickName: 'Tim',
      job: 'Creater & Design',
      phone: '188********',
    },
    {
      id: 3,
      avatar: '',
      nickName: 'Tim',
      job: 'Creater & Design',
      phone: '188********',
    },
    {
      id: 4,
      avatar: '',
      nickName: 'Tim',
      job: 'Creater & Design',
      phone: '188********',
    },
    {
      id: 5,
      avatar: '',
      nickName: 'Tim',
      job: 'Creater & Design',
      phone: '188********',
    },
    {
      id: 6,
      avatar: '',
      nickName: 'Tim',
      job: 'Creater & Design',
      phone: '188********',
    },
    {
      id: 7,
      avatar: '',
      nickName: 'Tim',
      job: 'Creater & Design',
      phone: '188********',
    },
    {
      id: 8,
      avatar: '',
      nickName: 'Tim',
      job: 'Creater & Design',
      phone: '188********',
    },
    {
      id: 9,
      avatar: '',
      nickName: 'Tim',
      job: 'Creater & Design',
      phone: '188********',
    },
    {
      id: 10,
      avatar: '',
      nickName: 'Tim',
      job: 'Creater & Design',
      phone: '188********',
    },
  ] as {
    id: number;
    avatar: string;
    nickName: string;
    job: string;
    phone: string;
  }[]);
</script>

<style scoped lang="scss"></style>

<style lang="scss">
  .base-content-org {
    .arco-modal-container {
      .arco-modal-wrapper {
        .arco-modal {
          width: 1000px;
          .arco-modal-body {
            padding: 0;
          }
        }
      }
    }
  }
</style>
