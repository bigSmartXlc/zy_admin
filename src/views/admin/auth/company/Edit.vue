<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="Tips"
      width="30%"
      :before-close="handleClose"
    >
    <el-table
          ref="multipleTableRef"
          :data="tableData"
          @selection-change="handleSelectionChange"
      >
          <el-table-column type="selection"/>
          <el-table-column v-if="title!='添加角色'" property="name" label="账号"/>
          <el-table-column v-if="title!='添加角色'" property="name" label="用户姓名"/>
          <el-table-column v-if="title=='添加角色'" property="name" label="角色名" />
          <el-table-column v-if="title=='添加角色'" property="name" label="描述"/>
      </el-table>
      <pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        :layout="layout"
        @pagination="handlequery"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
  </template>
  <script lang="ts" setup>
import {
  watch,
  toRef,
  computed,
  ref,
} from 'vue';
import {
  getOrganUser,
  getOrganRole,
} from '@/api/system/company';
import { useRoute} from 'vue-router';
const layout = 'total, prev, pager, next'
const total=ref(0)
const queryParams=ref({
  page:1,
  pageSize:10
})
const route = useRoute()
  const props = defineProps<{
    editId?:any
    visible?: boolean
    title?: string
    }>()
    const multipleSelection = ref([])
   
    const title = toRef(props,'title');
    const tableData=ref([])
    const handleSelectionChange = (val:any) => {
      multipleSelection.value = val
    }
    const dialogVisible = computed(() => props.visible)
    const Tips = computed(() => props.title)
    const emit = defineEmits(['closeEdit', 'submit'])
    watch(dialogVisible,(value)=>{
      if(value){
        handlequery()
      }
    })
    //查询
    function handlequery(){
      if(title.value=='添加角色'){
          getRole(props.editId,{company_id:route.query.id})
        }else{
          getUser() 
        }
    }
    //查询组织角色
    function getRole(organ_id:any,companyId:any){
      getOrganRole({...organ_id,...companyId,page:queryParams.value.page}).then(res=>{
        tableData.value=res.data
      })
    }
    function getUser(){
      getOrganUser({organ_id:0,page:queryParams.value.page}).then(res=>{
        tableData.value=res.data
      })
    }
    function handleClose() {
        emit('closeEdit')
    }
    //提交
    function handleSubmit(){
      if(title.value=='添加角色'){
        const role_id = [] as any
        multipleSelection.value.forEach((item:any)=>{
          role_id.push(item.id)
        })
        emit('submit',{role_id,...props.editId,type:1})
      }else{
        emit('submit',multipleSelection.value,0)
      }
    }
  </script>
  <style scoped>
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  </style>
  