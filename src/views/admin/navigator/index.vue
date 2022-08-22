<template>
  <div>
    <el-button
        type="success"
        :icon="Plus"
        @click="handleAdd(0)"
        >新增菜单</el-button
      >
  </div>
<span class="menu_container">
  <el-tree
    :data="tree_data"
    :props="defaultProps"
    :default-expanded-keys="defaultNodekey"
    draggable
    node-key="id"
    @node-drag-end="handleDragEnd"
    accordion
    @node-click="handleNodeClick"
    class="menu_tree"
  >
      <template #default="{ node, data }">
      <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span class="btnlist">
              <el-button
                type="success"
                :icon="Plus"
                size="small"
                circle
                plain
                @click.stop="handleAdd(data.id)"
              />
                <el-button
                v-show="data.status"
                type="danger"
                :icon="TurnOff"
                size="small"
                circle
                plain
                @click.stop="handleBan(data.id)"
              />
                <el-button
                v-show="!data.status"
                type="success"
                :icon="Open"
                size="small"
                circle
                plain
                @click.stop="handleUnban(data.id)"
              />
              <el-button
              v-show="data.pid!=0"
                type="primary"
                :icon="Edit"
                size="small"
                circle
                plain
                @click.stop="getView(data.id)"
              />
              <el-button
                type="danger"
                :icon="Delete"
                size="small"
                circle
                plain
                @click.stop="handleDelete(data.id)"
              />
          </span>
        </span>
      
      </template>
  </el-tree>
  <div class="edit" v-show="edit_status">
  <h2>菜单修改</h2>
      <el-divider />
      <el-form ref="queryFormRef" :model="queryParams">
      <el-form-item prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="菜单名称"
          clearable
        />
      </el-form-item>
      <el-form-item prop="pid">
        <el-select
          v-model="queryParams.pid"
          placeholder="上级菜单"
          clearable
        >
          <el-option
            v-for="(value,  key) in pid_menu"
              :key="value"
              :value="key"
              :label="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="route">
        <el-select
          v-model="queryParams.route"
          placeholder="菜单路由"
          clearable
        >
          <el-option-group
            v-for="group in menu_route"
            :key="group.id"
            :label="group.name"
          >
            <el-option
              v-for="(key,value) in group.sub"
              :key="value"
              :label="key"
              :value="value"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleUpdate"
          >确认</el-button
        >
         <el-button type="info" plain @click="edit_status = false">取消</el-button>
      </el-form-item>
    </el-form>
    <div class="clear"></div>
  </div>
</span>
</template>

<script lang="ts" setup>
import {
  onMounted,
  watch,
  reactive,
  ref,
} from 'vue';
import {
  getMenuDetail,
  listMenuOptions,
  addMenu,
  deleteMenus,
  updateMenu,
  dragMenu,
  banMenu,
  unbanMenu
} from '@/api/system/menu';
import { Open, Plus, Edit, TurnOff, Delete,View } from '@element-plus/icons-vue';
import { ElForm,ElMessage, ElMessageBox } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import useStore from '@/store';
import router from '@/router';

const queryParams=reactive({
    name:'',
    pid:'',
    route:''
  })
const dragParams:any=reactive({
     header_id:'',
    current_id:'',
    footer_id:""
  })  
const menu_route:any = ref([])  
const pid_menu:any = ref({})  
const select_node:any = ref({})  
const tree_data: any = ref([])
const edit_status: any = ref(false)
const defaultNodekey: any = ref([])
const defaultProps = {
  children: 'subRoute',
  label: 'name',
}
const queryFormRef = ref(ElForm);
onMounted(()=>{
 refersh(true)
})
//刷新菜单
const refersh=(first=false)=>{
  listMenuOptions().then(res=>{
    if(!first){
      const { permission } = useStore();
      permission.generateRoutes(['ROOT']).then(res=>{
      })
    }
    menu_route.value = []
    tree_data.value = res.data.list.data
    pid_menu.value = res.data.routeNavigatorSelect
    var routeData = res.data.permissionSelect
    for (const key in routeData) {
      menu_route.value.push({
        id:key,...routeData[key]
      })
    }
  })
}
const getBeforeNode = (data:any,node:any)=>{
            for(let i=0;i<data.length;i++){
            if(data[i].id == node.id){
              if(i > 0){
                dragParams.header_id = data[i-1].id
                break ;
              }else{//没有前面一个节点
                dragParams.header_id = 0;
                break
              }
            }else if(data[i].subRoute){//有下级，递归查询
              getBeforeNode(data[i].subRoute,node);
            }
          }
}
const getAfterNode = (data:any,node:any)=>{
    for(let i=0;i<data.length;i++){
    if(data[i].id == node.id){
      if(i < (data.length - 1)){
         dragParams.footer_id = data[i-1].id
          break ;
      }else{//没有后面一个节点
        dragParams.footer_id = 0;
        break
      }
    }else if(data[i].subRoute){//有下级，递归查询
      getAfterNode(data[i].subRoute,node);
    }
  }
}
 
