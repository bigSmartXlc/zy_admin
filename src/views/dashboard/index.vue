<script lang="ts">
export default { name: 'Dashboard' };
</script>

<script setup lang="ts">
// 组件引用
import Line from './components/Chart/line.vue';
import {
  ref,
} from 'vue';
const indexData=ref({
  adIncrNum:0,
  adStatusNum:0,
  bindNum:0,
  convertNum:0,
  cost:{data: 0, per: 0},
  nextTotal:{data: 0, per: 0},
  totalRoi
  : 
  {data: 0, per: 0},
  validTotal
  : 
  {data: 0, per: 0},
}) as any
function setItem(val:object){
  indexData.value=val
}
</script>

<template>
  <div class="dashboard-container">
    <!-- <github-corner class="github-corner" /> -->
    <!-- 数据 -->
    <el-card>
      <template #header>
        <span>今日数据概况</span>
      </template>
      <el-row :gutter="40" class="card-panel__col">
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              消耗
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{indexData.cost.data}}</div>
              <div class="card-panel-num">{{indexData.cost.per}}</div>
            </div>
          </div>
        </el-col>
  
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              有效销售额
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{indexData.validTotal.data}}</div>
              <div class="card-panel-num">{{indexData.validTotal.per}}</div>
            </div>
          </div>
        </el-col>
  
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-money">
              回流销售额
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{indexData.nextTotal.data}}</div>
              <div class="card-panel-num">{{indexData.nextTotal.per}}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-shopping">
              总ROI
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{indexData.totalRoi.data}}</div>
              <div class="card-panel-num">{{indexData.totalRoi.per}}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              归因订单量
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{indexData.bindNum}}</div>
              <div class="card-panel-num"></div>
            </div>
          </div>
        </el-col>
  
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              上报转化量
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{indexData.convertNum}}</div>
              <div class="card-panel-num"></div>
            </div>
          </div>
        </el-col>
  
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-money">
              新增广告数
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{indexData.adIncrNum}}</div>
              <div class="card-panel-num"></div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-shopping">
              新增在投计划数
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{indexData.adStatusNum}}</div>
              <div class="card-panel-num"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- Echarts 图表 -->
    <el-row :gutter="40" style="margin-top: 20px">
      <el-card style="width: 100%;margin:0 20px">
        <template #header>
          <span>数据趋势</span>
        </template>
        <Line style="width:90%;height:50vh" @queryList='setItem'/>
      </el-card>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  @media (max-width: 550px) {
    .dashboard-container {
      padding: 0 !important;
  }
}
.dashboard-container {
  background-color: rgb(240, 242, 245);
  position: relative;
  padding: 20px;
  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
    z-index: 99;
  }

  .box-center {
    margin: 0 auto;
    display: table;
  }

  .card-panel__col {
    margin-bottom: 12px;
    .card-panel-icon-wrapper{
      padding: 12px;
      font-size: 16px;
    }
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.10);
    border-color: rgba(0, 0, 0, 0.05);
    .card-panel-description {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      margin: 16px 20px 0;
      .card-panel-text {
        line-height: 18px;
        font-style: normal;
        font-size: 30px;
        font-weight: 300;
        color: #009688;
        margin-bottom: 12px;
      }

      .card-panel-num {
        color: red;
      }
    }
  }

  .chart-container {
    background: #ffffff;
  }
}
</style>
