<script lang="ts">
export default {
  name: 'spkg',
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
  // 子包下拉选项
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
  rules: {
    parentId: [
      { required: true, message: '上级子包不能为空', trigger: 'blur' },
    ],
    name: [{ required: true, message: '子包名称不能为空', trigger: 'blur' }],
    sort: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
  },
});

const {
  single,
  loading,
  deptList,
  deptOptions,
  queryParams,
  formData,
  rules,
  dialog,
} = toRefs(state);

/**
 * 子包查询
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

function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: any) => item.id);
  state.single = selection.length === 0;
}

/**
 * 加载子包下拉数据源
 */
async function loadDeptData() {
  const deptOptions: any[] = [];
  listSelectDepartments().then((response) => {
    const rootDeptOption = {
      value: '0',
      label: '子包',
      children: response.data,
    };
    deptOptions.push(rootDeptOption);
    state.deptOptions = deptOptions;
  });
}

/**
 * 添加子包
 */
function handleAdd(row: any) {
  // loadDeptData();
  state.formData.id = undefined;
  state.formData.parentId = row.id;
  state.dialog = {
    title: '添加子包',
    visible: true,
  };
}

/**
 * 修改子包
 */
async function handleUpdate(row: any) {
  await loadDeptData();
  const deptId = row.id || state.ids;
  state.dialog = {
    title: '修改子包',
    visible: true,
  };
  getDeptForrmData(deptId).then((response: any) => {
    state.formData = response.data;
  });
}

/**
 * 子包表单提交
 */
function submitForm() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      if (state.formData.id) {
        updateDept(state.formData.id, state.formData).then(() => {
          ElMessage.success('修改成功');
          cancel();
          handleQuery();
        });
      } else {
        addDept(state.formData).then(() => {
          ElMessage.success('新增成功');
          cancel();
          handleQuery();
        });
      }
    }
  });
}

/**
 * 删除子包
 *
 * @param row
 */
function handleDelete(row: any) {
  const ids = [row.id || state.ids].join(',');
  ElMessageBox.confirm(`确认删除已选中的数据项?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteDept(ids)
        .then(() => {
          handleQuery();
          ElMessage.success('删除成功');
        })
        .catch(() => {
          console.log(`删除失败`);
        });
    })
    .catch(() => ElMessage.info('已取消删除'));
}

/**
 * 取消/关闭弹窗
 **/
function cancel() {
  dataFormRef.value.resetFields();
  state.dialog.visible = false;
}

onMounted(() => {
  // handleQuery();
});
</script>
<template>
  <div class="app-container">
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-form-item>
        <el-button type="success" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button
          type="danger"
          :icon="Refresh"
          :disabled="single"
          @click="handleDelete"
          >刷新</el-button>
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="项目"
          clearable
        >
          <el-option :value="1" label="正常" />
          <el-option :value="0" label="禁用" />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="游戏"
          clearable
        >
          <el-option :value="1" label="正常" />
          <el-option :value="0" label="禁用" />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="渠道"
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="name" label="渠道" />
      <el-table-column prop="name" label="代理等级" />
      <el-table-column prop="name" label="游戏" />
      <el-table-column prop="name" label="渠道子包kgid" />
      <el-table-column prop="name" label="包名" />
      <el-table-column prop="name" label="支付" />
      <el-table-column prop="name" label="注册" />
      <el-table-column prop="name" label="分成比例" />
      <el-table-column prop="name" label="H5游戏链接" />
      <el-table-column prop="name" label="创建时间" />
      <el-table-column prop="name" label="更新时间" />
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            circle
            plain
            @click.stop="handleUpdate(scope.row)"
          >
          </el-button>
          <el-button
            type="success"
            :icon="Plus"
            circle
            plain
            @click.stop="handleAdd(scope.row)"
          >
          </el-button>

          <el-button
            type="danger"
            :icon="Delete"
            circle
            plain
            @click.stop="handleDelete(scope.row)"
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改子包对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="600px"
      @closed="cancel"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="上级子包" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            placeholder="选择上级子包"
            :data="deptOptions"
            filterable
            check-strictly
          />
        </el-form-item>
        <el-form-item label="子包名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入子包名称" />
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            controls-position="right"
            style="width: 100px"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="子包状态">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm"> 确 定 </el-button>
          <el-button @click="cancel"> 取 消 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
