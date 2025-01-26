import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';

import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getMenuList } from '@/api/userinfo';
import { AppState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
  },

  actions: {
    // 更新应用设置
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore
      this.$patch(partial);
    },

    // 切换主题颜色
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    // 切换设备
    toggleDevice(device: string) {
      this.device = device;
    },
    // 切换菜单显示
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    // 获取服务器菜单配置
    async fetchServerMenuConfig() {
      try {
        Notification.info({
          id: 'menuNotice',
          content: '加载中',
          closable: true,
        });
        const { data } = await getMenuList();
        this.serverMenu = data;
        Notification.success({
          id: 'menuNotice',
          content: '成功',
          closable: true,
        });
      } catch (error) {
        Notification.error({
          id: 'menuNotice',
          content: '错误',
          closable: true,
        });
      }
    },
    // 清除服务器菜单
    clearServerMenu() {
      this.serverMenu = [];
    },
  },
});

export default useAppStore;
