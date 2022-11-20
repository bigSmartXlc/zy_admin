<template>
   <el-form ref="queryFormRef" label-width="70px" :model="queryParams" :inline="true">
      <el-form-item label='开始日期' prop="date_start">
          <el-date-picker
              v-model="queryParams.date_start"
              value-format="YYYY-MM-DD"
              placeholder="开始日期"
              type="date"
              @change="handleQuery(false)"
          />
      </el-form-item>
      <el-form-item label='结束日期' prop="date_end">
          <el-date-picker
              v-model="queryParams.date_end"
              value-format="YYYY-MM-DD"
              placeholder="结束日期"
              type="date"
              @change="handleQuery(false)"
          />
      </el-form-item>
      <el-form-item prop="search" label="搜索">
        <el-input
          v-model="queryParams.tt_ad_search"
          placeholder="计划id、广告id、计划名称"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item prop="type" label="时间抽选择">
        <el-switch
          v-model="queryParams.type"
          inline-prompt
          active-text="小时"
          inactive-text="天"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery(false)"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <div :id="id" :class="className" :style="{ height, width }" />
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" id="tabs">
        <el-tab-pane label="今日计划排行榜" name="first">
            <!-- 数据表格 -->
            <el-table
              :data="permList"
              v-loading="loading"
              :summary-method="getSummaries"
              show-summary
              :default-sort="{ prop: 'cost', order: 'descending' }"
              border
            >
              <el-table-column label="计划名称" prop="name" show-overflow-tooltip fixed min-width="200" />
              <el-table-column label="状态(投放 )" prop="status"   width="100" />
              <el-table-column label="消耗" prop="cost" sortable>
                  <template #default="scope">
                      <div :style="{color:'#00aff0'}">
                          {{scope.row.cost}}
                      </div>
                  </template>  
              </el-table-column>
              <el-table-column label="环比昨日消耗" prop="per_cost" sortable width="150">
                  <template #default="scope">
                      <div :style="{color:parsentSort(scope.row.per_cost,0)?'green':'red'}">
                          {{scope.row.per_cost}}
                      </div>
                  </template>  
              </el-table-column>
              <el-table-column label="有效销售额" prop="tb_valid_order_total" sortable width="120">
                  <template #default="scope">
                      <div :style="{color:'#00aff0'}">
                          {{scope.row.tb_valid_order_total}}
                      </div>
                  </template>  
              </el-table-column>
              <el-table-column label="环比昨日有效销售额" prop="per_vaild"  sortable  width="180">
                  <template #default="scope">
                      <div :style="{color:parsentSort(scope.row.per_vaild,0)?'green':'red'}">
                          {{scope.row.per_vaild}}
                      </div>
                  </template>  
              </el-table-column>
              <el-table-column label="不包回流总订单流水" prop="tb_order_total" sortable  width="180">
                  <template #default="scope">
                      <div :style="{color:'#00aff0'}">
                          {{scope.row.tb_order_total}}
                      </div>
                  </template>  
              </el-table-column>
              <el-table-column label="已归因订单量" prop="tb_order_num" sortable  width="140"/>
              <el-table-column label="已上报订单量" prop="tb_convert_num"  sortable width="140"/>
              <el-table-column label="回流销售额" prop="tb_next_order_total"  sortable  width="120"/>
              <el-table-column label="有效ROI" prop="vaild_roi"  >
                  <template #default="scope">
                      <div :style="{color:scope.row.vaild_roi>=1?'green':'red'}">
                          {{scope.row.vaild_roi}}
                      </div>
                  </template>  
              </el-table-column>
              <el-table-column label="不包回流ROI" prop="no_next_roi"   width="110">
                  <template #default="scope">
                      <div :style="{color:scope.row.no_next_roi>=1?'green':'red'}">
                          {{scope.row.no_next_roi}}
                      </div>
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
            @pagination="handleQuery(true)"
            />
        </el-tab-pane>
        <!-- <el-tab-pane label="Config" name="second">Config</el-tab-pane>
        <el-tab-pane label="Role" name="third">Role</el-tab-pane>
        <el-tab-pane label="Task" name="fourth">Task</el-tab-pane> -->
    </el-tabs>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  toRefs,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
} from 'vue';
import { init, EChartsOption } from 'echarts';
import { Search} from '@element-plus/icons-vue';
import { ElForm} from 'element-plus';
import { parseTime } from '@/utils'; 
import * as echarts from 'echarts';
import {
  getIndexData
    } from '@/api/report';
