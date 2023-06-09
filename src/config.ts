/**
 * 手动配置文件
 */
import type { IRoute } from '@/router/routes';

export type MenuItem = {
  name: string;
  key: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}
const routes: IRoute[] = [
  {
    path: 'login',
    component: 'login/Login',
    layoutRender: false
  },
  {
    auth: true,
    path: '/',
    component: 'dashboard',
    name: 'Dashboard',
    key: '/',
    icon: 'DashboardOutlined'
  },
  {
    path: 'form',
    name: '表单页',
    key: 'form',
    icon: 'FormOutlined',
    children: [
      {
        auth: true,
        path: 'basic-form',
        component: 'form/basic-form',
        name: '基础表单',
        key: 'form/basic-form'
      },
      {
        auth: true,
        path: 'step-form',
        component: 'form/step-form',
        name: '分布表单',
        key: 'form/step-form'
      }
    ]
  },
  {
    path: 'list',
    name: '列表页',
    key: 'list',
    icon: 'TableOutlined',
    children: [
      {
        auth: true,
        path: 'search',
        component: 'list/search',
        name: '搜索列表',
        key: 'list/search'
      },
      {
        auth: true,
        path: 'table-list',
        component: 'list/table-list',
        name: '查询列表',
        key: 'list/table-list'
        // menuRender: false
      }
    ]
  },
  {
    path: 'profile',
    name: '详情页',
    key: 'profile',
    icon: 'ProfileOutlined',
    children: [
      {
        auth: true,
        path: 'basic',
        component: 'profile/basic',
        name: '基础详情页',
        key: 'profile/basic'
      },
      {
        auth: true,
        path: 'advanced',
        component: 'profile/advanced',
        name: '高级详情页',
        key: 'profile/advanced'
      }
    ]
  },
  {
    path: 'result',
    name: '结果页',
    key: 'result',
    icon: 'CheckCircleOutlined',
    children: [
      {
        auth: true,
        path: 'success',
        component: 'result/success',
        name: '成功页',
        key: 'result/success'
      },
      {
        auth: true,
        path: 'fail',
        component: 'result/fail',
        name: '失败页',
        key: 'result/fail'
      }
    ]
  },
  {
    path: 'setting',
    name: '系统设置',
    key: 'setting',
    icon: 'SettingOutlined',
    children: [
      {
        auth: true,
        path: 'my-info',
        component: 'my-info',
        name: '我的信息',
        key: 'setting/my-info'
      },
      {
        auth: true,
        path: 'change-password',
        component: 'change-password',
        name: '修改密码',
        key: 'setting/change-password'
      }
    ]
  },
  // {
  //   path: 'test',
  //   component: 'test',
  //   menuRender: false,
  //   parentKey: 'result/success'
  // }
  {
    // path: 'more-level-menu',
    // menuRender: false,
    name: '多级菜单',
    key: 'more-level-menu',
    icon: 'UnorderedListOutlined',
    children: [
      {
        name: '二级菜单',
        key: 'two-level',
        children: [
          {
            name: '三级菜单',
            key: 'three-level',
            icon: 'SettingOutlined',
            children: [
              {
                path: 'test',
                component: 'test',
                name: '四级菜单',
                key: 'test'
                // menuRender: false,
                // parentKey: 'setting/my-info'
              }
            ]
          }
        ]
      }
    ]
  }
];

const config = {
  // 应用信息
  app: {
    name: '后台管理系统'
  },
  // 请求配置
  api: {
    baseUrl:
      // 'http://localhost:8080', // 本地开发环境
      'https://nxefcm-nqnntx-8080.preview.myide.io',
    timeout: 30000,
    sessionKey: 'Authorization',
    status: {
      // 与后台约定可能返回的状态码（不是http的响应状态码）
      200: '请求成功',
      401: '未授权，请重新登录',
      403: '拒绝访问',
      404: '请求错误，未找到该资源',
      408: '请求超时',
      500: '服务器发生错误',
      501: '服务未实现',
      502: '网络错误',
      503: '服务不可用',
      504: '网络超时',
      505: 'HTTP版本不受支持'
    }
  },
  pageSize: 20, // 每页多少条数据
  themeColors: [
    '#1677ff',
    '#ee3f4d',
    '#c08eaf',
    '#95509f',
    '#722ed1',
    '#00b96b',
    '#7cb305',
    '#13c2c2',
    '#d6a01d'
  ],
  // 路由 & 菜单 & 面包屑 配置
  isRenderServerMenu: true, // 是否使用服务端菜单数据
  routes
};

export default config;
