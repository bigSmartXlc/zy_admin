import request from '@/utils/request';
/*
    获取报表数据
*/
export function getOrderTb(data:any){
    return request({
        url: `/order/tb`,
        method: 'get',
        params: data,
      });
}
