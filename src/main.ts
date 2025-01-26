import { createApp } from 'vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import WujieVue from 'wujie-vue3';
import { loadPluginRoutes } from '@/router/routes';
import WeyUI from '@yaoyaochi/weyui';
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import App from './App.vue';
import '@yaoyaochi/weyui/style.css';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import '@/api/interceptor';

const app = createApp(App);

app.use(ArcoVueIcon);

app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);
app.use(WujieVue);
app.use(WeyUI);

app.mount('#app');

loadPluginRoutes(router);
