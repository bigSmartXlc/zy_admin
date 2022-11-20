<script setup lang="ts">
    import {
      onMounted,
      reactive,
      ref,
      toRefs,
    } from 'vue';
    
    import {
        getSonAccount,
        refreshFund,
        getDayFlow
    } from '@/api/linkurl';
    import { Search, Refresh, View} from '@element-plus/icons-vue';
    import { Dialog} from '@/types/common';
    import { ElForm, ElMessage } from 'element-plus';
    const queryFormRef = ref(ElForm);
    const dialogFormRef = ref(ElForm);
    const layout = 'total, prev, pager, next'
    const state = reactive({
      loading: true,
      dialog_loading:true,
      dialogParams:{
        search:'',
        start_time:'',
        end_time:'',
        page: 1,
        pageSize: 15,
      },
      queryParams: {
        search:'',
        page: 1,
        pageSize: 15,
      },
      dialog: {
        visible: false,
        title:'账号流水'
      } as Dialog,
      permList: [] as any,
      dialog_permList: [] as any,
      dialog_total:0,
      total: 0,
    });
    const {
      loading,
      dialog_loading,
      permList,
      total,
      dialog,
      queryParams,
      dialogParams,
      dialog_permList,
      dialog_total
    } = toRefs(state);
    // 查询
    function handleQuery() {
        state.loading = true;
        getSonAccount(state.queryParams).then((res) => {
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
     //刷新余额
     function handleRefreshAccount(row:any){
        refreshFund(row.id).then(res=>{
            ElMessage.success('已刷新');
            handleQuery();
        })
    }


    //弹框查询重置
    function dialog_resetQuery(){
        dialogFormRef.value.resetFields()
        dialog_Query()
    }
   
    const select_row=ref({}) as any
    //查看日流水
    function viewFlow(row:any){
        select_row.value=row
        state.dialog.visible=true
        dialog_Query()
    }
    //日流水查询
    function dialog_Query(){
        state.dialog_loading = true;
        getDayFlow(select_row.value.id,state.dialogParams).then((res) => {
          var data = res.data
          var listjson = JSON.parse(JSON.stringify(data.list.data) )
          state.dialog_permList = listjson;
          state.dialog_total = data.list.total;
          state.dialog_loading = false;
        });
    }

    onMounted(() => {
      handleQuery();
    });
    </script>
    
    <template>
      <div claas="component-container">
        <!-- 搜索表单 -->
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
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
          border
        >
          <el-table-column label="广告主ID" prop="accountId"  />
          <el-table-column label="账号名" prop="name"  />
          <el-table-column label="上级账号" prop="parentName"  />
          <el-table-column label="账户总金额(元)" prop="cash"  />
          <el-table-column label="账户可用总金额(元)" prop="valid_cash"  />
          <el-table-column label="现金余额(元)" prop="balance"  />
          <el-table-column label="现金可用余额(元)" prop="valid_balance"  />
          <el-table-column label="创建时间" prop="createdAt"  />
          <el-table-column label="操作" align="left" width="250">
            <template #default="scope">
                 <el-button
                    type="primary"
                    :icon="Refresh"
                     size="small"
                    @click="handleRefreshAccount(scope.row)"
                >刷新余额</el-button>
                <el-button
                    type="info"
                    :icon="View"
                     size="small"
                    @click="viewFlow(scope.row)"
                >查看日流水</el-button>
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
        <el-dialog :title="dialog.title" v-model="dialog.visible" width="80%" custom-class="large_dialog"
        >
                 <!-- 搜索表单 -->
                <el-form ref="dialogFormRef" :model="dialogParams" :inline="true">
            <el-form-item prop="start_time">
                <el-date-picker
                    v-model="dialogParams.start_time"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="开始日期"
                    @change="dialog_Query"
                />
                </el-form-item>
                <el-form-item prop="end_time">  
                <el-date-picker
                    v-model="dialogParams.end_time"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="结束日期"
                    @change="dialog_Query"
                />
                </el-form-item>
                <el-form-item prop="search">
                    <el-input
                    v-model="dialogParams.search"
                    placeholder="流水信息"
                    clearable
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Search" @click="dialog_Query"
                    >搜索</el-button
                    >
                    <el-button :icon="Refresh" @click="dialog_resetQuery">重置</el-button>
                </el-form-item>
                </el-form>
            
                <!-- 数据表格 -->
                <el-table
                :data="dialog_permList"
                v-loading="dialog_loading"
                border
                >
                    <el-table-column label="广告主ID" prop="accountId" width="200" />
                    <el-table-column label="日期" prop="date"  />
                    <el-table-column label="日终结余(元)" prop="balance"  />
                    <el-table-column label="现金支出(元)" prop="cash_cost"  />
                    <el-table-column label="总支出(元)" prop="cost"  />
                    <el-table-column label="冻结(元)" prop="frozen"  />
                    <el-table-column label="总存入(元)" prop="income"  />
                    <el-table-column label="赠款支出(元)" prop="reward_cost"  />
                    <el-table-column label="总转入(元)" prop="shared_wallet_cost"  />
                    <el-table-column label="总存入(元)" prop="transfer_in"  />
                    <el-table-column label="总转出(元)" prop="transfer_out"  />
                </el-table>
            
                <!-- 分页工具条 -->
                <pagination
                v-if="dialog_total > 0"
                :total="dialog_total"
                v-model:page="dialogParams.page"
                v-model:limit="dialogParams.pageSize"
                :layout="layout"
                :page-sizes="[15,30,50,100]"
                @pagination="dialog_Query"
                />            
        </el-dialog>
      </div>
    </template>
    
    <style lang="scss" scoped>
    .component-container {
      box-sizing: border-box;
    }
    </style>
    