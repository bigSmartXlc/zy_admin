import request from '@/utils/request';
/*
    获取账户列表
*/
export function getMajorList(data:any){
    return request({
        url: `/marketlink/account/oceanengine/major/list`,
        method: 'get',
        params: data,
      });
}

/*
    新增巨量账户
*/
export function createAccount(){
    return request({
        url: `/marketlink/account/oceanengine/create`,
        method: 'post'
      });
}

/*
    删除巨量账户
*/
export function destoryAccount(major_ids:any){
    return request({
        url: `/marketlink/account/oceanengine/major/destroy`,
        method: 'post',
        data:{major_ids}
      });
}

/*
    同步子账号
*/
export function refreshAccount(adaccount:any){
    return request({
        url: `/marketlink/account/oceanengine/major/${adaccount}/refresh-account`,
        method: 'post'
      });
}

/*
---------------------------------广告主-------------------------
*/
/*
    广告主列表
*/
export function getSonAccount(data:any){
    return request({
        url: `/marketlink/account/oceanengine/major/son/list`,
        method: 'get',
        params: data,
      });
}

/*
    余额刷新
*/

export function refreshFund(sonadaccount:any){
    return request({
        url: `/marketlink/account/oceanengine/major/son/${sonadaccount}/refresh-fund`,
        method: 'post'
      });
}
/*
    查看日流水
*/
export function getDayFlow(id:any,data:any){
    return request({
        url: `/marketlink/account/oceanengine/major/son/${id}/fund/daily`,
        method: 'get',
        params: data,
      });
}