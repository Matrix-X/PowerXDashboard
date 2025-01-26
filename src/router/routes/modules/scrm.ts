import { DEFAULT_LAYOUT, EMPTY_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Scrm: AppRouteRecordRaw = {
  path: '/scrm',
  name: 'Scrm',
  component: DEFAULT_LAYOUT,
  meta: {
    order: 3,
    locale: 'menu.scrm',
    requiresAuth: true,
    icon: 'iconfont-icon-qiyeweixin',
  },
  children: [
    {
      path: '/scrm/marketing-acquisition',
      name: 'WeWorkMarketingAcquisition',
      component: EMPTY_LAYOUT,
      meta: {
        icon: 'icon-qrcode',
        locale: 'menu.scrm.marketingAcquisition',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        // enterprise wechat contact way
        {
          path: '/scrm/marketing-acquisition/enterprise-qr',
          name: 'WeWorkEnterpriseQR',
          component: () =>
            import(
              '@/views/scrm/marketing-acquisition/enterprise-qr/index.vue'
            ),
          meta: {
            locale: 'menu.scrm.marketingAcquisition.enterpriseQR',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/marketing-acquisition/group-qr',
          name: 'WeWorkGroupQR',
          component: () =>
            import('@/views/scrm/marketing-acquisition/group-qr/index.vue'),
          meta: {
            locale: 'menu.scrm.marketingAcquisition.groupQR',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },

    // CMS
    {
      path: '/scrm/cms',
      name: 'WeWorkCMS',
      component: EMPTY_LAYOUT,
      meta: {
        icon: 'icon-image',
        locale: 'menu.scrm.cms',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        // enterprise wechat contact way
        {
          path: '/scrm/cms/script-lib',
          name: 'WeWorkScriptLib',
          component: () => import('@/views/scrm/cms/script-lib/index.vue'),
          meta: {
            locale: 'menu.scrm.cms.scriptLib',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/cms/media',
          name: 'WeWorkMedia',
          component: () => import('@/views/scrm/cms/media/index.vue'),
          meta: {
            locale: 'menu.scrm.cms.media',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },

    // customer management
    {
      path: '/scrm/operation',
      name: 'WeWorkOperation',
      component: EMPTY_LAYOUT,
      meta: {
        icon: 'icon-shake',
        locale: 'menu.scrm.operation',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/scrm/operation/group-send',
          name: 'WeWorkGroupSend',
          component: () =>
            import('@/views/scrm/operation/group-send/index.vue'),
          meta: {
            locale: 'menu.scrm.operation.groupSend',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
        },
        {
          path: '/scrm/operation/welcome-script',
          name: 'WeWorkWelcomeScript',
          component: () =>
            import('@/views/scrm/operation/welcome-script/index.vue'),
          meta: {
            locale: 'menu.scrm.operation.welcomeScript',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
        },
        {
          path: '/scrm/operation/moment',
          name: 'WeWorkMoment',
          component: () => import('@/views/scrm/operation/moment/index.vue'),
          meta: {
            locale: 'menu.scrm.operation.moment',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
        },
        {
          path: '/scrm/operation/user-group-send-history',
          name: 'WeWorkUserGroupSendHistory',
          component: () =>
            import('@/views/scrm/operation/user-group-send-history/index.vue'),
          meta: {
            locale: 'menu.scrm.operation.userGroupSendHistory',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
        },
      ],
    },

    // customer management
    {
      path: '/scrm/customer-domain',
      name: 'WeWorkCustomerDomain',
      component: EMPTY_LAYOUT,
      meta: {
        icon: 'icon-user',
        locale: 'menu.scrm.customerDomain',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/scrm/customer-domain/customer',
          name: 'WeWorkCustomer',
          component: EMPTY_LAYOUT,
          redirect: '/scrm/customer-domain/customer/list',
          meta: {
            locale: 'menu.scrm.customerDomain.customer',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
          children: [
            {
              path: '/scrm/customer-domain/customer/list',
              name: 'WeWorkCustomerList',
              component: () =>
                import('@/views/scrm/customer-domain/customer/index.vue'),
              meta: {
                locale: 'menu.scrm.customerDomain.customer',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: '/scrm/customer-domain/customer/detail/:id',
              name: 'WeWorkCustomerDetail',
              component: () =>
                import(
                  '@/views/scrm/customer-domain/customer/detail/index.vue'
                ),
              meta: {
                locale: 'menu.scrm.customerDomain.customer.detail',
                requiresAuth: true,
                roles: ['*'],
              },
            },
          ],
        },
        {
          path: '/scrm/customer-domain/tag',
          name: 'WeWorkTag',
          component: () => import('@/views/scrm/customer-domain/tag/index.vue'),
          meta: {
            locale: 'menu.scrm.customerDomain.tag',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/customer-domain/migrate',
          name: 'WeWorkMigrate',
          component: () =>
            import('@/views/scrm/customer-domain/migrate/index.vue'),
          meta: {
            locale: 'menu.scrm.customerDomain.migrate',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/customer-domain/black-list',
          name: 'WeWorkBlackList',
          component: () =>
            import('@/views/scrm/customer-domain/black-list/index.vue'),
          meta: {
            locale: 'menu.scrm.customerDomain.blackList',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },

    // customer group management
    {
      path: '/scrm/customer-group/',
      name: 'WeWorkCustomerGroup',
      component: EMPTY_LAYOUT,
      meta: {
        icon: 'icon-user-group',
        locale: 'menu.scrm.customerGroup',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/scrm/customer-group/group',
          name: 'WeWorkGroup',
          component: () =>
            import('@/views/scrm/customer-group/group/index.vue'),
          meta: {
            locale: 'menu.scrm.customerGroup.group',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/customer-group/tag',
          name: 'WeWorkGroupTag',
          component: () => import('@/views/scrm/customer-group/tag/index.vue'),
          meta: {
            locale: 'menu.scrm.customerGroup.tag',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },

    // wechat management
    {
      path: '/scrm/wechat',
      name: 'WeWorkWechat',
      component: EMPTY_LAYOUT,
      meta: {
        icon: 'icon-stamp',
        locale: 'menu.scrm.wechat',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/scrm/wechat/organization',
          name: 'WeWorkWechatOrganization',
          // component: () => import('@/views/scrm/wechat/organization/index.vue'),
          component: () =>
            import('@/views/scrm/wechat/organization/index_.vue'),
          meta: {
            locale: 'menu.scrm.wechat.organization',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/wechat/user',
          name: 'WeWorkWechatUser',
          component: () => import('@/views/scrm/wechat/user/index.vue'),
          meta: {
            locale: 'menu.scrm.wechat.users',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/wechat/group',
          name: 'WeWorkWechatGroup',
          component: () => import('@/views/scrm/wechat/group/index.vue'),
          meta: {
            locale: 'menu.scrm.wechat.group',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },

    // app management
    {
      path: '/scrm/app',
      name: 'WeWorkApp',
      component: () => import('@/views/scrm/app/index.vue'),
      meta: {
        icon: 'icon-apps',
        locale: 'menu.scrm.app',
        requiresAuth: true,
        roles: ['*'],
      },
    },

    // session archive
    {
      path: '/scrm/session-archive',
      name: 'WeWorkSessionArchive',
      component: () => import('@/views/scrm/session-archive/index.vue'),
      meta: {
        icon: 'icon-history',
        locale: 'menu.scrm.sessionArchive',
        requiresAuth: true,
        roles: ['*'],
      },
    },

    // smart customer service
    {
      path: '/scrm/smart-cs',
      name: 'WeWorkSmartCS',
      component: () => import('@/views/scrm/smart-cs/index.vue'),
      meta: {
        icon: 'icon-robot',
        locale: 'menu.scrm.smartCS',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default Scrm;