import resize from '@/utils/resize';
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

const queryFormRef = ref(ElForm);
const props = defineProps({
  id: {
    type: String,
    default: 'linechart',
  },
  className: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '50vh',
  },
});
const state = reactive({
  queryParams:{
    tt_ad_search:'',
    date_start:parseTime(new Date(),'{y}-{m}-{d}'),
    date_end:parseTime(new Date(),'{y}-{m}-{d}'),
    page:1,
    pageSize:15
  } as any,
  activeName:'first',
  permList:[],
  loading:false,
  total:0,
  xData:[] as any,
  yData1:[] as any,
  yData2:[] as any,
  yData3:[] as any
})
const {
      loading,
      permList,
      total,
      activeName,
      queryParams,
    } = toRefs(state);
const layout = 'total, prev, pager, next'    
const { mounted, chart, beforeDestroy, activated, deactivated } = resize();
//首页数据查询
const emit = defineEmits(['queryList']);
//百分比数比较
function parsentSort(val1:any,val2:any){
  return Number((val1+'').replace("%",""))>val2 
}
//查询
function handleQuery(isPage:boolean){
  getIndexData(state.queryParams).then(res=>{
    if(!isPage){
      emit('queryList',res.data.todayStats)
      handleEchartsData(res.data.statsTendency.defaultTimeStatsArr)
    }
    var listjson = JSON.parse(JSON.stringify(res.data.todayAdReport.data))
    var dataList=[] as any
    listjson.forEach((item:any) => {
      dataList.push({...item,...item.priceStats})
    });
    state.permList=dataList
    state.total = res.data.todayAdReport.total;
    state.loading = false;
  })
}
//图表数据处理
function handleEchartsData(obj:any){
  state.xData= Object.keys(obj)
  const allData=Object.values(obj)
  state.yData1=[]
  state.yData2=[]
  state.yData3=[]
  allData.forEach((item:any)=>{
    state.yData1.push(item.cost)
    state.yData2.push(item.tb_valid_order_total)
    state.yData3.push(item.vaild_roi)
  })
  initChart();
}
//tab切换
function handleClick(){}
// 初始化图表
function initChart() {
  const barChart = init(document.getElementById(props.id) as HTMLDivElement);
  const option = {
    color:['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['消耗', '有效销售额', 'ROI']
  },
  toolbox: {
    right:40,
    feature: {
      saveAsImage: {
        title:'保存图片'
      },
      dataView:{
        title:'数据视图'
      },
      magicType: {
        type: ['line', 'bar'],
        title:{
          line:'切换为折线图',
          bar:"切换为柱状"
        }
    }
    },
    iconStyle:{
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: state.xData
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '消耗',
      type: 'line',
      areaStyle: {},
      smooth: true,
      emphasis: {
        focus: 'series'
      },
      data: state.yData1
    },
    {
      name: '有效销售额',
      type: 'line',
      areaStyle: {},
      smooth: true,
      emphasis: {
        focus: 'series'
      },
      data: state.yData2
    },
    {
      name: 'ROI',
      type: 'line',
      smooth: true,
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: state.yData3
    }
  ]
};
  barChart.setOption(option as EChartsOption);
  chart.value = barChart;
}

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

onBeforeUnmount(() => {
  beforeDestroy();
});

onActivated(() => {
  activated();
});

onDeactivated(() => {
  deactivated();
});

onMounted(() => {
  // mounted();
  nextTick(() => {
    handleQuery(false)
  });
});
</script>
<style>
  .demo-tabs{
    margin-top: 20px;
  }
</style>