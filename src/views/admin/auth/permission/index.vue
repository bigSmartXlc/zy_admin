<script setup lang="ts">
import {
  onMounted,
  watch,
  reactive,
  ref,
  getCurrentInstance,
  toRefs,
} from 'vue';

import {
  listPermPages,
  permissionsRefresh,
  getPermFormDetail,
  addPerm,
  updatePerm,
  deletePerms,
  swich_permission
} from '@/api/system/perm';
import { Search, Plus, Edit, Refresh, Delete,View } from '@element-plus/icons-vue';

import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { Dialog, Option } from '@/types/common';

import {
  PermFormData,
  PermItem,
} from '@/types/api/system/perm';
const { proxy }: any = getCurrentInstance();

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);
const state = reactive({
  loading: true,
  // 选中ID数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  queryParams: {
    search_cate_id:'',
    search_status:'',
    search:'',
    pageNum: 1,
    pageSize: 10,
  },
  permList: [] as PermItem[],
  total: 0,
  dialog: {
    visible: false,
  } as Dialog,
  formData: {} as PermFormData,
  rules: {
    description: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    permissionCategory: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    routeCategory: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    routeUri: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    routeAction: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    status: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
  },
  microServiceOptions: [] as Option[],
  requestMethodOptions: [
    {label:'启用',value:1},
    {label:'禁用',value:0}
  ],
  cateSelect:{},
  urlPerm: {
    requestMethod: '',
    serviceName: '',
    requestPath: '',
  },
});

const {
  loading,
  multiple,
  permList,
  total,
  dialog,
  formData,
  rules,
  requestMethodOptions,
  cateSelect,
  queryParams,
} = toRefs(state);
watch(
  state.queryParams,
  (val) => {
   console.log(val);
   handleQuery()
  },
  {
    //初始化立即执行
    deep: true
  }
);
// 刷新权限列表
function handleRef(){
  state.loading = true;
    permissionsRefresh().then(({ data }) => {
      handleQuery()
    });
}
// 查询
function handleQuery() {
    state.loading = true;
    listPermPages(state.queryParams).then((res) => {
      var data = res.data
      var listjson = JSON.parse(JSON.stringify(data.list.data) )
      state.permList = listjson;
      state.total = data.list.total;
      state.loading = false;
      state.cateSelect = data.cateSelect
    });
}
//重置
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}
//查看
function getView(row:any){
    const {id} = row
  getPermFormDetail(id).then((res)=>{
const {auth_permission_cate_id,id,routeAction,routeCategory,routeUri,status} = res.data
  state.formData = {
    id: id,
    routeCategory,
    routeUri,
    routeAction,
    description: '',
    check_cate: 'create',
    permissionCategory:"",
    auth_permission_cate_id,
    auth_permission_cate_name: '',
    status: status
  };
     state.dialog = {
    title:'查看权限',
    visible:true
  }
  })

}
//编辑
function handleUpdate(row: any) {
  state.dialog = {
    title: '修改权限',
    visible: true,
  };
  const {id,permissionName,permissionCategory,routeCategory,routeUri,routeAction,status} = row
  state.formData = {
    id: id,
    routeCategory,
    permissionCategory,
    routeUri,
    routeAction,
    description: permissionName,
    check_cate: cateSelect.value!={}?'select':'create',
    auth_permission_cate_id: '',
    auth_permission_cate_name: '',
    status: status
  };
}

function submitForm() {
  dataFormRef.value.validate((isValid: any) => {
    if (isValid) {
      if (state.formData.id) {
        updatePerm(state.formData.id, state.formData).then((data) => {
          ElMessage.success('修改成功');
          cancel();
          handleQuery();
        });
      } else {
        addPerm(state.formData).then(() => {
          ElMessage.success('新增成功');
          cancel();
          handleQuery();
        });
      }
    }
  });
}

/**
 * 重置表单
 */
function resetForm() {
  dataFormRef.value.resetFields();

  state.urlPerm = {
    requestMethod: '',
    serviceName: '',
    requestPath: '',
  };
}

function cancel() {
  resetForm();
  state.dialog.visible = false;
}

