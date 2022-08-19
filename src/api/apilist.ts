/**
 * author: xlc20220317
 * desc: api管理/common/nav
 */
// 导出 excel 文件
export default {
    // 获取登录验证码
    smsCode:'/login/sms-code',
    // 登录
    login:'/login/name',
    // 获取菜单
    menu:'/common/nav',
    // 首页
    v3:'',
    // 游戏发行列表
    cpsgames:'/cps/game',
    // 申请分发
    gameCreated:'/cps/game/create',
    // 我的下级代理
    agent:'/cps/game/agent',
    // 我的游戏
    mygames:'/cps/spkg',
    // 用户列表
    userlist:'/cps/user',
    // 订单列表
    orderlist:'/cps/order',
    // 数据概览
    stats:'/cps/stats/stats',
    // 渠道概览
    channel:'/cps/stats/channels',
    // 个人中心
    own:'/cps/own',
    // 个人中心-修改密码
    passwordChange:'/cps/own/password/change',
    // 我的下级代理-代充
    charge:'/cps/game/agent/coin/charge',
    // 撤回代充(测试接口)
    refund:'/cps/game/agent/coin/charge/refund',
    // 我的下级代理-新增代理
    addAgent:'/cps/game/agent/cpscreate',
    // 用户代充，获取平台币列表
    coinList:'/cps/coin/list',
    // 用户代充，生成订单
    coinOrder:'/cps/coin/generate',
    // 平台币流水管理- 流水表   get请求
    coinflowlist:'/cps/coin/flow/list',
    // 平台币流水管理-撤回  post请求
    chargeRefund:'/cps/coin/charge/refund',
    // 平台币流水管理-代充界面显示    get请求
    coingamelist:'/cps/coin/charge/show',
    // 平台币流水管理-代充   post请求
    chargeUnion:'/cps/coin/charge/union',
    // 扶持申请查询
    support:'/cps/support',
    // 扶持申请查询
    supportCreate:'/cps/support/create',
    // 权限列表
    permission:'/auth/permission',
    // 刷新权限
    permission_refresh:'/auth/permission/refresh'
  }
  
  