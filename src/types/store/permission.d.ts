/**
 * 权限类型声明
 */
 export interface PermissionState {
  isRoute:boolean;
  routes: RouteRecordRaw[];
  addRoutes: RouteRecordRaw[];
}
