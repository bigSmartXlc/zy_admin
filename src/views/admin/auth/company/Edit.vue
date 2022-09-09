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
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit"
            >Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
  </template>
  
  <script lang="ts" setup>
import {
  onMounted,
  toRefs,
  computed,
  ref,
} from 'vue';
  const props = defineProps<{
    editId?:any
    visible?: boolean
    title?: string
    }>()
    const multipleSelection = ref([])
    onMounted(()=>{
      
    })
    const {title} = toRefs(props);
  const tableData:any = [
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
  const handleSelectionChange = (val:any) => {
    multipleSelection.value = val
  }
  const dialogVisible = computed(() => props.visible)
  const Tips = computed(() => props.title)
  const emit = defineEmits(['closeEdit', 'submit'])

    function handleClose() {
        emit('closeEdit')
    }
    //提交
    function handleSubmit(){
        emit('submit')
    }
  </script>
  <style scoped>
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  </style>
  