<script setup lang="ts">
import {
  onMounted,
  reactive,
  ref,
  toRefs,
} from 'vue';

import {
  listRolePages,
  getRoleFormDetail,
  getRolePermissions,
  editPermissions,
  addRole,
  updateRole,
  deleteRoles,
  changestatus
} from '@/api/system/role';
import { Open, TurnOff,Search, Plus, Edit, Refresh, Delete,View } from '@element-plus/icons-vue';

import { ElForm, ElMessage, ElMessageBox,ElTree } from 'element-plus';
import { Dialog, Option } from '@/types/common';

import {
  PermItem,
} from '@/types/api/system/perm';
const treeRef = ref<InstanceType<typeof ElTree>>()
const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);
const layout = 'total, prev, pager, next'
const state = reactive({
  loading: true,
  tree_loading:false,
  // 选中ID数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  queryParams: {
    search_status:'',
    search:'',
    page: 1,
    pageSize: 15,
  },
  permList: [] as PermItem[],
  total: 0,
  dialog: {
    visible: false,
  } as Dialog,
   shouquan: {
    visible: false,
  } as Dialog,
  formData: {
    id:'',
    name:'',
    description:'',
    status:1,
  } as any,
  rules: {
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  },
  microServiceOptions: [] as Option[],
  requestMethodOptions: [
    {label:'启用',value:1},
    {label:'禁用',value:0}
  ],
  cateSelect:{},
  edit_permission_selected_row:{} as any,
});
const defaultProps = {
  children: 'permissions',
  label: 'description',
}
const tree_data = ref([])
const {
  loading,
  tree_loading,
  permList,
  total,
  dialog,
  shouquan,
  formData,
  rules,
  requestMethodOptions,
  queryParams,
} = toRefs(state);
//权限查询
function handelShouquan(row:any){
    state.tree_loading = true
    state.edit_permission_selected_row = row
    state.shouquan={
            title:'权限管理',
            visible: true
        }
    getRolePermissions(row.id).then((res)=>{
        treeRef.value!.setCheckedKeys(res.data, false)
            state.tree_loading = false
    })
}
//修改权限
function setCheckedKeys(){
    editPermissions(state.edit_permission_selected_row.id,{permission_ids:treeRef.value!.getCheckedKeys(true)}).then(res=>{
        ElMessage.success('授权成功')
        state.shouquan={
            title:'',
            visible: false
        }
    })
}
// 新增角色
function addrole(){
     state.dialog = {
    title:'新增角色',
    visible:true
  }
}
// 查询
function handleQuery() {
    state.loading = true;
    listRolePages(state.queryParams).then((res) => {
      var data = res.data
      var listjson = JSON.parse(JSON.stringify(data.list.data) )
      state.permList = listjson;
      state.total = data.list.total;
      state.loading = false;
      data.authSelect.map((item:any)=>{
        if(item.description==undefined){
            item.description = item.name
        }
      })
      tree_data.value = data.authSelect
    });
}
//查询重置
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

//编辑
function editRole(row: any) {
    state.dialog = {
        title: '修改角色',
        visible: true,
     };
  getRoleFormDetail(row.id).then(res=>{
      const {id,description,name,status} = res.data
      state.formData = {
        id,description,name,status
      };
  })
}
//修改角色状态
function switchStatus(id:number, status:number){
    changestatus(id,{status:status}).then((res)=>{
        ElMessage.success('修改状态成功');
        handleQuery();
    })
}
//新增修改
function submitForm() {
  dataFormRef.value.validate((isValid: any) => {
    if (isValid) {
      if (state.formData.id) {
        updateRole(state.formData.id, state.formData).then((res) => {
          ElMessage.success('修改成功');
          cancel();
          handleQuery();
        });
      } else {
        addRole(state.formData).then(() => {
          ElMessage.success('新增成功');
          cancel();
          handleQuery();
        });
      }
    }
  });
}

/**
 * 编辑新增重置表单
 */
function resetForm() {
  dataFormRef.value.resetFields();
}

function cancel() {
  resetForm();
  state.dialog.visible = false;
}

function handleDelete(row: any) {
  ElMessageBox.confirm('确认删除已选中的角色?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteRoles(row.id).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
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
          type="success"
          :icon="Plus"
          @click="addrole"
          >新增角色</el-button
        >
      </el-form-item>
      <el-form-item prop="search_status">
        <el-select
          v-model="queryParams.search_status"
          placeholder="状态"
          @change="handleQuery"
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
          placeholder="角色名称"
          clearable
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
      <el-table-column label="角色名称" prop="name"  />
      <el-table-column label="角色描述" prop="description"  />
      <el-table-column label="角色渠道" prop="companyName"  />
      <!-- <el-table-column label="状态" prop="status" >
          <template #default="scope">
            <span>{{scope.row.status==1?'启用':'停用'}}</span>
            <el-switch
              v-model="scope.row.status"
                  :inactive-value="0"
                  :active-value="1"
                  @change="handleStatusChange(scope.row)"
            />
          </template>  
      </el-table-column> -->
      <el-table-column label="操作" align="left">
        <template #default="scope">
             <el-button
                type="primary"
                :icon="Edit"
                 size="small"
                @click="editRole(scope.row)"
            >编辑</el-button>
             <el-button
                v-show="scope.row.status==1"
                type="warning"
                :icon="TurnOff"
                 size="small"
                @click="switchStatus(scope.row.id,0)"
            >禁用</el-button>
             <el-button
                v-show="scope.row.status!=1"
                type="success"
                :icon="Open"
                 size="small"
                @click="switchStatus(scope.row.id,1)"
            >启用</el-button>
             <el-button
                type="danger"
                 size="small"
                :icon="Delete"
                @click="handleDelete(scope.row)"
            >删除</el-button>
             <el-button
                type="info"
                :icon="Plus"
                 size="small"
                @click="handelShouquan(scope.row)"
            >功能授权</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页工具条 -->
    <pagination
      v-if="total > 0"
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.pageSize"
      :layout="layout"
      :page-sizes="[15,30,50,100]"
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>
         <el-form-item label="角色描述" prop="description">
          <el-input v-model="formData.description" placeholder="" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
           <el-radio-group v-model="formData.status" >
            <el-radio  v-for="item in requestMethodOptions"
                  :key="item.label"
                  :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
        <!-- 表单弹窗 -->
    <el-dialog :title="shouquan.title" v-model="shouquan.visible" custom-class="width_class">
        <el-tree
            ref="treeRef"
            :data="tree_data"
            show-checkbox
            default-expand-all
            node-key="id"
            v-loading="tree_loading"
            highlight-current
            :props="defaultProps"
        />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="setCheckedKeys">确 定</el-button>
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
