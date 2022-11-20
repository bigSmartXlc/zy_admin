<script setup lang="ts">
    import {
      onMounted,
      reactive,
      ref,
      toRefs,
      nextTick
    } from 'vue';
    
    import {
        getProductList,
        createProductList,
        editProductList,
        destroyProductList
    } from '@/api/product';
    import { Search, Plus, Edit, Refresh, Delete,View } from '@element-plus/icons-vue';
    
    import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
    import { Dialog} from '@/types/common';
    import { copy } from '@/utils'; 
    const queryFormRef = ref(ElForm);
    const dataFormRef = ref(ElForm);
    const layout = 'total, prev, pager, next'
    const state = reactive({
      loading: true,
      queryParams: {
        search:'',
        page: 1,
        pageSize: 15,
      },
      formData:{
        id:'',
        tb_product_name:'',
        tb_product_id:'',
        mini_name:'',
      },
      rules:{
          tb_product_name: [{ required: true, message: '请输入商品名称名称', trigger: 'blur' }],
          tb_product_id: [{ required: true, message: '请输入商品ID', trigger: 'blur' }],
          mini_name: [{ required: true, message: '请选择来源', trigger: 'blur' }],
      },
      mini_options:{},
      permList: [] as any,
      total: 0,
      dialog: {
        visible: false,
        title:''
      } as Dialog,
      edit_permission_selected_row:[] as any,
    });
    const {
      loading,
      permList,
      total,
      rules,
      dialog,
      queryParams,
      mini_options,
      formData
    } = toRefs(state);
    const disabled=ref(true)
    // 多选
    function handleSelectionChange(val:any){
      disabled.value=val.length>0?false:true
        state.edit_permission_selected_row = val
    }
    // 新增角色弹框
    function addAccount(){
         state.dialog = {
        title:'新增商品',
        visible:true
      }
    }
    //编辑
    function handleEdit(row:any){
        state.dialog = {
            title:'编辑商品',
            visible:true
        }
        nextTick(()=>{
            const {id,productId,productName,tbMiniKey} = row
            state.formData={
                id,
            tb_product_name:productName,
            tb_product_id:productId,
            mini_name:tbMiniKey,
            }
        })
        
    }
    //新增修改
    function submitForm() {
        dataFormRef.value.validate((isValid: any) => {
            if (isValid) {
            if (state.dialog.title=='编辑商品') {
                editProductList(state.formData.id, state.formData).then((res) => {
                ElMessage.success('修改成功');
                cancel();
                handleQuery();
                });
            } else {
                createProductList(state.formData).then(() => {
                ElMessage.success('新增成功');
                cancel();
                handleQuery();
                });
            }
            }
        });
    }
    //关闭并重置弹框
    function resetForm() {
        dataFormRef.value.resetFields();
    }

    function cancel() {
        resetForm();
        state.dialog.visible = false;
    }
    // 查询
    function handleQuery() {
        state.loading = true;
        getProductList(state.queryParams).then((res) => {
          var data = res.data
          var listjson = JSON.parse(JSON.stringify(data.list.data) )
          state.permList = listjson;
          state.total = data.list.total;
          state.loading = false;
          state.mini_options = data.miniSelects
        });
    }
    //查询重置
    function resetQuery() {
      queryFormRef.value.resetFields();
      handleQuery();
    }

    //删除
    function handleDelete(major_ids: any) {
      ElMessageBox.confirm('确认删除当前商品?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
            destroyProductList(major_ids).then(() => {
            ElMessage.success('删除成功');
            handleQuery();
          });
        })
        .catch(() => ElMessage.info('已取消删除'));
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
              >新增商品</el-button
            >
          </el-form-item>
          <el-form-item prop="search">
            <el-input
              v-model="queryParams.search"
              placeholder="商品信息"
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
          <el-table-column label="商品名称" prop="productName"  />
          <el-table-column label="商品ID" prop="productId"  />
          <el-table-column label="小程序" prop="tbMiniName"  />
          <el-table-column label="巨量直达链接" >
            <template #default="scope">
                <el-button
                type="primary"
                size="small"
                text
                @click="copy(scope.row.oceanengineConvertUrl)"
                >点击复制</el-button
                >
            </template>
        </el-table-column>
          <el-table-column label="巨量检测链接">
            <template #default="scope">
                <el-button
                type="primary"
                size="small"
                text
                @click="copy(scope.row.oceanengineListenUrl)"
                >点击复制</el-button
                >
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createdAt"  />
          <el-table-column label="操作" align="left">
            <template #default="scope">
                 <el-button
                    type="primary"
                    :icon="Edit"
                     size="small"
                    @click="handleEdit(scope.row)"
                >编辑</el-button>
                 <el-button
                    type="danger"
                     size="small"
                    :icon="Delete"
                    @click="handleDelete(scope.row.id)"
                >删除</el-button>
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
            <el-dialog :title="dialog.title" v-model="dialog.visible"  custom-class="width_class" @close="cancel">
                <el-form
                ref="dataFormRef"
                :model="formData"
                :rules="rules"
                label-width="80px"
            >
                <el-form-item label="商品名称" prop="tb_product_name">
                <el-input v-model="formData.tb_product_name" placeholder="" />
                </el-form-item>
                <el-form-item label="商品ID" prop="tb_product_id">
                <el-input v-model="formData.tb_product_id" placeholder="" />
                </el-form-item>
                <el-form-item label="小程序" prop="mini_name">
                    <el-select
                    v-model="formData.mini_name"
                    clearable
                    >
                    <el-option
                        v-for="(value,  key) in mini_options"
                        :key="value"
                        :value="key"
                        :label="value"
                    />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
      </div>
    </template>
    
    <style lang="scss" scoped>
    .component-container {
      box-sizing: border-box;
    }
    </style>
    