import request from '@/utils/request';
/**
 * 获取公司分页数据
 *
 * @param queryParams
 */
 export function listCompanyPages(
    queryParams?: any
  ) {
    return request({
      url: '/auth/role',
      method: 'get',
      params: queryParams,
    });
  }
  
  /**
   * 获取公司详情
   *
   * @param id
   */
  export function getCompanyFormDetail(id: number){
    return request({
      url: `/auth/role/${id}`,
      method: 'get',
    });
  }
  /**
   * 修改公司状态
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
   * 获取公司权限列表
   *
   * @param id
   */
   export function getCompanyPermissions(id: number){
    return request({
      url: `/auth/role/${id}/auth`,
      method: 'get',
    });
  }
  /**
   * 修改
   *
   * @param data
   */
   export function editCompany(id:any, data: object) {
    return request({
      url: `/auth/role/${id}/auth`,
      method: 'post',
      data: data,
    });
  }
  /**
   * 添加公司
   *
   * @param data
   */
  export function addCompany(data: object) {
    return request({
      url: '/auth/role',
      method: 'post',
      data: data,
    });
  }
  
  /**
   * 更新公司
   *
   * @param id
   * @param data
   */
  export function updateCompany(id: number, data: object) {
    return request({
      url: `/auth/role/${id} `,
      method: 'post',
      data: data,
    });
  }
  
  /**
   * 删除公司
   *
   * @param ids
   */
  export function deleteCompanys(id: number) {
    return request({
      url: `/auth/role/${id}/delete`,
      method: 'post',
    });
  }