<template>
  <div>
    <div>
      <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8"
      >   
          <dv-border-box-9 class="border_style">
              <p>部门架构
                  <el-button
                  type="success"
                  :icon="Plus"
                  size="small"
                  @click="handleAdd(0)"
                  >添加组织</el-button>
              </p>
              <div class="tree_style" dv-bg>
                  <el-tree
                      :data="tree_data"
                      default-expand-all
                      :props="defaultProps"
                      :default-expanded-keys="defaultNodekey"
                      :expand-on-click-node="false"
                      :check-on-click-node="true"
                      :check-strictly="true"
                      node-key="id"
                      accordion
                      @node-click="handleNodeClick"
                      class="menu_tree"
                  >
                      <template #default="{ node, data }">
                      <span class="custom-tree-node" :class="data.id==selectNodeData.id?'checkedNode':''">
                          <span>{{ node.label }}</span>
                          <span class="btnlist">
                            <el-tooltip
                              class="box-item"
                              effect="dark"
                              content="添加"
                              placement="top"
                            >
                              <el-button
                                  type="success"
                                  :icon="Plus"
                                  size="small"
                                  circle
                                  plain
                                  @click.stop="handleAdd(data.id)"
                              />
                            </el-tooltip>
                            <el-tooltip
                              class="box-item"
                              effect="dark"
                              content="修改"
                              placement="top"
                            >
                              <el-button
                                  type="primary"
                                  :icon="Edit"
                                  size="small"
                                  circle
                                  plain
                                  @click.stop="handleRename(data.id)"
                              />
                            </el-tooltip>
                            <el-tooltip
                              class="box-item"
                              effect="dark"
                              content="删除"
                              placement="top"
                            >
                              <el-button
                                  type="danger"
                                  :icon="Delete"
                                  size="small"
                                  circle
                                  plain
                                  @click.stop="handleDelete(data.id)"
                              />
                            </el-tooltip>
                            <el-tooltip
                              class="box-item"
                              effect="dark"
                              content="添加员工"
                              placement="top"
                            >
                                  <el-button
                                  type="danger"
                                  :icon="Avatar"
                                  size="small"
                                  circle
                                  plain
                                  @click.stop="handleAddUser({organ_id:data.id},data)"
                              />
                            </el-tooltip>
                            <el-tooltip
                              class="box-item"
                              effect="dark"
                              content="添加角色"
                              placement="top"
                            >
                                  <el-button
                                  type="success"
                                  :icon="User"
                                  size="small"
                                  circle
                                  plain
                                  @click.stop="handleAddRole({organ_id_not_equaled:data.id})"
                              />
                            </el-tooltip>
                          </span>
                          </span>
                      </template>
                  </el-tree>
              </div>
          </dv-border-box-9>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" v-if="selectNodeData.id">
          <dv-border-box-11 title="员工列表" :title-width="250" class="border_style11">
              <div>
                   <el-button
                  type="success"
                  :icon="Plus"
                   size="small"
                  @click="handleAddUser({organ_id_not_equaled:selectNodeData.id},selectNodeData)"
              >添加</el-button>
               <el-button
                  type="danger"
                   size="small"
                  :icon="Delete"
                  :disabled="can_delate_user"
                  @click="handleDeleteUser()"
              >删除</el-button>
                <el-button
                  type="primary"
                  :icon="Edit"
                   size="small"
                   :disabled="can_delate_user"
                  @click="editUserArray()"
              >调组</el-button>
               <el-table
                  ref="multipleTableRef"
                  :data="tableData"
                  @selection-change="handleSelectionChange1"
              >
                  <el-table-column type="selection"/>
                  <el-table-column property="name" label="账号"/>
                  <el-table-column property="nickname" label="用户名"/>
                    <el-table-column label="操作" align="left">
                      <template #default="scope">
                          <el-button
                              type="info"
                              :icon="Plus"
                              size="small"
                              @click="handelUserRole(scope.row)"
                          >角色</el-button>
                      </template>
                  </el-table-column>
              </el-table>
               <!-- 分页工具条 -->
              <pagination
                :total="total"
                v-model:page="queryParams.page"
                v-model:limit="queryParams.pageSize"
                :layout="layout"
                @pagination="getUser(selectNodeData.id)"
              />
              </div>
          </dv-border-box-11>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" v-if="selectNodeData.id">
          <dv-border-box-11 title="角色列表" :title-width="250" class="border_style11">
              <div>
                <el-button
                  type="success"
                  :icon="Plus"
                   size="small"
                  @click="handleAddRole({organ_id_not_equaled:selectNodeData.id})"
              >添加</el-button>
               <el-button
                  type="danger"
                   size="small"
                  :icon="Delete"
                  :disabled="can_delate_role"
                  @click="handleRoleDelete()"
              >删除</el-button>
               <el-table
                  ref="multipleTableRef"
                  :data="role_tabledata"
                  @selection-change="handleSelectionChange"
              >
                  <el-table-column type="selection" />
                  <el-table-column property="name" label="角色名称" />
                  <el-table-column property="description" label="描述"/>
              </el-table>
               <!-- 分页工具条 -->
              <pagination
                :total="total1"
                v-model:page="queryParams1.page"
                v-model:limit="queryParams1.pageSize"
                :layout="layout"
                @pagination="getRole(selectNodeData.id)"
              />
              </div> 
          </dv-border-box-11>
      </el-col>
      </el-row>
    </div>
    <RoleEdit
        :visible="dialog.visible"
        :title="dialog.title"
        :editId="dialog.editId"
        @closeEdit="closeEdit"
        @submit="submit"
      />
  </div>
