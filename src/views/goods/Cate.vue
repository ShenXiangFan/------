<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateClass">添加分类</el-button>
        </el-col>
        <el-col>
          <!--树状表格区-->
          <tree-table :data="goodsClassLists" :columns="columns"
          show-index index-text="#" stripe :show-row-hover="false" :selection-type="false"
          :expand-type="false" border >
            <!-- 是否有效插槽 -->
            <template slot="isOk" slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.cat_deleted===false"></i>
              <i class="el-icon-error" v-else></i>
            </template>
            <!-- 排序插槽 -->
            <template slot="arrayment" slot-scope="scope">
              <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
              <el-tag type="success" v-if="scope.row.cat_level===1">二级</el-tag>
              <el-tag type="warning" v-if="scope.row.cat_level===2">三级</el-tag>
            </template>
            <!-- 操作插槽 -->
            <template slot="operation" slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click="editCateList(scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="delCateList(scope.row)">删除</el-button>
            </template>

          </tree-table>
        </el-col>
        <el-col>
          <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="提示" :visible.sync="addClassDialogVisible" width="50%" @close="closeClassDialogVisible">
      <el-form ref="addClassFormRef" :rules="addClassRules" :model="addClassForm" label-width="80px">
        <!-- 分类名称 -->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addClassForm.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类 -->
        <el-form-item label="父级分类:">
          <!-- 级联选择器 v-model双向绑定到数据的一个数组中 props指定选择器的具体属性-->
          <el-cascader :options="parentCateList" :props="cascaderProps" v-model="selectedKey"
          @change="cascaderHandleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addClassDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitClassDialogVisible">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="修改分类名称"  :visible.sync="editClassDialogVisible" width="50%">
      <el-form ref="addClassFormRef" :rules="addClassRules" :model="editFormlist" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editFormlist.cat_name"></el-input>
        </el-form-item>
       </el-form>
    <span slot="footer" class="dialog-footer"> 
      <el-button @click="editClassDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitCateEditClass">确 定</el-button>
    </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  name:'Cate',
  data(){
    return {
      //查询条件 pagenum当前页码值  pagesize每页显示多少条数据
      queryInfo:{type:3,pagenum:1,pagesize:5},
      //商品列表
      goodsClassLists:[],
      //总页数 默认为0
      total:0,
      //树状表格的内容
      columns:[
        {label:"分类名称",prop:"cat_name"},
        {label:"是否有效",type:'template',template:'isOk'},
        {label:"排序",type:'template',template:'arrayment'},
        {label:'操作',type:'template',template:'operation'}
      ],
      //添加分类对话框的visible
      addClassDialogVisible:false,
      //添加分类表单双向绑定
      addClassForm:{
        cat_pid:0,  //父级分类的id
        cat_name:'', //分类名称
        cat_level:0 //分类的等级
      },
      addClassRules:{
        cat_name:[{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      //父级分类数据
      parentCateList:[],
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger:'hover'
      },
      //级联选择器双向绑定的数据
      selectedKey:[],
      //编辑分类
      editClassDialogVisible:false,
      //编辑表单的数据
      editFormlist:{
        cat_id:0,
        cat_name:''
      }
    }
  },
  methods:{
    //获取列表的所有信息
    async getGoodsClassLists(){
      const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
      if(res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
      this.goodsClassLists=res.data.result
      this.total=res.data.total
    },
    //更新分页的一页所包含的数量
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getGoodsClassLists()
    },
    //更新页码
    handleCurrentChange(newNum){
      this.queryInfo.pagenum=newNum
      this.getGoodsClassLists()
    },
    //添加分类
    addCateClass(){
      //获取父级分类列表
      this.getParentCateList()  
      this.addClassDialogVisible=true
    },
    //获取商品分类数据列表
    async getParentCateList(){
      const {data:res} = await this.$http.get('categories',{params:{type:2}})
      if(res.meta.status!==200) return this.$message.error('获取失败')
      console.log('商品分类',res)
      this.parentCateList=res.data
    },
    // 级联选择器改变
    cascaderHandleChange(){
      console.log(this.selectedKey)
      //selectedKey的length >0 证明选中了父级分类
      if(this.selectedKey.length>0){
        this.addClassForm.cat_pid=this.selectedKey[this.selectedKey.length-1]
        this.addClassForm.cat_level=this.selectedKey.length
      }
    },
    //提交分类对话框的内容
    async submitClassDialogVisible(){
      const {data:res} = await this.$http.post('categories',this.addClassForm)
      if(res.meta.status!==201) return this.$message.error('添加失败')
      this.$message.success(res.meta.msg)
      this.getGoodsClassLists()
      this.addClassDialogVisible = false
    },
    //关闭分类对话框
    closeClassDialogVisible(){
      this.$refs.addClassFormRef.resetFields()
      this.selectedKey=[]
      this.addClassForm.cat_pid=0
      this.addClassForm.cat_level=0
    },
    //编辑分类操作的应用
    editCateList(info){
      //编辑分类的同时创建一个新的列表项
      //this.$http.put(`categories/${info.cat_id}`)
      this.editFormlist.cat_id=info.cat_id
      this.editFormlist.cat_name=info.cat_name
      this.editClassDialogVisible=true
    },
    //提交修改分类名称
    async submitCateEditClass(){
     const {data:res} = await this.$http.put(`categories/${this.editFormlist.cat_id}`,{cat_name:this.editFormlist.cat_name})
      if(res.meta.status!==200)return this.$message.error(res.meta.msg)
      this.getGoodsClassLists()
      this.$message.success(res.meta.msg)
      this.editClassDialogVisible=false
    },
    //删除分类
    async delCateList(info){
      console.log(info)
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
      if(confirmResult!=='confirm') return this.$message.info('取消删除')
      const {data:res} = await this.$http.delete(`categories/${info.cat_id}`)
      if(res.meta.status!==200)  return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getGoodsClassLists()
    }
  },
  created(){
    this.getGoodsClassLists()
  }
}
</script>

<style scoped>
.el-button{
  margin-bottom: 15px;
}
</style>