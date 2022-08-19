import {
  Captcha,
  LoginFormData,
  LoginResponseData,
} from '@/types/api/system/login';
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import api from '@/api/apilist'

/**
 * 登录
 * @param data
 */
export function login(data: LoginFormData): AxiosPromise<LoginResponseData> {
  return request({
    url: api.login,
    method: 'post',
    params: data,
  });
}

/**
 * 注销
 */
export function logout() {
  return request({
    url: '/youlai-auth/oauth/logout',
    method: 'delete',
  });
}

/**
 * 获取图片验证码
 */
export function getCaptcha(): AxiosPromise<Captcha> {
  return request({
    url: '/captcha?t=' + new Date().getTime().toString(),
    method: 'get',
  });
}

/**
 * 获取手机验证码
 */
 export function getPhoneCode(data: object): AxiosPromise<Captcha> {
  return request({
    url: '/login/sms-code',
    params:data,
    method: 'post',
  });
}