</template>

<script lang="ts" setup>
import {
  onMounted,
  ref,
} from 'vue';
import {
  reName,
  getCompanySys,
  createOrgan,
  deleteOrgan,
  getOrganUser,
  getOrganRole,
  addOrganRole,
  deleteOrganRole,
  addOrganUser,
  deleteOrganUser
} from '@/api/system/company';
import { Plus, Edit, Delete,Avatar,User } from '@element-plus/icons-vue';
import RoleEdit from './Edit.vue'
import { ElForm,ElMessage, ElMessageBox } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { useRoute} from 'vue-router';
const dialog=ref({
  editId:'',
  visible:false,
  title:''
})
const queryParams=ref({
  page:1,
  pageSize:10
})
const queryParams1=ref({
  page:1,
  pageSize:10
})
const total = ref(0)
const total1 = ref(0)
const layout = 'total, prev, pager, next'
const can_delate_role = ref(true)
const can_delate_user = ref(true)
const multipleSelection_role = ref([])
const multipleSelection_user = ref([])
const tableData =ref([])
const role_tabledata = ref([])
//重命名
function handleRename(id:any){
  ElMessageBox.prompt('请输入组织名', '添加组织', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
    .then(({ value }) => {
      reName(id,value).then(()=>{
        refersh()
        defaultNodekey.value = [id]
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}
//勾选用户
const handleSelectionChange1 = (val:any) => {
  multipleSelection_user.value = val
  if(multipleSelection_user.value.length>0){
    can_delate_user.value=false
  }else{
    can_delate_user.value=true
  }
}
//勾选角色
const handleSelectionChange = (val:any) => {
  multipleSelection_role.value = val
  if(multipleSelection_role.value.length>0){
    can_delate_role.value=false
  }else{
    can_delate_role.value=true
  }
}
//批量删除角色
function handleRoleDelete(){
  ElMessageBox.confirm('确认删除选中的角色吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const role_id = [] as any
      multipleSelection_role.value.forEach((item:any)=>{
        role_id.push(item.id)
      })
      deleteOrganRole(selectNodeData.value.id,{role_id:role_id}).then(res=>{
        ElMessage({
        type: 'warning',
        message: '已删除',
      })
        getRole(selectNodeData.value.id)
      })
    })
    .catch(() => ElMessage.info('已取消删除'));
}
const selectNodeData:any = ref({})
const tree_data: any = ref([])
const defaultNodekey: any = ref([])
const defaultProps = {
  children: 'children',
  label: 'text'
}
const route = useRoute();
onMounted(()=>{
 refersh()
})
//点击节点
const handleNodeClick = (data: any) => {
  selectNodeData.value = data
  getRole(data.id)
  getUser(data.id)
}
//查询组织角色
function getRole(organ_id:any){
  getOrganRole({organ_id}).then(res=>{
    role_tabledata.value=res.data
  })
}
//查询组织员工
function getUser(organ_id:any){
  getOrganUser({organ_id}).then(res=>{
    console.log(res);
    tableData.value=res.data
  })
}
//打开/关闭添加角色弹框
function handleAddRole(data:any){
  dialog.value={
    editId:data,
    visible:true,
    title:'添加角色'
  }
}
//添加员工
function handleAddUser(data:any,select_data:any){
  selectNodeData.value = select_data
  dialog.value={
    editId:data,
    visible:true,
    title:'添加员工'
  }
}
//关闭弹窗
function closeEdit(){
  dialog.value={
    editId:'',
    visible:false,
    title:''
  }
}
//弹框提交
function submit(data:any){
  if(data.type==1){
    addOrganRole(data.organ_id_not_equaled,{role_id:data.role_id}).then(res=>{
      getRole(selectNodeData.value.id)
    })
  }else{
    addOrganUser(data.organ_id_not_equaled,{admin_id:data.admin_id}).then(res=>{
      getUser(selectNodeData.value.id)
    })
  }
  closeEdit()
}
//获取组织
const refersh=()=>{
  getCompanySys(route.query.id).then(res=>{
    tree_data.value = res.data.organs
  })
}
//添加组织
const handleAdd =(pid:number)=>{
   ElMessageBox.prompt('请输入组织名', '添加组织', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
    .then(({ value }) => {
      createOrgan({
        pid,name:value,company_id:route.query.id
      }).then(()=>{
        refersh()
        defaultNodekey.value = [pid]
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}
// 删除
const handleDelete = (id:number) => {
   ElMessageBox.confirm('确认删除当前组织?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
       deleteOrgan(id,{company_id:route.query.id}).then(res=>{
      ElMessage({
        type: 'warning',
        message: '已删除',
      })
      refersh()
  })
    })
    .catch(() => ElMessage.info('已取消删除'));
}

//设置员工角色
function handelUserRole(row:object){
  console.log(row);
  
}
//批量删除员工
function handleDeleteUser(){
  ElMessageBox.confirm('确认删除选中的员工吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const admin_id = [] as any
      multipleSelection_user.value.forEach((item:any)=>{
        admin_id.push(item.id)
      })
      deleteOrganUser(selectNodeData.value.id,{admin_id:admin_id}).then(res=>{
        ElMessage({
        type: 'warning',
        message: '已删除',
      })
        getUser(selectNodeData.value.id)
      })
    })
    .catch(() => ElMessage.info('已取消删除'));
}
//调组
function editUserArray(){
  
}
</script>
<style lang="scss" scoped>
    .tree_style{
        max-height: 800px;
        height: 75vh;
        .checkedNode{
          background-color: bisque;
          .btnlist{
            display: inline-block !important;
          }
        }
        .custom-tree-node {
          width: 100%;
          flex: 1;
          display: block;
          font-size: 14px;
          font-weight: 700;
          padding-right: 8px;
          .btnlist{
          display: none;
          float: right;
          }
        }
    }
    .border_style{
        padding: 20px;
    }
    .border_style11{
        padding: 60px 20px 10px;
    }
</style>