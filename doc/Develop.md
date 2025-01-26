## PowerX 前端开发
[Arco Vue Pro](https://arco.design/vue/docs/pro)  
[Arco Design Vue](https://arco.design/vue)  
[Arco Design Theme](https://arco.design/themes)  
[Arco Design Material](https://arco.design/material)
### 创建页面组件
create src/views/home/index.vue  
views下的目录对应模块, views模块目录主要有几种类型文件组成
- index.vue: 页面
- components/*.vue: 组件
- local/*.ts: 国际化配置文件

#### 页面
```
<template>
    <div class="container">
        // todo code
    </div>
</template>

<script lang="ts" setup>
    // todo vue3 setup code
</script>

<script lang="ts">
    export default {
        name: "Home"
    }
</script>

<style scoped>
    // todo css code
</style>
```

#### 组件
自由发挥

#### 国际化配置
以.../zh-CN为例
```
export default {
    "key1.key2": "locale value",
    // or
    key1: {
        key2: "locale value"
    }
}
```

### 创建路由文件
create src/routes/modules/home.ts  
配置项请参照[Route Config](https://arco.design/vue/docs/pro/routes-and-menu)
```
// 第一级Route是模块层级
const Home: AppRouteRecordRaw = {
  path: '/home',
  name: 'Home',
  // 第一级为模块使用DEFAULT_LAYOUT
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.home',
    requiresAuth: true,
    icon: 'icon-dashboard',
  },
  children: [
    {
      path: '/Home/index',
      name: 'HomeIndex',
      // 子级Route组件会被嵌入到PageLayout, 即内容区域
      component: () => import('@/views/home/index.vue'),
      meta: {
        locale: 'menu.admin.user',
        // 登录态
        requiresAuth: true,
        // 路由所需角色, ['*']允许所有角色
        roles: ['*'],
      },
    }
  ],
};
```
