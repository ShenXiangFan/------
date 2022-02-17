<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="15">
        <el-col :span="7">
            <!-- 输入框 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="usersCreateList">
            <el-button icon="el-icon-search" slot="append" @click="usersCreateList(queryInfo.query)" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
            <!-- 添加用户 -->
            <el-button icon="el-icon-search" type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
    <el-table :data="userList" border style="width: 100%" stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
        <!-- 编辑组件 -->
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editHandler(scope.row.id)"></el-button>
        <!-- 删除组件 -->
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delHandeler(scope.row.id)"></el-button>
        <!-- 分配角色组件  -->
        <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
          <el-button type="warning" icon="el-icon-setting" size="mini" @click="assigningRoles(scope.row)"></el-button>
        </el-tooltip>
        </template>
      </el-table-column>
  </el-table>
        <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="closeDialogVisible">
     <!-- 添加表单的信息对话框 -->
      <el-form :model="newNumber" :rules="newNumberRules" ref="newNumber" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="newNumber.username" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="newNumber.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="newNumber.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="newNumber.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改信息对话框 -->
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="50%" @close="closeHandler">
      <!-- 修改信息的表单 -->
      <el-form :model="editList" :rules="editRules" ref="editForm" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="editList.username" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="editList.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input type="text" v-model="editList.mobile" autocomplete="off"></el-input>
          </el-form-item>
       </el-form>   
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色权限" :visible.sync="assigningRolesDialogVisible" width="50%"
    @close="setRoleDialogClose">
      <!-- 当前用户的基本信息 -->
      <p>当前的用户:{{assigningRolesInfo.username}}</p>
      <p>当前的角色:{{assigningRolesInfo.role_name}}</p>
      <span>当前新角色:</span>
        <el-select v-model="selectedRoleID" filterable placeholder="请选择">
          <el-option
            v-for="item in rolesArr"
            :key="item.id" :label="item.roleDesc" :value="item.id">
          </el-option>
        </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assigningRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ChangerUserRoles">确 定</el-button>
      </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  name:'Users',
  data(){
       // 验证邮箱的规则
   var checkEmail=(rule, value, callback)=>{
    const regEmail=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if(regEmail.test(value)){
      callback()
    }else{
      callback(new Error('输入的邮箱格式有误'))
    }
   }
   const checkMobel=(rule, value, callback)=>{
     const regMobel=/^1[3456789]\d{9}$/
     if(regMobel.test(value)){
       callback()
     }else{
       callback(new Error('输入的手机号有误'))
     }
   }
    return{
      queryInfo:{
        //搜索关键字
        query:'',
        // 当前是第一页
        pagenum:1,
        // 当前一页有2个
        pagesize:2
      },
      userList:[],
      total:0,
      //对话框显示还是隐藏
      dialogVisible:false,
      //修改用户信息
      editDialogVisible:false,
      newNumber:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //编辑表单的信息
      editList:{},
      // 添加表单的验证规则对象
      newNumberRules:{
          username:[
            { required: true, message: '用户为必填选项', trigger: 'blur'},
            { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
            ],
          password:[
            { required: true, message: '密码为必填选项', trigger: 'blur'},
            { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
            ],
          email:[
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            {validator:checkEmail, trigger: 'blur'},
            // {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ],
          mobile:[
            {required: true, message: '手机号为必填选项', trigger: 'blur'},
            {validator:checkMobel, trigger: 'blur'}
          ]
      
      },
      //绘制编辑表单的验证规则
      editRules:{
        email:[
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {validator:checkEmail, trigger: 'blur'},
            // {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile:[
          {required: true, message: '手机号为必填选项', trigger: 'blur'},
          {validator:checkMobel, trigger: 'blur'}
        ]
      },
      //分配权限对话框
      assigningRolesDialogVisible:false,
      //分配权限对话框的当前用户基本信息
      assigningRolesInfo:{},
      //定义角色列表
      rolesArr:[],
      //下拉列表选择提交的id值
      selectedRoleID:''
    }
  },
  methods:{
    //绘制表格
    async usersCreateList(){
      const {data:res} = await this.$http.get('users',{params:this.queryInfo})
      if(res.meta.status!==200) return this.$message.error('响应错误')
      this.userList=res.data.users
      this.total=res.data.total
    },
    // pageSize改变的事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.usersCreateList()
    },
    // page改变的事件
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.usersCreateList()
    },
    //状态修改同步数据库
    async stateChange(userInfo){
      const {data:res}=await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if(res.meta.status!==200){
        userInfo.mg_state=!userInfo.mg_state
        return this.$message.error('更新页面失败') 
      }
      this.$message.success('更新页面成功')
    },
    //关闭对话框内的内容重置
    closeDialogVisible(){
      this.$refs.newNumber.resetFields()
    },
    //添加新成员
    addUser(){
      //校验
      this.$refs.newNumber.validate(async valid=>{
        if(valid){
          //校验成功 添加新用户
          const {data:res}=await this.$http.post('users',this.newNumber)
          if(res.meta.status!==201) {
            this.$message.error('创建新用户失败')
            this.dialogVisible=false
          }else{
            this.$message.success('创建用户成功')
            this.usersCreateList()
            this.dialogVisible=false
          }
        }
      })
      //this.dialogVisible = false
    },
    //修改用户的信息
    async editHandler(id){
      const {data:res}=await this.$http.get(`users/${id}`)
      if(res.meta.status!==200){
        this.$message.error('请求数据失败')
      }else{
        this.editList=res.data
      }
      this.editDialogVisible=true
    },
    //重置修改信息对话框的表单
    closeHandler(){
      this.$refs.editForm.resetFields()
    },
    //提交消息预验证
    editUserInfo(){
      this.$refs.editForm.validate(async valid=>{
        if(!valid) return this.$message.error('验证失败，请检查格式')
        //更新表单
        const {data:res}=await this.$http.put('users/'+this.editList.id,
        {email:this.editList.email,mobile:this.editList.mobile})
        console.log(res)
        if(res.meta.status!==200){
          return this.$message.error('修改失败')
        }
          // 关闭对话框
          this.editDialogVisible=false
          // 刷新数据列表
          this.usersCreateList()
          //提示成功信息
          this.$message.success('修改成功')
        })
    },
    //根据id删除用户的信息
    async delHandeler(id){
       const confirmResult= await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err); 
      if(confirmResult!=='confirm'){
        return this.$message.info('已取消删除')
      }else{
      const {data:res}=await this.$http.delete(`users/${id}`)
      if(res.meta.status!==200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.usersCreateList()
      }
    },
    //分配角色
    async assigningRoles(info){
      //分配角色的对话框展开
      this.assigningRolesInfo=info
      //调取所有角色
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !==200 ) return this.$message.error('获取角色失败')
      this.rolesArr = res.data
      this.assigningRolesDialogVisible=true
    },
    //点击按钮 分配用户角色
    async ChangerUserRoles(){
      if(!this.selectedRoleID) return alert('请选择用户分配的角色')
      const {data:res} = await this.$http.put(`users/${this.assigningRolesInfo.id}/role`,{rid:this.selectedRoleID})
      if(res.meta.status !== 200) return this.$message.error('角色更新失败')
      this.usersCreateList()
      this.$message.success('角色更新成功')
      this.assigningRolesDialogVisible=false
    },
    // 分配用户角色的对话框关闭重置
    setRoleDialogClose(){
      this.selectedRoleID=''
    }
  },
  created(){
    this.usersCreateList()
  }
}
</script>
<style scoped>
.el-table{
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination{
  margin-top: 15px;
}
</style>