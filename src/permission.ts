import router from '@/router';
import { ElMessage } from 'element-plus';
import { localStorage } from '@/utils/storage';
import useStore from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false }); // 进度环显示/隐藏

// 白名单路由
const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const { user, permission } = useStore();
  const hasToken = user.token;
  if (hasToken) {
     const roles = ['ROOT'];
    // 登录成功，跳转到首页
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      if(!permission.isRoute){
        const accessRoutes: any = await permission.generateRoutes(roles);
        accessRoutes.forEach((route: any) => {
          router.addRoute(route);
        });
      }
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name as any }) : next('/401');
        } else {
          next();
        }
      // const hasGetUserInfo = user.roles.length > 0;

      // const hasGetUserInfo = true;
      // if (hasGetUserInfo) {
      // } else {
      //   try {
      //     // await user.getUserInfo();
      //     const roles = user.roles;
      //     // const accessRoutes: any = await permission.generateRoutes(roles);
      //     // accessRoutes.forEach((route: any) => {
      //     //   router.addRoute(route);
      //     // });
      //     // next({ ...to, replace: true });
      //   } catch (error) {
      //     // 移除 token 并跳转登录页
      //     // await user.resetToken();
      //     // next(`/login?redirect=${to.path}`);
      //     // ElMessage.error((error as any) || 'Has Error');
      //     NProgress.done();
      //   }
      // }
    }
  } else {
    // 未登录可以访问白名单页面(登录页面)
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
