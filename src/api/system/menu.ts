import {
  MenuFormData,
  MenuItem,
  MenuQueryParam,
} from '@/types/api/system/menu';
import { Option } from '@/types/common';
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import api from '@/api/apilist'

/**
 * 获取路由列表
 */
export function listRoutes() {
  return request({
    url: api.menu,
    method: 'get',
  });
}

/**
 * 获取菜单表格列表
 *
 * @param queryParams
 */
export function listMenus(
  queryParams: MenuQueryParam
): AxiosPromise<MenuItem[]> {
  return request({
    url: '/youlai-admin/api/v1/menus',
    method: 'get',
    params: queryParams,
  });
}

/**
 * 获取菜单下拉树形列表
 */
export function listMenuOptions(): AxiosPromise<any> {
  return request({
    url: `/auth/navigator`,
    method: 'get',
  });
}

/**
 * 获取菜单权限树形列表
 */
export function getResource(): AxiosPromise<any> {
  return request({
    url: '/youlai-admin/api/v1/menus/resources',
    method: 'get',
  });
}

/**
 * 获取菜单详情
 * @param id
 */
export function getMenuDetail(id: number): AxiosPromise<MenuFormData> {
  return request({
    url: `/auth/navigator/${id}`,
    method: 'get',
  });
}

/**
 * 添加菜单
 *
 * @param data
 */
export function addMenu(data: any) {
  return request({
    url: '/auth/navigator/create',
    method: 'post',
    data: data,
  });
}

/**
 * 修改菜单
 *
 * @param id
 * @param data
 */
export function updateMenu(id:number,data:any) {
  return request({
    url: `/auth/navigator/${id}`,
    method: 'post',
    data: data,
  });
}

/**
 * 删除菜单
 *
 * @param ids 菜单ID，多个以英文逗号(,)分割
 */
export function deleteMenus(id:number) {
  return request({
    url: `/auth/navigator/${id}/delete`,
    method: 'post',
  });
}

/*
  停用启用菜单
*/
export function banMenu(id:number){
  return request({
    url: `/auth/navigator/${id}/ban`,
    method: 'post'
  })
}
export function unbanMenu(id:number){
  return request({
    url: `/auth/navigator/${id}/unban`,
    method: 'post'
  })
}

/*
  菜单拖拽排序
*/
export function dragMenu(data:any){
  return request({
    url:`/auth/navigator/sort`,
    data:data,
    method:'post'
  })
}
