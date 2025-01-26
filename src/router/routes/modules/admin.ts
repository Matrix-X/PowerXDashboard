import { DEFAULT_LAYOUT, EMPTY_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Admin: AppRouteRecordRaw = {
  path: '/admin',
  name: 'Admin',
  component: DEFAULT_LAYOUT,
  meta: {
    order: 99,
    locale: 'menu.admin',
    requiresAuth: true,
    icon: 'icon-tool',
  },
  children: [
    // user
    {
      path: '/admin/user',
      name: 'User',
      component: EMPTY_LAYOUT,
      redirect: '/admin/user/list',
      meta: {
        icon: 'icon-user',
        locale: 'menu.admin.user',
        requiresAuth: true,
        roles: ['*'],
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: '/admin/user/list',
          name: 'UserList',
          component: () => import('@/views/admin/user/index.vue'),
          meta: {
            locale: 'menu.admin.user',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/admin/user/detail/:id',
          name: 'UserDetail',
          component: () => import('@/views/admin/user/detail/index.vue'),
          meta: {
            locale: 'menu.admin.user.detail',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    // organization
    {
      path: '/admin/organization',
      name: 'Organization',
      component: EMPTY_LAYOUT,
      meta: {
        icon: 'icon-relation',
        locale: 'menu.admin.organization',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/admin/organization/department',
          name: 'OrganizationUser',
          component: EMPTY_LAYOUT,
          redirect: '/admin/organization/department/list',
          meta: {
            locale: 'menu.admin.organization.department',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
          children: [
            {
              path: '/admin/organization/department/list',
              name: 'OrganizationDepartmentList',
              component: () =>
                import('@/views/admin/organization/department/index.vue'),
              meta: {
                locale: 'menu.admin.organization.department.list',
                requiresAuth: true,
                roles: ['*'],
              },
            },
          ],
        },
        // position
        {
          path: '/admin/organization/position',
          name: 'OrganizationPosition',
          component: EMPTY_LAYOUT,
          redirect: '/admin/organization/position/list',
          meta: {
            locale: 'menu.admin.organization.position',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
          children: [
            {
              path: '/admin/organization/position/list',
              name: 'OrganizationPositionList',
              component: () =>
                import('@/views/admin/organization/position/index.vue'),
              meta: {
                locale: 'menu.admin.organization.position.list',
                requiresAuth: true,
                roles: ['*'],
              },
            },
          ],
        },
      ],
    },
    // permission
    {
      path: '/admin/permission',
      name: 'Permission',
      component: EMPTY_LAYOUT,
      redirect: '/admin/permission/role',
      meta: {
        icon: 'icon-safe',
        locale: 'menu.admin.permission',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/admin/permission/role',
          name: 'Role',
          component: () => import('@/views/admin/permission/role/index.vue'),
          meta: {
            locale: 'menu.admin.permission.role',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    // data dictionary
    {
      path: '/admin/dictionary',
      name: 'DataDictionary',
      component: () => import('@/views/admin/dictionary/index.vue'),
      meta: {
        icon: 'icon-book',
        locale: 'menu.admin.dictionary',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default Admin;
