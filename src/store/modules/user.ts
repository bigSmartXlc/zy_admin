import { defineStore } from 'pinia';
import { LoginFormData } from '@/types/api/system/login';
import { UserState } from '@/types/store/user';

import { localStorage } from '@/utils/storage';
import { login, logout } from '@/api/login';
import { getUserInfo } from '@/api/system/user';
import { resetRouter } from '@/router';

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: localStorage.get('token') || '',
    nickname: '',
    avatar: '',
    roles: [],
    perms: [],
  }),
  actions: {
    async RESET_STATE() {
      console.log(this);
      this.$reset();
    },
    /**
     * 登录
     */
    login(loginData: LoginFormData) {
      const { name, auth_password, code} = loginData;
      return new Promise((resolve, reject) => {
        login({
          name: name.trim(),
          auth_password: auth_password,
          code: code,
        })
          .then((response) => {
            localStorage.set('token', response.data.token);
            localStorage.set('USERID', response.data.user.id);
            this.token = response.data.token;
            resolve(response.data.token);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    /**
     *  获取用户信息（昵称、头像、角色集合、权限集合）
     */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(({ data }) => {
            if (!data) {
              return reject('Verification failed, please Login again.');
            }
            const { nickname, avatar, roles, perms } = data;
            if (!roles || roles.length <= 0) {
              reject('getUserInfo: roles must be a non-null array!');
            }
            this.nickname = nickname;
            this.avatar = avatar;
            this.roles = roles;
            this.perms = perms;
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    /**
     *  注销
     */
    logout() {
      return new Promise((resolve, reject) => {
        // logout()
        //   .then(() => {
            localStorage.remove('token');
            localStorage.remove('USERID');
            this.RESET_STATE();
            resetRouter();
            resolve(null);
          // })
          // .catch((error) => {
          //   reject(error);
          // });
      });
    },

    /**
     * 清除 Token
     */
    resetToken() {
      return new Promise((resolve) => {
        localStorage.remove('token');
        localStorage.remove('USERID');
        this.RESET_STATE();
        resolve(null);
      });
    },
  },
});

export default useUserStore;
