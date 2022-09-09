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
      url: '/auth/company',
      method: 'get',
      params: queryParams,
    });
  }
  
  /**
   * 获取公司详情
   *
   * @param id
   */
  export function getCompanyFormDetail(id: any){
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
   export function changestatus(id:any, data: object) {
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
   export function getCompanyPermissions(id: any){
    return request({
      url: `/auth/role/${id}/auth`,
      method: 'get',
    });
  }
  /**
   * 添加公司
   *
   * @param data
   */
  export function addCompany(data: object) {
    return request({
      url: '/auth/company/create',
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
  export function updateCompany(id: any, data: object) {
    return request({
      url: `/auth/company/${id}  `,
      method: 'post',
      data: data,
    });
  }
  
  /**
   * 删除公司
   *
   * @param ids
   */
  export function deleteCompanys(id: any) {
    return request({
      url: `/auth/company/${id}/delete`,
      method: 'post',
    });
  }

  /*
    绑定上级公司
  */
 export function bingCompany(id:any,data:object){
  return request({
    url:`/auth/company/${id}/bind`,
    method: 'post',
    data: data,
  })
 }
/*-----------------------------详情页-----------------------------*/
 /*
  获取公司组织架构
 */
export function getCompanySys(id:any){
  return request({
    url:`/auth/company/${id}/organ`,
    method:'get'
  })
}

/*
  组织列表创建
*/
export function createOrgan(data:object){
  return request({
    url:`/auth/organ`,
    data:data,
    method:'post'
  })
}
/*
  删除组织
*/
export function deleteOrgan(id:any,data:object){
  return request({
    url:`/auth/organ/${id}/delete`,
    method:'post',
    data
  })
}
/*
  获取组织对应角色列表
*/
export function getOrganRole(data:object){
  return request({
    url:`/auth/organ/roles`,
    method:'get',
    data
  })
}

/*
  获取组织对应员工列表
*/
export function getOrganUser(data:object){
  return request({
    url:`/auth/organ/admins`,
    method:'get',
    data
  })
}
/*
  给组织添加角色
*/
export function addOrganRole(id:any,data:object){
  return request({
    url:`/auth/organ/${id}/addrole`,
    method:'put',
    data
  })
}

/*
  删除组织角色
*/
export function deleteOrganRole(id:any,data:object){
  return request({
    url:`/auth/organ/${id}/removerole`,
    method:'put',
    data
  })
}
/*
  给组织添加员工
*/
export function addOrganUser(id:any,data:object){
  return request({
    url:`/auth/organ/${id}/addemployee`,
    method:'put',
    data
  })
}
/*
  删除组织员工
*/
export function deleteOrganUser(id:any,data:object){
  return request({
    url:`/auth/organ/${id}/removeemployee`,
    method:'put',
    data
  })
}