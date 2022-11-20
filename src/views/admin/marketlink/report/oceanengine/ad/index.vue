<script setup lang="ts">
    import {
      onMounted,
      reactive,
      ref,
      toRefs,
    } from 'vue';
    
    import {
        getAdReport,
        setPlanStatus,
        gethourlyReport,
        getReportByDate,
        getAdvertiserReport,
        getPlanReport
    } from '@/api/report';
    import {Search, Refresh,View } from '@element-plus/icons-vue';
    import type { TabsPaneContext } from 'element-plus'
    import { ElForm, ElMessage} from 'element-plus';
    import { Dialog } from '@/types/common';
    import { parseTime } from '@/utils'; 
    import {
      PermItem,
    } from '@/types/api/system/perm';
    import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
    const queryFormRef = ref(ElForm);
    const queryFormRef1 = ref(ElForm);
    const queryFormRef2 = ref(ElForm);
    const layout = 'total, prev, pager, next'
    //计划维度模块---------------------------------------------------------------
    const state = reactive({
      loading: true,
      // 选中ID数组
      ids: [],
      // 非单个禁用
      single: true,
      activeName:'first',
      // 非多个禁用
      multiple: true,
      queryParams: {
        search_status:'',
        date_start:parseTime(new Date(),'{y}-{m}-{d}'),
        date_end:parseTime(new Date(),'{y}-{m}-{d}'),
        opt_status:'',
        search:'',
        status:'',
        page: 1,
        pageSize: 15,
    } as any,
    
    dialog_loading:false,
      dialog_queryParams:{
        page: 1,
        pageSize: 15,
      },
      dialog_permList:[] as PermItem[],
      dialog_total:0,
      dialog: {
        visible: false,
      } as Dialog,
      permList: [] as PermItem[],
      total: 0,
      total1: 0,
      adStatusSelect: [] as any,
      optStatusSelect: [],
      edit_permission_selected_row:{} as any,
    });
    const {
      loading,
      dialog_loading,
      dialog_permList,
      dialog_queryParams,
      permList,
      total,
      dialog_total,
      dialog,
      adStatusSelect,
      optStatusSelect,
      activeName,
      queryParams,
    } = toRefs(state);
    // 查询
    function handleQuery() {
        state.loading = true;
        getAdReport(state.queryParams).then((res) => {
          var data = res.data
          var listjson = JSON.parse(JSON.stringify(data.list.data))
          var dataList=[] as any
          listjson.forEach((item:any) => {
            dataList.push({...item,...item.priceStats,opeStatusKey:item.opeStatus=='开启'?true:false})
          });
          state.permList=dataList
          state.total = data.list.total;
          state.loading = false;
          state.adStatusSelect={'':'全部',...data.adStatusSelect}
          state.optStatusSelect={'':'全部',...data.optStatusSelect}
        });
    }
    //实时数据查询
    function handleDialogQuery(){
        state.dialog_loading = true;
        gethourlyReport(state.edit_permission_selected_row.id,state.dialog_queryParams).then((res) => {
          var data = res.data
          var listjson = JSON.parse(JSON.stringify(data.list.data))
          var dataList=[] as any
          listjson.forEach((item:any) => {
            dataList.push({...item,...item.priceStats})
          });
          state.dialog_permList=dataList
          state.dialog_total = data.list.total;
          state.dialog_loading = false;
        });
    }
    //查询重置
    function resetQuery() {
      queryFormRef.value.resetFields();
      state.queryParams.page=1
      handleQuery();
    }
    
    //实时数据弹框
    function editRole(row: any) {
        state.edit_permission_selected_row=row
        state.dialog = {
            title: row.name,
            visible: true,
         };
         handleDialogQuery()
    }
    //修改状态
    function handleSwitch(row:any){
        state.loading = true;
        setPlanStatus(row.id,{opt_status:row.opeStatusKey?'enable':'disable'}).then((res)=>{
            state.loading = false;
            ElMessage.success('修改状态成功');
            handleQuery();
        })
    }


    //广告主模块-------------------------------------------------------
    const state1=reactive({
        queryParams1: {
        tt_ad_account:'',
        date_start:parseTime(new Date(),'{y}-{m}-{d}'),
        date_end:parseTime(new Date(),'{y}-{m}-{d}'),
        page: 1,
        pageSize: 15,
      } as any,
      permList1:[] as any,
      total1:0,
      loading1:false,
      ttAdAccountSelect:{} as any,
      edit_permission_selected_row:{} as any,
      //弹框
      dialog_loading1:false,
      dialog_queryParams1:{
        page: 1,
        pageSize: 15,
      },
      dialog_permList1:[] as PermItem[],
      dialog_total1:0,
      dialog1: {
        visible: false,
      } as Dialog,
    })
    const {
        queryParams1,
        loading1,
        total1,
        permList1,
        ttAdAccountSelect,
        dialog_loading1,
        dialog_queryParams1,
        dialog_permList1,
        dialog_total1,
        dialog1,
    } = toRefs(state1)
    
    //查询
    function handleQuery1() {
        state1.loading1 = true;
        getAdvertiserReport(state1.queryParams1).then((res) => {
          var data = res.data
          var listjson = JSON.parse(JSON.stringify(data.list.data))
          var dataList=[] as any
          listjson.forEach((item:any) => {
            dataList.push({...item,...item.priceStats,opeStatusKey:item.opeStatus=='开启'?true:false})
          });
          state1.permList1=dataList
          state1.total1 = data.list.total;
          state1.loading1 = false;
          state1.ttAdAccountSelect={...data.ttAdAccountSelect,'':'全部'}
        });
    }
    //查询重置
    function resetQuery1() {
      queryFormRef1.value.resetFields();
      state1.queryParams1.page=1
      handleQuery1();
    }
    
    //计划数据弹框
    function editRole1(row: any) {
    const {date_start,date_end} = state1.queryParams1
    state1.edit_permission_selected_row={...row,date_start,date_end}
    state1.dialog1 = {
        title: row.advertiserName,
        visible: true,
        };
        handleDialogQuery1()
    }
       //计划数据查询数据查询
    function handleDialogQuery1(){
        state.dialog_loading = true;
        const {id,date_end,date_start} = state1.edit_permission_selected_row
        getPlanReport({...state1.dialog_queryParams1,son_ad_account:id,date_end,date_start}).then((res) => {
            var data = res.data
            var listjson = JSON.parse(JSON.stringify(data.list.data))
            var dataList=[] as any
            listjson.forEach((item:any) => {
            dataList.push({...item,...item.priceStats})
            });
            state1.dialog_permList1=dataList
            state1.dialog_total1 = data.list.total;
            state1.dialog_loading1 = false;
        });
    }

    //日期维度模块-------------------------------------------------------
    const state2=reactive({
        queryParams2: {
        date_start:fun_date(-6),
        date_end:parseTime(new Date(),'{y}-{m}-{d}'),
      } as any,
      permList2:[] as any,
      loading2:false,
    })
    const {
        queryParams2,
        loading2,
        permList2
    } = toRefs(state2)
    
    //查询
    function handleQuery2() {
        state2.loading2 = true;
        getReportByDate(state2.queryParams2).then((res) => {
          var data = res.data
          var listjson = JSON.parse(JSON.stringify(data.list))
          var dataList=[] as any
          for(let key in listjson){
            dataList.push({date:key,...listjson[key]})
          }
          state2.permList2=dataList
          state2.loading2 = false;
        });
    }
    
    //补零操作
    function buling(val:any){
        if(Number(val)<10){
            return '0'+val
        }else{
            return val
        }
    }

    //获取n天前的日期
    function fun_date(num:number) { 
        var date1 = new Date();
        var date2 = new Date(date1);
        date2.setDate(date1.getDate() + num);
        var datevalue=date2.getDate()
        //num是正数表示之后的时间，num负数表示之前的时间，0表示今天
        var time2 = date2.getFullYear() + "-" + buling(date2.getMonth() + 1) + "-" + buling(datevalue); 
        return time2;
    }


    //tab切换
    function handleClick(tab: TabsPaneContext, event: Event){
    }


    
    //合计
    interface Product {
        id: string
        name: string
        amount1: string
        amount2: string
        amount3: number
    }
    interface SummaryMethodProps<T = Product> {
        columns: TableColumnCtx<T>[]
        data: T[]
    }

    function getSummaries(param: SummaryMethodProps){
        const { columns, data } = param
        const sums: string[] = []
        columns.forEach((column, index) => {
            if (index === 0) {
            sums[index] = '合计'
            return
            }
            if(column.property=='advertiserId'||column.property=='total_roi'||column.property=='vaild_roi'||column.property=='no_next_roi'||column.property=='ctr'||column.property=='convert_rate'||column.property=='valid_play_rate'||column.property=='convert_rate'||column.property=='convert_rate'){
                sums[index]=''
                return
            }
            const values = data.map((item:any) => Number(item[column.property]))
            if (!values.every((value) => Number.isNaN(value))) {
            sums[index] = `${values.reduce((prev:any, curr:any) => {
                const value = Number(curr)
                if (!Number.isNaN(value)) {
                return (Number(prev) + Number(curr)).toFixed(2)
                } else {
                return prev
                }
            }, 0)}`
            } else {
            sums[index] = ''
            }
        })

        return sums
    }

    onMounted(() => {
      handleQuery();
      handleQuery1();
      handleQuery2();
    });
    </script>
    
    <template>
      <div claas="component-container">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="计划维度" name="first">
                <!-- 搜索表单 -->
                <el-form ref="queryFormRef" :model="queryParams" label-width="120px" :inline="true">
                    <el-form-item label='开始日期' prop="date_start">
                        <el-date-picker
                            v-model="queryParams.date_start"
                            value-format="YYYY-MM-DD"
                            placeholder="开始日期"
                            type="date"
                            @change="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label='结束日期' prop="date_end">
                        <el-date-picker
                            v-model="queryParams.date_end"
                            value-format="YYYY-MM-DD"
                            placeholder="结束日期"
                            type="date"
                            @change="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label='操作状态' prop="opt_status">
                        <el-select
                            v-model="queryParams.opt_status"
                            @change="handleQuery"
                            clearable
                        >
                        <el-option
                        v-for="(value,  key) in optStatusSelect"
                        :key="value"
                        :value="key"
                        :label="value"
                        />
                        </el-select>
                    </el-form-item>
                    <el-form-item label='计划状态' prop="status">
                        <el-select
                        v-model="queryParams.status"
                        @change="handleQuery"
                        clearable
                        >
                        <el-option
                        v-for="(value,  key) in adStatusSelect"
                        :key="value"
                        :value="key"
                        :label="value"
                        />
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="search"  label="搜索">
                        <el-input
                        v-model="queryParams.search"
                        placeholder="计划名称、计划ID、广告主ID"
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
                    height="650"
                    stripe
                    :summary-method="getSummaries"
                    :default-sort="{ prop: 'cost', order: 'descending' }"
                    show-summary
                    border
                >
                <el-table-column label="计划名称" prop="name" show-overflow-tooltip fixed min-width="250" />
                <el-table-column label="计划(操作)" prop="opeStatus" width="150">
                    <template #default="scope">
                        <div>
                            {{scope.row.opeStatus}}
                            <el-switch 
                                style="margin-left: 10px"
                                v-model="scope.row.opeStatusKey"
                                width="60px" 
                                size="large"
                                inline-prompt
                                active-text="开启"
                                inactive-text="暂停"
                                @change="handleSwitch(scope.row)" 
                            />
                        </div>
                    </template>  
                </el-table-column>
                <el-table-column label="计划(投放 )" prop="status"   width="100" />
                <el-table-column label="出价类型" prop="pricing"   width="150" />
                <el-table-column label="预算" prop="budget"   width="100"  />
                <el-table-column label="消耗" prop="cost" sortable  />
                <el-table-column label="总销售额" prop="total_amount"  sortable  width="110" />
                <el-table-column label="不包回流总订单流水" prop="tb_order_total"  sortable  width="180" />
                <el-table-column label="已归因订单量" prop="tb_order_num" sortable   width="150" />
                <el-table-column label="已上报订单量" prop="tb_convert_num"  sortable  width="150" />
                <el-table-column label="有效销售额" prop="tb_valid_order_total"  sortable  width="130" />
                <el-table-column label="回流销售额" prop="tb_next_order_total"  sortable  width="130" />
                <el-table-column label="总ROI" prop="total_roi"  sortable  width="110" >
                    <template #default="scope">
                        <div :style="{color:scope.row.total_roi>=1?'green':'red'}">
                            {{scope.row.total_roi}}
                        </div>
                    </template>  
                </el-table-column>
                <el-table-column label="有效ROI" prop="vaild_roi"  >
                    <template #default="scope">
                        <div :style="{color:scope.row.vaild_roi>=1?'green':'red'}">
                            {{scope.row.vaild_roi}}
                        </div>
                    </template>  
                </el-table-column>
                <el-table-column label="不包回流ROI" prop="no_next_roi"   width="130" >
                    <template #default="scope">
                        <div :style="{color:scope.row.no_next_roi>=1?'green':'red'}">
                            {{scope.row.no_next_roi}}
                        </div>
                    </template>  
                </el-table-column>
                <el-table-column label="操作" align="left" fixed="right" width="120">
                    <template #default="scope">
                        <el-button
                            type="primary"
                            :icon="View"
                            size="small"
                            @click="editRole(scope.row)"
                        >实时数据</el-button>
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
            </el-tab-pane>
            <el-tab-pane label="广告主维度" name="second">
                   <!-- 搜索表单 -->
                <el-form ref="queryFormRef1" :model="queryParams1" label-width="120px" :inline="true">
                <el-form-item label='开始日期' prop="date_start">
                    <el-date-picker
                        v-model="queryParams1.date_start"
                        value-format="YYYY-MM-DD"
                        placeholder="开始日期"
                        type="date"
                        @change="handleQuery1"
                    />
                </el-form-item>
                <el-form-item label='结束日期' prop="date_end">
                    <el-date-picker
                        v-model="queryParams1.date_end"
                        value-format="YYYY-MM-DD"
                        placeholder="结束日期"
                        type="date"
                        @change="handleQuery1"
                    />
                </el-form-item>
                <el-form-item label='主体账号' prop="tt_ad_account">
                    <el-select
                    v-model="queryParams1.tt_ad_account"
                    @change="handleQuery1"
                    clearable
                    >
                    <el-option
                    v-for="(value,  key) in ttAdAccountSelect"
                    :key="value"
                    :value="key"
                    :label="value"
                    />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Search" @click="handleQuery1"
                    >搜索</el-button
                    >
                    <el-button :icon="Refresh" @click="resetQuery1">重置</el-button>
                </el-form-item>
                </el-form>
            
                <!-- 数据表格 -->
                <el-table
                :data="permList1"
                v-loading="loading1"
                :summary-method="getSummaries"
                height="650"
                stripe
                show-summary
                border
                >
                    <el-table-column label="广告主体" prop="advertiserName" show-overflow-tooltip fixed min-width="150" />
                    <el-table-column label="广告ID" prop="advertiserId" width="150" />
                    <el-table-column label="消耗" prop="cost" sortable/>
                    <el-table-column label="总销售额" prop="total_amount"  sortable  width="110" />
                    <el-table-column label="不包回流总订单流水" prop="tb_order_total"  sortable  width="180" />
                    <el-table-column label="已归因订单量" prop="tb_order_num" sortable   width="150" />
                    <el-table-column label="已上报订单量" prop="tb_convert_num"  sortable  width="150" />
                    <el-table-column label="有效销售额" prop="tb_valid_order_total"  sortable  width="140" />
                    <el-table-column label="回流销售额" prop="tb_next_order_total"  sortable  width="140" />
                    <el-table-column label="总ROI" prop="total_roi"  sortable  width="110" >
                        <template #default="scope">
                            <div :style="{color:scope.row.total_roi>=1?'green':'red'}">
                                {{scope.row.total_roi}}
                            </div>
                        </template>  
                    </el-table-column>
                    <el-table-column label="有效ROI" prop="vaild_roi"  >
                        <template #default="scope">
                            <div :style="{color:scope.row.vaild_roi>=1?'green':'red'}">
                                {{scope.row.vaild_roi}}
                            </div>
                        </template>  
                    </el-table-column>
                    <el-table-column label="不包回流ROI" prop="no_next_roi"  width="110"  >
                        <template #default="scope">
                            <div :style="{color:scope.row.no_next_roi>=1?'green':'red'}">
                                {{scope.row.no_next_roi}}
                            </div>
                        </template>  
                    </el-table-column>
                    <el-table-column label="客单价" prop="kedan_total"  sortable  width="110"  />
                    <el-table-column label="退款订单" prop="refund_order_num"  sortable  width="120" />
                    <el-table-column label="展示量 " prop="show"  />
                    <el-table-column label="点击量" prop="click"  />
                    <el-table-column label="转化量" prop="convert"  />
                    <el-table-column label="点击率" prop="ctr"  />
                    <el-table-column label="转化率" prop="convert_rate"  />
                    <el-table-column label="千展费用" prop="avg_show_cost"    width="120" />
                    <el-table-column label="转化成本" prop="convert_cost"   width="120"  />
                    <el-table-column label="播放次数" prop="total_play"  width="120"   />
                    <el-table-column label="有效播次数" prop="valid_play"   width="120"  />
                    <el-table-column label="有效播放率" prop="valid_play_rate"  width="120"   />
                    <el-table-column label="有效播放成本" prop="valid_play_cost"   width="130"  />
                    <el-table-column label="操作" align="left" fixed="right" width="120">
                    <template #default="scope">
                        <el-button
                            type="primary"
                            :icon="View"
                            size="small"
                            @click="editRole1(scope.row)"
                        >计划数据</el-button>
                    </template>
                </el-table-column>
                </el-table>
            
                <!-- 分页工具条 -->
                <pagination
                v-if="total1 > 0"
                :total="total1"
                v-model:page="queryParams1.page"
                v-model:limit="queryParams1.pageSize"
                :layout="layout"
                :page-sizes="[15,30,50,100]"
                @pagination="handleQuery1"
                />

            </el-tab-pane>
            <el-tab-pane label="日期维度" name="third">
                     <!-- 搜索表单 -->
                <el-form ref="queryFormRef2" :model="queryParams2" label-width="120px" :inline="true">
                <el-form-item label='开始日期' prop="date_start">
                    <el-date-picker
                        v-model="queryParams2.date_start"
                        value-format="YYYY-MM-DD"
                        placeholder="开始日期"
                        type="date"
                        @change="handleQuery2"
                    />
                </el-form-item>
                <el-form-item label='结束日期' prop="date_end">
                    <el-date-picker
                        v-model="queryParams2.date_end"
                        value-format="YYYY-MM-DD"
                        placeholder="结束日期"
                        type="date"
                        @change="handleQuery2"
                    />
                </el-form-item>
                </el-form>
            
                <!-- 数据表格 -->
                <el-table
                :data="permList2"
                v-loading="loading2"
                :summary-method="getSummaries"
                height="750"
                stripe
                show-summary
                border
                >
                    <el-table-column label="日期" prop="date" show-overflow-tooltip fixed min-width="150" />
                    <el-table-column label="消耗" prop="cost" sortable  />
                    <el-table-column label="不包回流总订单流水" prop="tb_order_total" sortable/>
                    <el-table-column label="有效销售额" prop="tb_valid_order_total" sortable   />
                    <el-table-column label="回流销售额" prop="tb_next_order_total" sortable     />
                    <el-table-column label="总ROI" prop="total_roi"  sortable   >
                        <template #default="scope">
                            <div :style="{color:scope.row.total_roi>=1?'green':'red'}">
                                {{scope.row.total_roi}}
                            </div>
                        </template>  
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- <el-tab-pane label="Task" name="fourth">Task</el-tab-pane> -->
        </el-tabs>
    
    
        <!-- 表单弹窗 -->
        <el-dialog :title="dialog.title" v-model="dialog.visible" 
        width="80%"  custom-class="large_dialog"
        @close="dialog_queryParams.page=1"
        >
            <!-- 数据表格 -->
            <el-table
            :data="dialog_permList"
            v-loading="dialog_loading"
            show-summary
            border
            >
                <el-table-column label="时间段" prop="date" width="160" />
                <el-table-column label="消耗" prop="cost"  />
                <el-table-column label="客单价" prop="kedan_total"  />
                <el-table-column label="总销售额" prop="total_amount"  />
                <el-table-column label="不包回流总订单流水" prop="tb_order_total"  />
                <el-table-column label="已归因订单量" prop="tb_order_num"  />
                <el-table-column label="已上报订单量" prop="tb_convert_num"  />
                <el-table-column label="有效销售额" prop="tb_valid_order_total"  />
                <el-table-column label="回流销售额" prop="tb_next_order_total"  />
                <el-table-column label="总ROI" prop="total_roi"  >
                    <template #default="scope">
                        <div :style="{color:scope.row.total_roi>=1?'green':'red'}">
                            {{scope.row.total_roi}}
                        </div>
                    </template>  
                </el-table-column>
                <el-table-column label="有效ROI" prop="vaild_roi"  >
                    <template #default="scope">
                        <div :style="{color:scope.row.vaild_roi>=1?'green':'red'}">
                            {{scope.row.vaild_roi}}
                        </div>
                    </template>  
                </el-table-column>
                <el-table-column label="不包回流ROI" prop="no_next_roi"  >
                    <template #default="scope">
                        <div :style="{color:scope.row.no_next_roi>=1?'green':'red'}">
                            {{scope.row.no_next_roi}}
                        </div>
                    </template>  
                </el-table-column>
                <el-table-column label="展示量" prop="show"   />
                <el-table-column label="点击量" prop="click" />
                <el-table-column label="转化量" prop="convert"    />
                <el-table-column label="点击率" prop="ctr"    />
                <el-table-column label="转化率" prop="convert_rate"    />
                <el-table-column label="千展成本" prop="avg_show_cost"    />
                <el-table-column label="转化成本" prop="convert_cost"    />
            </el-table>
        
            <!-- 分页工具条 -->
            <pagination
            v-if="total > 0"
            :total="dialog_total"
            v-model:page="dialog_queryParams.page"
            v-model:limit="dialog_queryParams.pageSize"
            :layout="layout"
            :page-sizes="[15,30,50,100]"
            @pagination="handleDialogQuery"
            />
        </el-dialog>

          <!-- 表单弹窗 -->
          <el-dialog :title="dialog1.title" v-model="dialog1.visible" 
        width="80%"  custom-class="large_dialog"
        @close="dialog_queryParams1.page=1"
        >
            <!-- 数据表格 -->
            <el-table
            :data="dialog_permList1"
            v-loading="dialog_loading1"
            show-summary
            border
            >
            <el-table-column label="计划名称" prop="name" show-overflow-tooltip fixed min-width="250" />
                <el-table-column label="计划(投放 )" prop="status"   width="100" />
                <el-table-column label="出价类型" prop="pricing"   width="150" />
                <el-table-column label="预算" prop="budget"   width="100"  />
                <el-table-column label="消耗" prop="cost" sortable  />
                <el-table-column label="总销售额" prop="total_amount"  sortable  width="110" />
                <el-table-column label="不包回流总订单流水" prop="tb_order_total"  sortable  width="180" />
                <el-table-column label="已归因订单量" prop="tb_order_num" sortable   width="150" />
                <el-table-column label="已上报订单量" prop="tb_convert_num"  sortable  width="150" />
                <el-table-column label="有效销售额" prop="tb_valid_order_total"  sortable  width="130" />
                <el-table-column label="回流销售额" prop="tb_next_order_total"  sortable  width="130" />
                <el-table-column label="总ROI" prop="total_roi"  sortable  width="110" >
                    <template #default="scope">
                        <div :style="{color:scope.row.total_roi>=1?'green':'red'}">
                            {{scope.row.total_roi}}
                        </div>
                    </template>  
                </el-table-column>
                <el-table-column label="有效ROI" prop="vaild_roi"  >
                    <template #default="scope">
                        <div :style="{color:scope.row.vaild_roi>=1?'green':'red'}">
                            {{scope.row.vaild_roi}}
                        </div>
                    </template>  
                </el-table-column>
                <el-table-column label="不包回流ROI" prop="no_next_roi"   width="130" >
                    <template #default="scope">
                        <div :style="{color:scope.row.no_next_roi>=1?'green':'red'}">
                            {{scope.row.no_next_roi}}
                        </div>
                    </template>  
                </el-table-column>
            </el-table>
        
            <!-- 分页工具条 -->
            <pagination
            v-if="dialog_total1 > 0"
            :total="dialog_total1"
            v-model:page="dialog_queryParams1.page"
            v-model:limit="dialog_queryParams1.pageSize"
            :layout="layout"
            :page-sizes="[15,30,50,100]"
            @pagination="handleDialogQuery1"
            />
        </el-dialog>

      </div>
    </template>
    
    <style lang="scss" scoped>
    .component-container {
      box-sizing: border-box;
    }
    </style>
    