function handleDelete(row: any) {
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deletePerms(row.id).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}
function handleStatusChange(row:any){
  swich_permission(row.id).then(()=>{
    handleQuery();
  })
}
onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div claas="component-container">
    <!-- 搜索表单 -->
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-form-item>
        <el-button
          type="info"
          :icon="Refresh"
          @click="handleRef"
          >刷新</el-button
        >
        <!-- <el-button
          type="success"
          :icon="Plus"
          @click="handleAdd"
          >新增</el-button
        >
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        > -->
      </el-form-item>
      <el-form-item prop="search_cate_id">
        <el-select
          v-model="queryParams.search_cate_id"
          placeholder="分类"
          clearable
        >
          <el-option
            v-for="(value,  key) in cateSelect"
              :key="value"
              :value="key"
              :label="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="search_status">
        <el-select
          v-model="queryParams.search_status"
          placeholder="状态"
          clearable
        >
          <el-option
          v-for="item in requestMethodOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="search">
        <el-input
          v-model="queryParams.search"
          placeholder="权限名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      :data="permList"
      v-loading="loading"
      border
    >
      <el-table-column label="权限名称" prop="permissionName" width="150" />
      <el-table-column label="权限分类" prop="permissionCategory" width="150" />
      <el-table-column label="路由" prop="routeCategory"/>
      <el-table-column label="URL" prop="routeUri" />
      <el-table-column label="请求方式" prop="routeAction" width="150" />
      <el-table-column label="状态" prop="status" width="150">
          <template #default="scope">
            <!-- <span>{{scope.row.status==1?'启用':'停用'}}</span> -->
            <el-switch
              v-model="scope.row.status"
                  :inactive-value="0"
                  :active-value="1"
                  @change="handleStatusChange(scope.row)"
            />
          </template>  
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template #default="scope">
           <el-button
            type="info"
            :icon="View"
            circle
            plain
            @click="getView(scope.row)"
          />
          <el-button
            type="primary"
            :icon="Edit"
            circle
            plain
            @click="handleUpdate(scope.row)"
          />
          <el-button
            type="danger"
            :icon="Delete"
            circle
            plain
            @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页工具条 -->
    <pagination
      v-if="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="handleQuery"
    />

    <!-- 表单弹窗 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" custom-class="width_class">
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="description">
          <el-input v-model="formData.description" placeholder="请输入权限名称" :disabled="dialog.title=='查看权限'"/>
        </el-form-item>
        <el-form-item label="路由" prop="routeCategory">
          <el-input v-model="formData.routeCategory" :disabled="dialog.title!='添加权限'" />
        </el-form-item>
        <el-form-item label="URL" prop="routeUri">
          <el-input v-model="formData.routeUri"  :disabled="dialog.title!='添加权限'" />
        </el-form-item>
        <el-form-item label="请求方式" prop="routeAction">
          <el-input v-model="formData.routeAction" placeholder="请输入权限名称"  :disabled="dialog.title!='添加权限'"/>
        </el-form-item>
        <el-form-item label="权限类型" prop="check_cate">
           <el-radio-group v-if="dialog.title!='查看权限'" v-model="formData.check_cate">
            <el-radio
                  label="select">
                  <el-select
                    v-model="formData.auth_permission_cate_id"
                    placeholder="选择类型"
                    clearable
                  >
                    <el-option
                      v-for="(value,  key) in cateSelect"
                      :key="value"
                      :value="key"
                      :label="value"
                    />
                  </el-select>
            </el-radio>
            <el-radio
                  label="create">
                  <el-input v-model="formData.auth_permission_cate_name" placeholder="请输入权限类型名称" />
            </el-radio>
          </el-radio-group>
          <el-select
            v-else
            v-model="formData.auth_permission_cate_id"
            placeholder="分类"
            disabled
          >
            <el-option
              v-for="(value,key) in cateSelect"
              :key="value"
              :value="key"
              :label="value"
            />
            </el-select>
          <!-- <el-input v-else v-model="formData.permissionCategory" disabled /> -->
        </el-form-item>
        <el-form-item label="状态" prop="status">
           <el-radio-group v-model="formData.status" :disabled="dialog.title=='查看权限'">
            <el-radio  v-for="item in requestMethodOptions"
                  :key="item.label"
                  :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer" v-show="dialog.title!='查看权限'">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.component-container {
  box-sizing: border-box;
}
</style>
