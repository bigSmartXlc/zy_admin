<script setup lang="ts">
    import {
      onMounted,
      reactive,
      ref,
      toRefs,
    } from 'vue';
    
    import {
    getMajorList,
    createAccount,
    destoryAccount,
    refreshAccount
    } from '@/api/linkurl';
    import { Search, Plus, Edit, Refresh, Delete,View } from '@element-plus/icons-vue';
    
    import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
    import { Dialog} from '@/types/common';
    const queryFormRef = ref(ElForm);
    const layout = 'total, prev, pager, next'
    const state = reactive({
      loading: true,
      queryParams: {
        search:'',
        page: 1,
        pageSize: 15,
      },
      permList: [] as any,
      htmlSrc:'',
      total: 0,
      dialog: {
        visible: false,
      } as Dialog,
      edit_permission_selected_row:[] as any,
    });
    const {
      loading,
      permList,
      total,
      dialog,
      htmlSrc,
      queryParams
    } = toRefs(state);
    const disabled=ref(true)
    // 多选
    function handleSelectionChange(val:any){
      disabled.value=val.length>0?false:true
        state.edit_permission_selected_row = val
    }
    // 新增角色
    function addAccount(){
        createAccount().then(res=>{
            state.htmlSrc=res.data
        })
         state.dialog = {
        title:'新增账号',
        visible:true
      }
    }
    // 查询
    function handleQuery() {
        state.loading = true;
        getMajorList(state.queryParams).then((res) => {
          var data = res.data
          var listjson = JSON.parse(JSON.stringify(data.list.data) )
          state.permList = listjson;
          state.total = data.list.total;
          state.loading = false;
        });
    }
    //查询重置
    function resetQuery() {
      queryFormRef.value.resetFields();
      handleQuery();
    }
    //批量删除
    function handleDeleteList(){
        const major_ids = [] as any
        state.edit_permission_selected_row.forEach((item:any)=>{
            major_ids.push(item.id)
        })
        handleDelete(major_ids)
    }


    //单条删除
    function handleDeleteSin(row:any){
        const major_ids = [row.id]
        handleDelete(major_ids)
    }


    //删除
    function handleDelete(major_ids: any) {
      ElMessageBox.confirm('确认删除选中账号?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
            destoryAccount(major_ids).then(() => {
            ElMessage.success('删除成功');
            handleQuery();
          });
        })
        .catch(() => ElMessage.info('已取消删除'));
    }

    //同步子账号
    function handleSonAccount(row:any){
        refreshAccount(row.id).then(res=>{
            ElMessage.success('已同步');
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
              type="success"
              :icon="Plus"
              @click="addAccount"
              >新增账户</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="danger"
              :icon="Delete"
              :disabled="disabled"
              @click="handleDeleteList"
              >批量删除</el-button
            >
          </el-form-item>
          <el-form-item prop="search">
            <el-input
              v-model="queryParams.search"
              placeholder="账户信息"
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
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column type="selection"/>
          <el-table-column label="广告主ID" prop="accountId"  />
          <el-table-column label="用户名" prop="name"  />
          <el-table-column label="用户角色" prop="accountRole"  />
          <el-table-column label="是否有效" prop="isValid"  />
          <el-table-column label="创建时间" prop="createdAt"  />
          <el-table-column label="操作" align="left">
            <template #default="scope">
                 <el-button
                    type="primary"
                    :icon="View"
                     size="small"
                    @click="handleSonAccount(scope.row)"
                >同步子账号</el-button>
                 <el-button
                    type="danger"
                     size="small"
                    :icon="Delete"
                    @click="handleDeleteSin(scope.row)"
                >删除账号</el-button>
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
        <el-dialog :title="dialog.title" v-model="dialog.visible" width="80%"
            @closed="handleQuery"
        >
            <iframe
            ref="iframe"
            :src="htmlSrc"
            style="width:100%;height:600px;margin-top:20px"
            frameborder="0"/>
        </el-dialog>
      </div>
    </template>
    
    <style lang="scss" scoped>
    .component-container {
      box-sizing: border-box;
    }
    </style>
    