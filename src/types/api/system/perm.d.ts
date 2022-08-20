import { PageQueryParam, PageResult } from '../base';

/**
 * 权限查询参数类型声明
 */
export interface PermQueryParam {
  search: string;
  search_status: any;
  search_cate_id
}

/**
 * 权限分页列表项声明
 */
export interface PermItem {
  currentPage: number;
  data: [];
  total: number;
}

/**
 * 权限分页项类型声明
 */

/**
 * 权限表单类型声明
 */
export interface PermFormData {
  id: number | undefined;
  description: string;
  check_cate: string;
  auth_permission_cate_id: string|undefined;
  auth_permission_cate_name: string;
  status: number;
  routeCategory,
  routeAction,
  permissionCategory,
  routeUri,
}
