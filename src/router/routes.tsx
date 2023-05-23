import { lazy } from 'react';
import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import {
  generateRoutes,
  getLayoutRoutes,
  getNoLayoutRoutes
} from './router.helper';
import type { IconType } from '@/components/Icons';
import config from '@/config';
import type { MergeExclusive, SetOptional } from 'type-fest';
import UserList from '@/pages/system/user';
import Login from '@/pages/login/Login';

type CustomRoute = Omit<BaseMenuItem, 'key' | 'name' | 'icon'> & {
  layoutRender?: false;
};

interface BaseMenuItem {
  // 菜单key 同时也是菜单path
  key: string;
  // 菜单名称 同时也是面包屑名称
  name: string;
  icon?: IconType;
  auth?: true;
  path: string;
  // 页面组件地址，基于pages文件夹下
  component: string;
}

interface NoStateMenuItem extends BaseMenuItem {
  menuRender: false;
  // 当打开一个非菜单页面（也就是页面的menuRender为false）想让菜单的某一项高亮，那么把此属性设为高亮菜单页面的key。
  parentKey?: string;
}

type MenuItemRoute = MergeExclusive<BaseMenuItem, NoStateMenuItem>;

type MenuFoldRoute = SetOptional<
  Omit<MenuItemRoute, 'component' | 'layoutRender' | 'parentKey' | 'auth'>,
  'path'
> & {
  children: Array<MergeExclusive<MenuItemRoute, MenuFoldRoute>>;
};

export type MenuRoute = MergeExclusive<MenuItemRoute, MenuFoldRoute>;

export type IRoute = MergeExclusive<CustomRoute, MenuRoute>;

const ErrorPage = lazy(() => import('@/components/ErrorBoundary'));
const Layout = lazy(() => import('@/components/Layout'));
const NotFound = lazy(() => import('@/pages/404'));

// 获取localstroage中的菜单配置
const user = JSON.parse(localStorage.getItem('persist:user') || '{}');
const menuItems = user.menuItems ? JSON.parse(user.menuItems) : [];
export const layoutRoutesConfig = config.isRenderServerMenu ? menuItems : config.routes;
// console.log("layoutRoutesConfig:", layoutRoutesConfig)
const noLayoutRoutesConfig = getNoLayoutRoutes(config.routes);

export default createHashRouter(
  [
    {
      errorElement: <ErrorPage />,
      element: <Layout />,
      children: generateRoutes(layoutRoutesConfig)
    },
    {
      errorElement: <ErrorPage />,
      children: generateRoutes(noLayoutRoutesConfig)
    },
    {
      path: '*',
      element: <NotFound />
    },
    {
      path: '/',
      element: <UserList />
    }, {
      path: '/login',
      element: <Login />
    }
  ],
  {
    basename: import.meta.env.BASE_URL
  }
);
