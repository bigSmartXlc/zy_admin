import request from '@/utils/request';
/*
    获取报表数据
*/
export function getAdReport(data:any){
    return request({
        url: `/marketlink/report/oceanengine/ad`,
        method: 'get',
        params: data,
      });
}

/*
    广告主维度
*/
export function getAdvertiserReport(data:any){
    return request({
        url: `/marketlink/report/oceanengine/advertiser`,
        method: 'get',
        params: data,
      });
}

/*
    获取日期维度报表数据
*/
export function getReportByDate(data:any){
    return request({
        url: `/marketlink/report/oceanengine/date`,
        method: 'get',
        params: data,
      });
}

/*
    修改投放状态
*/
export function setPlanStatus(ttad:any,data:any){
    return request({
        url: `/marketlink/account/oceanengine/major/ttad/${ttad}/op`,
        method: 'post',
        data: data,
      });
}

/*
    获取实时数据
*/
export function gethourlyReport(ttad:any,data:any){
    return request({
        url: `/marketlink/report/oceanengine/ad/${ttad}/hourly`,
        method: 'get',
        params: data,
      });
}

/*
    获取计划数据
*/
export function getPlanReport(data:any){
    return request({
        url: `/marketlink/report/oceanengine/ad`,
        method: 'get',
        params: data,
      });
}

/*
    获取首页数据
*/
export function getIndexData(data:any){
    return request({
        url: `/`,
        method: 'get',
        params: data,
      });
}