//拖拽
const handleDragEnd = (
  draggingNode: Node,
  dropNode: Node,
  dropType: any,
) => {
  dragParams.current_id = draggingNode.data.id
  if(draggingNode.data.pid!=dropNode.data.pid||dropType=='inner'||dropType=='none'){
       ElMessage({
        type: 'warning',
        message: '不可越级拖拽',
      })
      refersh()
  }else{
    getBeforeNode(tree_data.value,draggingNode.data)
    getAfterNode(tree_data.value,draggingNode.data)
    dragMenu(dragParams).then(res=>{
      refersh()
    })
  }
}
//添加菜单
const handleAdd =(pid:number)=>{
   ElMessageBox.prompt('请输入菜单名', '添加菜单', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
    .then(({ value }) => {
      addMenu({
        pid,name:value
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
//点击节点
const handleNodeClick = (data: any) => {
  console.log(data)
}
//重置表单
const resetQuery=()=> {
  queryFormRef.value.resetFields();
}
//获取菜单详情
const getView =(id:number)=>{
    getMenuDetail(id).then((res)=>{
      select_node.value = res.data
      const {pid,route,name} = res.data
      queryParams.pid =pid.toString()
      queryParams.route =route
      queryParams.name =name
      edit_status.value = true
    })
}
//修改菜单
const handleUpdate =(data:object)=>{
  updateMenu(select_node.value.id,queryParams).then(res=>{
    resetQuery()
    refersh()
    defaultNodekey.value = [select_node.value.id]
    edit_status.value = false
  })
}
// 停用
const handleBan = (id:number)=>{
  banMenu(id).then((res)=>{
     ElMessage({
        type: 'warning',
        message: '已停用',
      })
      refersh()
      defaultNodekey.value = [id]
  })
}
// 启用
const handleUnban = (id:number)=>{
  unbanMenu(id).then((res)=>{
     ElMessage({
        type: 'success',
        message: '已启用',
      })
       refersh()
  })
}
// 删除
const handleDelete = (id:number) => {
  deleteMenus(id).then(res=>{
     ElMessage({
        type: 'warning',
        message: '已删除',
      })
      refersh()
  })
}
</script>
<style lang="scss" scoped>
.menu_container{
  position: relative;
  display: flex;
  .menu_tree{
    display: inline-block;
    width:30% ;
    height: 800px;
    overflow: auto;
    min-width: 350px;
    border: solid 1px rgba(110, 107, 107,0.5);
    margin-top: 20px;
    margin-right: 20px;
    border-radius: 5px;
    .custom-tree-node:hover{
      background-color: bisque;
      .btnlist{
      display: inline-block;
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
  .edit{
     margin-top: 20px;
      width:30% ;
      min-width: 300px;
      height:800px ;
      padding: 10px;
      border: solid 1px rgba(110, 107, 107,0.5);
      border-radius: 5px;
      ::v-deep .el-select{
        width: 100% !important;
      }
  }
  @media screen and (max-width:550px) {
    .menu_tree{
      height: 500px;
    }
    .edit{
      background-color: aliceblue;
      position: fixed;
      font-size: 0.14rem;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 90%;
      min-height: 300px;
      max-height: 5.1rem;
      max-width: 5.5rem;
      z-index: 10;
    }
}
}
</style>