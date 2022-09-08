<template>
  <div class="login-container">
    <el-row :gutter="10" class="login_class">
      <el-col :sm="12" class="hidden-xs-only login_col login_logo">
        <img src="@/assets/images/41.png" alt="" srcset="" style="width: 70%;">
      </el-col>
      <el-col :xs="24" :sm="12" class="login_col">
        <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">{{ $t('login.title') }}</h3>
          <lang-select class="set-language" />
        </div>
  
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.name"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
  
        <el-tooltip
          :disabled="capslockTooltipDisabled"
          content="Caps lock is On"
          placement="right"
        >
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              ref="passwordRef"
              :key="passwordType"
              v-model="loginForm.auth_password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup="checkCapslock"
              @blur="capslockTooltipDisabled = true"
              @keyup.enter="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
        </el-tooltip>
  
        <!-- 验证码 -->
        <el-form-item prop="code">
          <span class="svg-container">
            <svg-icon icon-class="valid_code" />
          </span>
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            :placeholder="$t('login.code')"
            style="width: 65%"
            @keyup.enter="handleLogin"
          >
          </el-input>
          <span class="getCode">
          <el-button 
          type="primary"
          :loading="getCode_loading"
           @click="handleCaptchaGenerate"
           :disabled='codetime>0'
          >{{codetime<=0?'获取验证码':codetime+'s'}}</el-button>
        </span>
  
          <!-- <div class="captcha">
            <img
              :src="captchaBase64"
              height="38px"
            />
          </div> -->
        </el-form-item>
  
        <el-button
          size="default"
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.prevent="handleLogin"
          >{{ $t('login.login') }}
        </el-button>
  
        <!-- <div class="tips">
          <span style="margin-right: 20px"
            >{{ $t('login.username') }}: admin</span
          >
          <span> {{ $t('login.password') }}: 123456</span>
        </div> -->
        </el-form>
      </el-col>
    </el-row>
    <div v-if="showCopyright == true" class="copyright">
      <p>{{ $t('login.copyright') }}</p>
      <p>{{ $t('login.icp') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'element-plus/theme-chalk/display.css'
import { onMounted, reactive, ref, toRefs, watch, nextTick } from 'vue';
import { Search } from '@element-plus/icons-vue'
// 组件依赖
import { ElForm, ElInput } from 'element-plus';
import router from '@/router';
import { ElMessage } from 'element-plus';
import { localStorage } from '@/utils/storage';
import LangSelect from '@/components/LangSelect/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';

// 状态管理依赖
import useStore from '@/store';

// API依赖
import { getPhoneCode } from '@/api/login';
import { useRoute } from 'vue-router';
import { LoginFormData } from '@/types/api/system/login';
import { log } from 'console';

const { user } = useStore();
const route = useRoute();

const loginFormRef = ref(ElForm);
const passwordRef = ref(ElInput);

const state = reactive({
  codetime:0,
  redirect: '/',
  loginForm: {
    name: 'admin',
    auth_password: '123456',
    code: '',
    uuid: '',
  } as LoginFormData,
  loginRules: {
    code:[{ required: true, trigger: 'blur' }],
    name: [{ required: true, trigger: 'blur' }],
    auth_password: [
      { required: true, trigger: 'blur', validator: validatePassword },
    ],
  },
  loading: false,
  getCode_loading:false,
  passwordType: 'password',
  captchaBase64: '',
  // 大写提示禁用
  capslockTooltipDisabled: true,
  otherQuery: {},
  clientHeight: document.documentElement.clientHeight,
  showCopyright: true,
});

function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error('The password can not be less than 6 digits'));
  } else {
    callback();
  }
}
const {
  codetime,
  loginForm,
  loginRules,
  loading,
  getCode_loading,
  passwordType,
  captchaBase64,
  capslockTooltipDisabled,
  showCopyright,
} = toRefs(state);

function checkCapslock(e: any) {
  const { key } = e;
  state.capslockTooltipDisabled =
    key && key.length === 1 && key >= 'A' && key <= 'Z';
}

function showPwd() {
  if (state.passwordType === 'password') {
    state.passwordType = '';
  } else {
    state.passwordType = 'password';
  }
  nextTick(() => {
    passwordRef.value.focus();
  });
}

function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      user
        .login(state.loginForm)
        .then(() => {
          router.push({ path:'/', query: state.otherQuery });
          state.loading = false;
        })
        .catch(() => {
          state.loading = false;
        });
    } else {
      return false;
    }
  });
}
// 获取验证码
function handleCaptchaGenerate() {
  const {name,auth_password} = state.loginForm
  getPhoneCode({
     name: name,
    auth_password: auth_password
  }).then((res)=>{
    console.log(res);
     ElMessage({
        message: '发送成功',
        type: 'success'
      });
      timechange(60)
  })
  // getCaptcha().then(({ data }) => {
  //   const { img, uuid } = data;
  //   state.captchaBase64 = img;
  //   state.loginForm.uuid = uuid;
  // });
}
// 倒计时
function timechange(val:number){
  codetime.value=val?val:60
 const timer=setInterval(()=>{
    if(codetime.value==0){
      localStorage.set('codetime',0)
      clearInterval(timer)
      return
    }
    codetime.value--
    localStorage.set('codetime',codetime.value)
  },1000)
}
watch(
  route,
  () => {
    const query = route.query;
    if (query) {
      state.redirect = query.redirect as string;
      state.otherQuery = getOtherQuery(query);
    }
  },
  {
    immediate: true,
  }
);

function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}

onMounted(() => {
  // handleCaptchaGenerate();
  codetime.value = localStorage.get('codetime')||0
  if(codetime.value!=0){
    timechange(codetime.value)
  }
  window.onresize = () => {
    if (state.clientHeight > document.documentElement.clientHeight) {
      state.showCopyright = false;
    } else {
      state.showCopyright = true;
    }
  };
});
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #000;
$cursor: #fff;

/* reset element-ui css */
.login-container {
  .login_class{
    height: 100vh;
    .login_col{
      padding-top: 20vh;
      box-sizing: border-box;
    }
    .login_logo{
      background-image:linear-gradient(45deg, #fa5000, #00bcd4) ;
    }
  }
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .el-input {
    display: inline-block;
    height: 36px;
    width: 85%;
    .el-input__wrapper {
      width: 80%;
      padding: 0;
      background: transparent;
      box-shadow: none;
      .el-input__inner {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        color: $light_gray;
        height: 36px;
        caret-color: $cursor;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-input__inner {
    &:hover {
      border-color: var(--el-input-hover-border, var(--el-border-color-hover));
      box-shadow: none;
    }

    box-shadow: none;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .copyright {
    width: 100%;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    text-align: center;
    color: #cccccc;
  }
}
</style>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #000;
$light_gray: #000;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  text-align: center;
  // padding-top: 20vh;
  box-sizing: border-box;
  .login-form {
    display: inline-block;
    width: 90%;
    max-width: 520px;
    position: relative;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 5px 10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .getCode{
     position: absolute;
    right: 10px;
    top: 4px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .captcha {
    position: absolute;
    right: 0;
    top: 0;

    img {
      height: 42px;
      cursor: pointer;
      vertical-align: middle;
    }
  }
}
</style>
