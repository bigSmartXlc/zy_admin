import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {
  UserFormData,
  UserInfo,
} from '@/types/api/system/user';

/**
 * 登录成功后获取账号信息（昵称、头像、权限集合和角色集合）
 * 账号列表 /v3/auth/admin get请求
    新增账号 /v3/auth/admin/create post请求 'name'登录名, 'password'密码, 'confirm'确认密码, 'nickname'账号名, 'organ_id'部门, 'mobile'手机号, 'company_id'公司
    修改账号名 /v3/auth/admin/{admin}/editnickname post请求 nickname
    修改手机号 /v3/auth/admin/{admin}/editmobile post请求 mobile
    修改密码 /v3/auth/admin/{admin}/password/reset post请求 original原密码 new新密码 confirm确认新密码
    删除账号 /v3/auth/admin/{admin}/delete post请求
    启用账号 /v3/auth/admin/{admin}/enable post请求
    禁用账号 /v3/auth/admin/{admin}/disable post请求
    获取账号角色列表 /v3/auth/admin/{admin}/getRoles get请求
    获取组织所有角色列表 /v3/auth/admin/{admin}/getorganrole get请求
 */
export function getUserInfo(): AxiosPromise<UserInfo> {
  return request({
    url: '/youlai-admin/api/v1/users/me',
    method: 'get',
  });
}

/**
 * 获取账号分页列表
 *
 * @param queryParams
 */
export function listUserPages(
  queryParams: any
){
  return request({
    url: '/auth/admin',
    method: 'get',
    params: queryParams,
  });
}



/**
 * 获取公司部门列表
 *
 * @param company_id
 */
 export function getCompanyParts(company_id: number){
  return request({
    url: `/auth/organ/list`,
    method: 'get',
    params:{company:company_id}
  });
}

/**
 * 添加账号
 *
 * @param data
 */
export function addUser(data: any) {
  return request({
    url: '/auth/admin/create',
    method: 'post',
    data: data,
  });
}

/**
 * 修改账号名
 *
 * @param id
 * @param data
 */
export function updateUsername(id: number, data: object) {
  return request({
    url: `/auth/admin/${id}/editnickname`,
    method: 'post',
    data: data,
  });
}

/**
 * 修改手机号
 *
 * @param id
 * @param data
 */
 export function updateUserphone(id: number, data: object) {
  return request({
    url: `/auth/admin/${id}/editmobile`,
    method: 'post',
    data: data,
  });
}
/**
 * 修改账号密码
 *
 * @param id
 * @param data
 */
export function updateUserPass(id: number, data: any) {
  return request({
    url: `/auth/admin/${id}/password/reset`,
    method: 'post',
    data: data,
  });
}

/**
 * 删除账号
 *
 * @param id
 */
export function deleteUsers(id: string) {
  return request({
    url: `/auth/admin/${id}/delete`,
    method: 'post',
  });
}

/**
 * 启用
 *
 * @param id
 */
 export function enableUsers(id: number) {
  return request({
    url: `/auth/admin/${id}/enable`,
    method: 'post',
  });
}

/**
 * 停用账号
 *
 * @param id
 */
 export function disableUsers(id: number) {
  return request({
    url: `/auth/admin/${id}/disable`,
    method: 'post',
  });
}

