import { PermissionState } from '@/types/store/permission';
import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { constantRoutes } from '@/router';
import { listRoutes } from '@/api/system/menu';

const modules = import.meta.glob('../../views/**/**.vue');
export const Layout = () => import('@/layout/index.vue');
export const module_404 = () => import('@/views/error-page/404.vue');

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  // if (route.meta && route.meta.roles) {
    if (roles.includes('ROOT')) {
      return true;
    }
    return roles.some((role) => {
      if (route.meta?.roles !== undefined) {
        return (route.meta.roles as string[]).includes(role);
      }
    });
  // }
  // return false;
};

export const filterAsyncRoutes = (
  routes: RouteRecordRaw[],
  roles: string[]
) => {
  const res: RouteRecordRaw[] = [];
  routes.sort(function(a:any, b:any) { return a.order - b.order })
  routes.forEach((route,index) => {
    const tmp = { ...route } as any;
    const item:any = {
        id:tmp.id||999+index,
        order:tmp.order||999+index,
        path:tmp.route,
        component: Layout,
        name: tmp.name,
        meta: { title: tmp.name, icon: tmp.route == ''?'homepage':'', affix: false ,hidden:tmp.display==false},
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.route == ''||!tmp.display) {
        item.path = '/'
        item.component = Layout;
      } else {
        // item.path = '/'+tmp.route
        const component = modules[`../../views/${tmp.route}/index.vue`] as any;
        if (component) {
          item.component = component;
        } else {
          item.component = module_404
        }
      }
      res.push(item);
      if (tmp.sub) {
        item.children = filterAsyncRoutes(tmp.sub, roles);
      }
    }
  });
  return res;
};

const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionState => ({
    isRoute:false,
    routes: [],
    addRoutes: [],
  }),
  actions: {

    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
      this.isRoute = true
    },
    generateRoutes(roles: string[]) {
      return new Promise((resolve, reject) => {
        listRoutes()
          .then((response) => {
            const asyncRoutes = response.data.nav;
            const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
            this.setRoutes(accessedRoutes);
            resolve(accessedRoutes);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

export default usePermissionStore;
