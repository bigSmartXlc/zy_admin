/**
 * 登录表单类型声明
 */
export interface LoginFormData {
  name: string;
  auth_password: string;
  code: string;
}

/**
 * 登录响应类型声明
 */
export interface LoginResponseData {
  token: string;
  user: {
    id:number
  };
}

/**
 * 验证码类型声明
 */
export interface Captcha {
  img: string;
  uuid: string;
}
