import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import useStore from '@/store';

export const Layout = () => import('@/layout/index.vue');

// 参数说明: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
// 静态路由
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'homepage', affix: true }
      },
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        meta: { hidden: true }
      },
      // {
      //   path: 'admin/cps/game',
      //   name: 'cpsgame',
      //   component: () => import('@/views/admin/cps/game/index.vue'),
      //   meta: { title: 'cpsgame', icon: 'homepage', affix: true }
      // },
      // {
      //   path: 'admin/cps/spkg',
      //   name: 'spkg',
      //   component: () => import('@/views/admin/cps/spkg/index.vue'),
      //   meta: { title: 'spkg', icon: 'homepage', affix: true }
      // },
      // {
      //   path: '/admin/cps/game/agent',
      //   name: 'agent  ',
      //   component: () => import('@/views/admin/cps/agent'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // {
      //   path: '/admin/cps/user',
      //   name: 'cpsUser',
      //   component: () => import('@/views/admin/cps/user'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // {
      //   path: '/admin/cps/user/details/:id',
      //   name: 'cpsUserDetail',
      //   component: () => import('@/views/admin/cps/user/details.vue'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },

      // {
      //   path: '/admin/cps/order',
      //   name: 'cpsorder',
      //   component: () => import('@/views/admin/cps/order'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // {
      //   path: '/admin/cps/stats',
      //   name: 'cpsStats',
      //   component: () => import('@/views/admin/cps/stats'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // {
      //   path: '/admin/cps/stats/channel',
      //   name: 'cpsChannelStats',
      //   component: () => import('@/views/admin/cps/channel'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // {
      //   path: '/admin/cash/game',
      //   name: 'cashGame',
      //   component: () => import('@/views/admin/cps/cash'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // {
      //   path: '/admin/cps/own',
      //   name: 'cpsOwn',
      //   component: () => import('@/views/admin/cps/own'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // {
      //   path: '/admin/cps/notice',
      //   name: 'notice',
      //   component: () => import('@/views/admin/cps/notice'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // {
      //   path: '/admin/cps/coin',
      //   name: 'coin',
      //   component: () => import('@/views/admin/cps/coin'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // // 平台币充值
      // {
      //   path: '/admin/coin/list',
      //   name: 'coin',
      //   component: () => import('@/views/admin/cps/coin'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // // 扶持申请
      // {
      //   path: '/admin/support',
      //   name: 'support',
      //   component: () => import('@/views/admin/cps/support'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // // 充值记录
      // {
      //   path: '/admin/coin/flow/list',
      //   name: 'chargeRecord',
      //   component: () => import('@/views/admin/cps/chargeRecord'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // // 用户&&下级代理代充
      // {
      //   path: '/admin/coin/charge/show',
      //   name: 'charge',
      //   component: () => import('@/views/admin/cps/charge'),
      //   meta: {
      //     rule: 'editor'
      //   }
      // },
      // {
      //   path: '/',
      //   redirect: '/dashboard/analytics'
      // },
      // {
      //   path: '/dashboard/analytics',
      //   name: 'dashboardAnalytics',
      //   component: () => import('@/views/DashboardAnalytics.vue'),
        
      // }
    ]
  }

  // 外部链接
  /*{
        path: '/external-link',
        component: Layout,
        children: [
            {
                path: 'https://www.cnblogs.com/haoxianrui/',
                meta: { title: '外部链接', icon: 'link' }
            }
        ]
    }*/
  // 多级嵌套路由
  /* {
         path: '/nested',
         component: Layout,
         redirect: '/nested/level1/level2',
         name: 'Nested',
         meta: {title: '多级菜单', icon: 'nested'},
         children: [
             {
                 path: 'level1',
                 component: () => import('@/views/nested/level1/index.vue'),
                 name: 'Level1',
                 meta: {title: '菜单一级'},
                 redirect: '/nested/level1/level2',
                 children: [
                     {
                         path: 'level2',
                         component: () => import('@/views/nested/level1/level2/index.vue'),
                         name: 'Level2',
                         meta: {title: '菜单二级'},
                         redirect: '/nested/level1/level2/level3',
                         children: [
                             {
                                 path: 'level3-1',
                                 component: () => import('@/views/nested/level1/level2/level3/index1.vue'),
                                 name: 'Level3-1',
                                 meta: {title: '菜单三级-1'}
                             },
                             {
                                 path: 'level3-2',
                                 component: () => import('@/views/nested/level1/level2/level3/index2.vue'),
                                 name: 'Level3-2',
                                 meta: {title: '菜单三级-2'}
                             }
                         ]
                     }
                 ]
             },
         ]
     }*/
];

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
});

// 重置路由
export function resetRouter() {
  const { permission } = useStore();
  permission.routes.forEach(route => {
    const name = route.name;
    if (name && router.hasRoute(name)) {
      router.removeRoute(name);
    }
  });
}

export default router;
