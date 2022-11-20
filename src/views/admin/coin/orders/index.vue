<script lang="ts">
export default {
  name: 'orders',
};
</script>

<script setup lang="ts">
// Vue依赖
import { onMounted, reactive, ref, toRefs } from 'vue';

// API依赖
import {
  getDeptForrmData,
  deleteDept,
  updateDept,
  addDept,
  listSelectDepartments,
  listDepartments,
} from '@/api/system/dept';

// 组件依赖
import { Search, Plus, Edit, Refresh, Delete } from '@element-plus/icons-vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import {
  DeptFormData,
  DeptItem,
  DeptQueryParam,
} from '@/types/api/system/dept';
import { Dialog, Option } from '@/types/common';
console.log(ElForm);

// DOM元素的引用声明定义
const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const state = reactive({
  // 选中ID数组
  ids: [] as number[],
  // 非单个禁用
  single: true,
  loading: false,
  // 表格树数据
  deptList: [] as DeptItem[],
  // 订单下拉选项
  deptOptions: [] as Option[],
  // 弹窗属性
  dialog: { visible: false } as Dialog,
  // 查询参数
  queryParams: {} as DeptQueryParam,
  // 表单数据
  formData: {
    sort: 1,
    status: 1,
  } as DeptFormData,
  // 表单参数校验
});

const {
  single,
  loading,
  deptList,
  deptOptions,
  queryParams,
  formData,
  dialog,
} = toRefs(state);

/**
 * 订单查询
 */
function handleQuery() {
  state.loading = true;
  listDepartments(state.queryParams).then(({ data }) => {
    state.deptList = data;
    state.loading = false;
  });
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}
onMounted(() => {
  // handleQuery();
});
</script>
<template>
  <div class="app-container">
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-form-item prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入订单名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="订单状态"
          clearable
        >
          <el-option :value="1" label="正常" />
          <el-option :value="0" label="禁用" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          :icon="Search"
          @click="handleQuery"
        >
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="resetQuery"> 重置 </el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="订单号" />
      <el-table-column prop="name" label="交易单号" />
      <el-table-column prop="name" label="用户类型" />
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="name" label="平台币数量" />
      <el-table-column prop="name" label="充值平台" />
      <el-table-column prop="name" label="支付金额" />
      <el-table-column prop="name" label="订单原价" />
      <el-table-column prop="name" label="创建时间" />
      <el-table-column prop="name" label="支付时间" />
      <el-table-column prop="name" label="支付IP" />
      <el-table-column prop="name" label="状态" />
    </el-table>

  </div>
</template>
