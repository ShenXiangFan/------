<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" size="20" @click="addNewRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表表单 -->
      <el-table :data="roleList" style="width: 100%" label-position="left" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 作用域插槽 显示所有数据 -->
          <template slot-scope="scope">
            <el-row v-for="(item,index) in scope.row.children" :key="item.id"
            :class="['bottomLine',index===0?'topLine':'']">
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag closable @close="tagHandleClose(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="18">
                <!-- 二级权限 -->
                <el-row  v-for="(item2,index2) in item.children" :key="item2.id"
                :class="[index2===0?'':'topLine']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="tagHandleClose(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="item3.id"
                    :class="[index3===0?'':'topLine']" closable @close="tagHandleClose(scope.row,item3.id)">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作" width="300px">
          <template slot-scope="scope">   
            <!-- 编辑组件 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row)">编辑</el-button>
            <!-- 删除组件 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRoles(scope.row.id)">删除</el-button>
            <!-- 分配角色组件  -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="addRolesDialogVisible" @close="setRightsDialog"
      width="50%">
      <!-- 权限树形图 -->
      <el-tree :data="rightsList" show-checkbox node-key="id"
        :props="treeProps" default-expand-all :default-checked-keys="defKeys" ref="treeRefs">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRightsRequest">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addNewRolesDialogVisible" @close="closeNewRolesDialog"
      width="50%">
      <!-- 添加角色的表单 -->
      <el-form :model="newRoles" :rules="newRolesRules" ref="newRolesRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="newRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="newRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addNewRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddNewRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="editRolesDialogVisible" @close="closeNewRolesDialog"
      width="50%">
      <!-- 添加角色的表单 -->
      <el-form :model="editRolesInfo" :rules="editRolesRules" ref="editRolesRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesInfo.roleDesc"></el-input>
        </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Roles',
  data(){
    return{
      //所有角色列表数据
      roleList:[],
      //分配权限
      addRolesDialogVisible:false,
      //所有权限列表
      rightsList:[],
      treeProps:{
        children: 'children',
        label: 'authName'
      },
      // 默认勾选的节点id数组
      defKeys:[],
      // 当前节点的id
      currentRoleId:'',
      //添加用户功能按钮的DialogVisible
      addNewRolesDialogVisible:false,
      //添加新角色的表单名字
      newRoles:{
        roleName:'',
        roleDesc:'',
      },
      newRolesRules:{
        roleName:[ { required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc:[{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      // 编辑按钮的对话框
      editRolesDialogVisible:false,
      // 编辑角色的信息
      editRolesInfo:{
        roleId:'',
        roleName:'',
        roleDesc:'',
      },
      //编辑角色的验证规则
      editRolesRules:{
        roleName:[ { required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc:[{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      }
    }
  },
  methods:{
    //创建角色列表数据
    async createRoleList(){
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status!==200)return this.$message.error('角色列表请求数据失败')
      this.roleList=res.data
    },
    //根据id删除对应的权限
    async tagHandleClose(role,rightId){
      const confrimResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confrimResult!=='confirm')return this.$message('您取消了删除此权限')
        //删除逻辑 返回的data, 是当前角色下最新的权限数据
       const {data:res} = await this.$http.delete(`roles/${role.id}}/rights/${rightId}`)
       //this.createRoleList()
       role.children=res.data
       this.$message.success('删除权限成功')
    },
    //展示对话框 showRightDialog
    async showRightDialog(role){
      // 获取所有权限的数据
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200) return this.$message.error('获取权限失败')
      this.currentRoleId=role.id
      this.rightsList = res.data
      //递归获取三级节点的id
      this.getLeafKeys(role,this.defKeys)
      this.addRolesDialogVisible=true
    },
    // 通过递归的形式获取角色下所有的三级权限的id 并保存到defKeys数组中 arr为数组保存
    getLeafKeys(node,arr){
      //如果node节点不包含children属性 说明三级节点
      if(!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      });
    },
    //监听分配权限对话框的关闭效果
    setRightsDialog(){
      this.defKeys=[]
    },
    //提交用户分配权限请求
    async submitRightsRequest(){
      const keys=[
        ...this.$refs.treeRefs.getHalfCheckedKeys(),
        ...this.$refs.treeRefs.getCheckedKeys()
      ]
      const idStr=keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.currentRoleId}/rights`,{rids:idStr})
      if(res.meta.status!==200) return this.$message.error('分配权限失败')
      this.$message.success('更新权限成功')
      this.createRoleList()
      this.addRolesDialogVisible=false
    },
    addNewRoles(){
      this.addNewRolesDialogVisible=true
    },
    // 提交添加新用户
    submitAddNewRoles(){
      //先校验
      this.$refs.newRolesRef.validate(async valid=>{
        if(!valid){
          this.$message.error('校验不通过')
          }else{
            //校验通过 发送请求
            const {data:res} = await this.$http.post('roles',this.newRoles)
            if(res.meta.status!==201) {
              this.$message.error('添加用户失败')
              this.addNewRolesDialogVisible=false
            }else{
            this.$message.success('添加用户成功')
            this.createRoleList()
            this.addNewRolesDialogVisible=false
            }
          }
      })
    },
    //添加角色的对话框关闭
    closeNewRolesDialog(){
      this.newRoles={}
    },
    //删除角色
    async delRoles(id){
     const confirmResult= await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).catch(err => err); 
        if(confirmResult!=='confirm'){
          return this.$message.info('已取消删除角色')
        }else{
          console.log(id)
        const {data:res}=await this.$http.delete(`roles/${id}`)
        console.log(res)
        if(res.meta.status!==200) return this.$message.error('删除角色失败')
        this.$message.success('删除成功')
        this.createRoleList()
      }
    },
    //编辑按钮
    async editRoles(info){
     const {data:res} = await this.$http.get(`roles/${info.id}`)

     if(res.meta.status !== 200) return this.$message.error('编辑失败')
     //将editRolesInfo赋值信息
     this.editRolesInfo=res.data
      //展示对话框
      this.editRolesDialogVisible=true
    },
    //编辑功能的实现
    submitEditRoles(){
      //先校验是否符合规则
      this.$refs.editRolesRef.validate(async valid=>{
        if(valid){
          // 校验成功 发送数据
          const {data:res} = await this.$http.put(`roles/${this.editRolesInfo.roleId}`,{
          roleName:this.editRolesInfo.roleName,
          roleDesc:this.editRolesInfo.roleDesc})
          if(res.meta.status!==200) return this.$message.error('编辑失败')
          this.$message.success('编辑成功')
          this.createRoleList()
          this.editRolesDialogVisible=false
        }
      })
    }
  },
  created(){
    this.createRoleList()
  }
}
</script>

<style scoped>
.el-row{
  display: flex;
  align-items: center;
}
.el-tag{
  margin: 7px;
}
.bottomLine{
  border-bottom: 1px solid #eee;
}
.topLine{
  border-top: 1px solid #eee;
}
</style>