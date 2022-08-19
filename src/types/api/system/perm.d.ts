import { PageQueryParam, PageResult } from '../base';

/**
 * 权限查询参数类型声明
 */
export interface PermQueryParam extends PageQueryParam {
  search: any;
  search_status: any;
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
export type PermPageResult = PageResult<PermItem[]>;

/**
 * 权限表单类型声明
 */
export interface PermFormData {
  id: number | undefined;
  name: string;
  urlPerm: string;
  btnPerm: string;
  menuId: string;
}
