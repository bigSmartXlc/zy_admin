import {
  RoleFormData,
  RolePageResult,
  RoleQueryParam,
  RoleResourceData,
} from '@/types/api/system/role';

import { Option } from '@/types/common';
import request from '@/utils/request';
import { AxiosPromise } from 'axios';

/**
 * 获取角色分页数据
 *
 * @param queryParams
 */
export function listRolePages(
  queryParams?: any
): AxiosPromise {
  return request({
    url: '/auth/role',
    method: 'get',
    params: queryParams,
  });
}

/**
 * 获取角色下拉数据
 *
 * @param queryParams
 */
export function listRoleOptions(
  queryParams?: RoleQueryParam
): AxiosPromise<Option[]> {
  return request({
    url: '/youlai-admin/api/v1/roles/options',
    method: 'get',
    params: queryParams,
  });
}

/**
 * 获取角色拥有的资源ID集合
 *
 * @param queryParams
 */
export function getRoleResourceIds(roleId: string): AxiosPromise<any> {
  return request({
    url: '/youlai-admin/api/v1/roles/' + roleId + '/resource_ids',
    method: 'get',
  });
}

/**
 * 修改角色资源权限
 *
 * @param queryParams
 */
export function updateRoleResource(
  roleId: string,
  data: RoleResourceData
): AxiosPromise<any> {
  return request({
    url: '/youlai-admin/api/v1/roles/' + roleId + '/resources',
    method: 'put',
    data: data,
  });
}

/**
 * 获取角色详情
 *
 * @param id
 */
export function getRoleFormDetail(id: number): AxiosPromise{
  return request({
    url: `/auth/role/${id}`,
    method: 'get',
  });
}
/**
 * 修改角色状态
 *
 * @param data
 */
 export function changestatus(id:number, data: object) {
  return request({
    url: `/auth/role/${id}/changestatus`,
    method: 'post',
    data: data,
  });
}
/**
 * 获取角色权限列表
 *
 * @param id
 */
 export function getRolePermissions(id: number): AxiosPromise{
  return request({
    url: `/auth/role/${id}/auth`,
    method: 'get',
  });
}
/**
 * 修改角色权限
 *
 * @param data
 */
 export function editPermissions(id:any, data: object) {
  return request({
    url: `/auth/role/${id}/auth`,
    method: 'post',
    data: data,
  });
}
/**
 * 添加角色
 *
 * @param data
 */
export function addRole(data: object) {
  return request({
    url: '/auth/role',
    method: 'post',
    data: data,
  });
}

/**
 * 更新角色
 *
 * @param id
 * @param data
 */
export function updateRole(id: number, data: RoleFormData) {
  return request({
    url: `/auth/role/${id} `,
    method: 'post',
    data: data,
  });
}

/**
 * 删除角色
 *
 * @param ids
 */
export function deleteRoles(id: any) {
  return request({
    url: `/auth/role/${id}/delete`,
    method: 'post',
  });
}
