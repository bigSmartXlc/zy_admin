import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Action } from 'element-plus'
import router from '@/router'
import { localStorage } from '@/utils/storage';
import useStore from '@/store';

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (!config.headers) {
      throw new Error( 
        `Expected 'config' and 'config.headers' not to be undefined`
      );
    }
    const { user } = useStore();
    if (user.token) {
      config.headers.token = `${localStorage.get('token')}`;
      config.headers.USERID = `${localStorage.get('USERID')}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message } = response.data;
    const { user } = useStore();
    let messageTimes = true
    const codeList = [100002, 100003, 100004, 200008]
    if (code === 100000) {
      return response.data;
    }else if (codeList.includes(code) && router.currentRoute.value.path != 'page/login') {
      if (messageTimes === true) {
        messageTimes = false
        ElMessageBox.alert(response.data.message, 'token验证失败', {
          // if you want to disable its autofocus
          // autofocus: false,
          showClose: false,
          confirmButtonText: 'OK',
          callback: (action: Action) => {
            user.resetToken();
            router.push('/pages/login')
          },
        })
      }
      setTimeout(() => {
        messageTimes = true
      }, 5000)
      return false
    } else {
      // 响应数据为二进制流处理(Excel导出)
      if (response.data instanceof ArrayBuffer) {
        return response;
      }
      if(Array.isArray(response.data)){
        return response;
      }
      ElMessage({
        message: message || '系统出错',
        type: 'error'
      });
      return Promise.reject(new Error(message || 'Error'));
    }
  },
  error => {
    const { code, message } = error.response.data;
    if (code === 'A0230') {
      // token 过期
      localStorage.clear(); // 清除浏览器全部缓存
      window.location.href = '/'; // 跳转登录页
      ElMessageBox.alert('当前页面已失效，请重新登录', '提示', {});
    } else {
      ElMessage({
        message: message || '系统出错',
        type: 'error'
      });
    }
    return Promise.reject(new Error(message || 'Error'));
  }
);

// 导出 axios 实例
export default service;
