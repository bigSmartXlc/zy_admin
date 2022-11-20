import request from '@/utils/request';
/*
    获取商品列表
*/
export function getProductList(data:any){
    return request({
        url: `/marketlink/product/list`,
        method: 'get',
        params: data,
      });
}


/*
    新增商品列表
    tb_product_name 商品名 
    tb_product_id 商品id 
    mini_name 小程序
*/
export function createProductList(data:any){
    return request({
        url: `/marketlink/product/create`,
        method: 'post',
        data: data
      });
}

/*
    修改商品列表
    tb_product_name 商品名 
    tb_product_id 商品id 
    mini_name 小程序
*/
export function editProductList(product:any,data:any){
    return request({
        url: `/marketlink/product/${product}/update`,
        method: 'post',
        data: data
      });
}

/*
    删除商品
*/
export function destroyProductList(product:any){
    return request({
        url: `/marketlink/product/${product}/destroy`,
        method: 'post'
      });
}