<script setup lang="ts">
    import {
      onMounted,
      reactive,
      ref,
      toRefs,
    } from 'vue';
    
    import {
      listUserPages,
      getCompanyParts,
      addUser,
      updateUsername,
      updateUserphone,
      updateUserPass,
      deleteUsers,
      disableUsers,
      enableUsers
    } from '@/api/system/user';
    import { Open, TurnOff,Search, Plus, Edit, Refresh, Delete,View } from '@element-plus/icons-vue';
    
    import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
    import { Dialog, Option } from '@/types/common';
    
    import {
      PermItem,
    } from '@/types/api/system/perm';
    const queryFormRef = ref(ElForm);
    const dataFormRef = ref(ElForm);
    const layout = 'total, prev, pager, next'
    //密码验证
    const validatePass2 = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请确认密码'))
      } else if (value !== state.formData.password) {
        callback(new Error("两次输入的密码不相同"))
      } else {
        callback()
      }
    }
    const validatePass=(rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请确认密码'))
      } else if (value !== state.formData_pass.new) {
        callback(new Error("两次输入的密码不相同"))
      } else {
        callback()
      }
    }
    const state = reactive({
      loading: true,
      queryParams: {
        search:'',
        page: 1,
        pageSize: 15,
      },
      permList: [] as PermItem[],
      total: 0,
      dialog: {
        visible: false,
      } as Dialog,
       resetPass: {
        visible: false,
        title:''
      } as Dialog,
      formData: {
        name:'',
        password:'',
        confirm:'',
        nickname:'',
        organ_id:'',
        mobile:'',
        company_id:''
      } as any,
      formData_pass: {
        original:'',
        confirm:'',
        new:''
      } as any,
      rules_pass:{
        original:[{ required: true, message: '请输入原密码', trigger: 'blur' }],
        new: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirm: [{ validator: validatePass, trigger: 'blur' }],
      },
      rules: {
        name: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        company_id: [{ required: true, message: '请选择公司', trigger: 'blur' }],
        organ_id: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirm: [{ validator: validatePass2, trigger: 'blur' }],
      },
      selected_row:{} as any,
    });
    const companies = ref([]) as any
    const {
      loading,
      permList,
      total,
      dialog,
      resetPass,
      formData,
      formData_pass,
      rules_pass,
      rules,
      queryParams,
    } = toRefs(state);
    const cParts = ref([]) as any

    // 查询
    function handleQuery() {
        state.loading = true;
        listUserPages(state.queryParams).then((res) => { 
          var data = res.data
          var listjson = JSON.parse(JSON.stringify(data.list.data) )
          state.permList = listjson;
          state.total = data.list.total;
          state.loading = false;
          companies.value = data.companies
        });
    }

    //根据公司查询部门
    function handleCompanyChange(){
      getCompanyParts(state.formData.company_id).then(res=>{
        cParts.value=[]
        digui(res.data)
        state.formData.organ_id=''
      })
    }
    //部门数据递归
    function digui(array:any){
      array.forEach((item:any) => {
        cParts.value.push({id:item.id,name:item.text})
        if(item.children.length>0){
          digui(item.children)
        }
      });
    }
    // 新增账号
    function addrole(){
         state.dialog = {
        title:'新增账号',
        visible:true
      }
    }


    //修改名称
    function editNickName(id:number){
      ElMessageBox.prompt('请输入新的用户名', '修改用户名', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
        .then(({ value }) => {
          updateUsername(id,{nickname:value}).then(()=>{
            handleQuery()
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消修改',
          })
        })
    }

     //修改手机号
     function editMobile(id:number){
      ElMessageBox.prompt('请输入新的手机号', '修改手机号', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
        .then(({ value }) => {
          updateUserphone(id,{mobile:value}).then(()=>{
            handleQuery()
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消修改',
          })
        })
    }


    //查询重置
    function resetQuery() {
      queryFormRef.value.resetFields();
      handleQuery();
    }



    //修改账号状态
    function switchStatus(id:number, status:number){
       if(status==0){
        disableUsers(id).then(res=>{
          ElMessage.success('已停用');
          handleQuery()
        })
       }else{
        enableUsers(id).then(res=>{
          ElMessage.success('已启用');
          handleQuery()
        })
       }
    }


    //新增
    function submitForm() {
      dataFormRef.value.validate((isValid: any) => {
        if (isValid) {
            addUser(state.formData).then(() => {
              ElMessage.success('新增成功');
              cancel();
              handleQuery();
            });
          }
      });
    }
    
    //重置密码
    function resetPassword(row:object){
      state.selected_row = row
      state.resetPass={
        visible:true,
        title:'重置密码'
      }
    }
    //重置密码提交
    function handleReset(){
      updateUserPass(state.selected_row.id,formData_pass.value).then(res=>{
        ElMessage.success('修改成功');
        state.resetPass.visible = false
        handleQuery();
      })
    }
    /**
     * 编辑新增重置表单
     */
    function resetForm() {
      dataFormRef.value.resetFields();
    }
    
    function cancel() {
      resetForm();
      state.dialog.visible = false;
    }
    
    //删除
    function handleDelete(row: any) {
      ElMessageBox.confirm('确认删除当前账号?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteUsers(row.id).then(() => {
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
              @click="addrole"
              >新增账号</el-button
            >
          </el-form-item>
          <el-form-item prop="search">
            <el-input
              v-model="queryParams.search"
              placeholder="账号名称..."
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
          <el-table-column label="登录名称" prop="loginName"  />
          <el-table-column label="所属公司" prop="company"  />
          <!-- <el-table-column label="用户姓名" prop="nickName"  /> -->
          <el-table-column label="用户名" >
            <template #default="scope">
              {{scope.row.nickName}}
              <el-tooltip
                class="box-item"
                effect="dark"
                content="修改"
                placement="top-start"
              >
              <el-icon  color="#409EFC" :size="20" class="table_column_icon" @click="editNickName(scope.row.id)">
                <Edit />
              </el-icon>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="组织机构" prop="organName"  />
          <el-table-column label="手机号" >
            <template #default="scope">
              {{scope.row.mobile}}
              <el-tooltip
                class="box-item"
                effect="dark"
                content="修改"
                placement="top-start"
              >
              <el-icon  color="#409EFC" :size="20" class="table_column_icon" @click="editMobile(scope.row.id)">
                <Edit />
              </el-icon>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createdAt"  />
          <el-table-column label="状态" prop="status"  />
          <el-table-column label="操作" align="left" width="400">
            <template #default="scope">
                 <el-button
                    type="primary"
                    :icon="Edit"
                     size="small"
                    @click="resetPassword(scope.row)"
                >重置密码</el-button>
                 <el-button
                    v-show="scope.row.status=='正常'"
                    type="warning"
                    :icon="TurnOff"
                     size="small"
                    @click="switchStatus(scope.row.id,0)"
                >禁用</el-button>
                 <el-button
                    v-show="scope.row.status!='正常'"
                    type="success"
                    :icon="Open"
                     size="small"
                    @click="switchStatus(scope.row.id,1)"
                >启用</el-button>
                 <el-button
                    type="danger"
                     size="small"
                    :icon="Delete"
                    @click="handleDelete(scope.row)"
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
        <el-dialog :title="dialog.title" v-model="dialog.visible" custom-class="width_class">
          <el-form
            ref="dataFormRef"
            :model="formData"
            :rules="rules"
            label-width="120px"
          >
            <el-form-item label="登录名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入登录名称" />
            </el-form-item>
             <el-form-item label="用户名" prop="nickname">
              <el-input v-model="formData.nickname" placeholder="" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="formData.mobile" placeholder="" />
            </el-form-item>
            <el-form-item label="公司" prop="company_id">
              <el-select
                v-model="formData.company_id"
                @change="handleCompanyChange"
                clearable
              >
                <el-option
                v-for="item in companies"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          <el-form-item label="部门" prop="organ_id">
            <el-select
              v-model="formData.organ_id"
              :disabled="!formData.company_id"
              @change="handleQuery"
              clearable
            >
              <el-option
              v-for="item in cParts"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password" type="password"  placeholder="" />
          </el-form-item>
            <el-form-item label="确认密码" prop="confirm">
              <el-input v-model="formData.confirm" type="password"  placeholder="" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </template>
        </el-dialog>
            <!-- 表单弹窗 -->
        <el-dialog :title="resetPass.title" v-model="resetPass.visible" custom-class="width_class">
          <el-form
            ref="dataFormRef"
            :model="formData_pass"
            :rules="rules_pass"
            label-width="120px"
          >
          <el-form-item label="原密码" prop="original">
            <el-input v-model="formData_pass.original" type="password"  placeholder="" />
          </el-form-item>
          <el-form-item label="密码" prop="new">
            <el-input v-model="formData_pass.new" type="password"  placeholder="" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm">
            <el-input v-model="formData_pass.confirm" type="password"  placeholder="" />
          </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="handleReset">确 定</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </template>
    
    <style lang="scss" scoped>
    .component-container {
      box-sizing: border-box;
    }
    .table_column_icon{
      margin-left: 15px;
      padding-top: 5px;
    }
    </style>
    