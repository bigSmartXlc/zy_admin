<template>
  <div>
  </div>
    <el-row :gutter="10">
    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8"
    >   
        <dv-border-box-9 class="border_style">
            <p>浅橙文化
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
            </div>
        </dv-border-box-9>
    </el-col>
    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8"
    >
        <dv-border-box-11 title="员工列表" :title-width="250" class="border_style11">
            <div>
                 <el-button
                type="success"
                :icon="Plus"
                 size="small"
                @click="bingSuperior(scope.row.id)"
            >添加</el-button>
             <el-button
                type="danger"
                 size="small"
                :icon="Delete"
                @click="handleDelete(scope.row)"
            >删除</el-button>
              <el-button
                type="primary"
                :icon="Edit"
                 size="small"
                @click="editRole(scope.row)"
            >调组</el-button>
             <el-table
                ref="multipleTableRef"
                :data="tableData"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection"/>
                <el-table-column label="Date">
                <template #default="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column property="name" label="Name"/>
                  <el-table-column label="操作" align="left">
                    <template #default="scope">
                        <el-button
                            type="info"
                            :icon="Plus"
                            size="small"
                            @click="handelZzjg(scope.row)"
                        >角色</el-button>
                    </template>
                </el-table-column>
            </el-table>
            </div>
        </dv-border-box-11>
    </el-col>
    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8"
    >
        <dv-border-box-11 title="角色列表" :title-width="250" class="border_style11">
            <div>
                  <el-button
                type="success"
                :icon="Plus"
                 size="small"
                @click="bingSuperior(scope.row.id)"
            >添加</el-button>
             <el-button
                type="danger"
                 size="small"
                :icon="Delete"
                @click="handleDelete(scope.row)"
            >删除</el-button>
             <el-table
                ref="multipleTableRef"
                :data="tableData"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" />
                <el-table-column label="Date" >
                <template #default="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column property="name" label="Name"/>
            </el-table>
            </div>
        </dv-border-box-11>
    </el-col>
    </el-row>
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
import { useRoute} from 'vue-router';
import router from '@/router';
interface User {
  date: string
  name: string
  address: string
}
const multipleSelection = ref<User[]>([])
const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}
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
const route = useRoute();
const companyId = route.query.id
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
   ElMessageBox.confirm('确认删除当前菜单?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
       deleteMenus(id).then(res=>{
      ElMessage({
        type: 'warning',
        message: '已删除',
      })
      refersh()
  })
    })
    .catch(() => ElMessage.info('已取消删除'));
}
</script>
<style lang="scss" scoped>
    .tree_style{
        max-height: 800px;
        height: 75vh;
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
    .border_style{
        padding: 20px;
    }
    .border_style11{
        padding: 60px 20px 10px;
    }
</style>