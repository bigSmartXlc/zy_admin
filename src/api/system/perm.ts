import {
  PermFormData,
  PermItem,
  PermQueryParam,
} from '@/types/api/system/perm';
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import api from '@/api/apilist'


/**
 * 获取权限分页列表
 *
 * @param queryParams
 */
export function listPermPages(
  queryParams: any
) {
  return request({
    url: api.permission,
    method: 'get',
    params: queryParams,
  });
}
/**
 * 刷新权限列表
 *
 */

export function permissionsRefresh(){
  return request({
    url: api.permission_refresh,
    method: 'post',
  });
}
/**
 * 获取权限列表
 *
 * @param queryParams
 */
export function listPerms(
  queryParams: PermQueryParam
): AxiosPromise<PermItem[]> {
  return request({
    url: '/youlai-admin/api/v1/permissions',
    method: 'get',
    params: queryParams,
  });
}

/**
 * 获取权限详情
 *
 * @param id
 */
export function getPermFormDetail(permission: number): AxiosPromise<PermFormData> {
  return request({
    url: `/auth/permission/${permission}`,
    method: 'get',
  });
}

/**
 * 添加权限
 *
 * @param data
 */
export function addPerm(data: PermFormData) {
  return request({
    url: '/youlai-admin/api/v1/permissions',
    method: 'post',
    data: data,
  });
}

/**
 * 修改权限
 *
 * @param id
 * @param data
 */
export function updatePerm(permission: number, data: PermFormData) {
  return request({
    url: `/auth/permission/${permission}`,
    method: 'post',
    data: data,
  });
}

/**
 * 删除权限，多个以英文逗号(,)分割
 *
 * @param ids
 */
export function deletePerms(permission: string) {
  return request({
    url: `/auth/permission/${permission}/delete`,
    method: 'post',
  });
}


/*
  启用停用权限
*/
export function swich_permission(permission: string) {
  return request({
    url: `/auth/permission/${permission}/changestatus`,
    method: 'post',
  });
}