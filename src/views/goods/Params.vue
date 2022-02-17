<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col class="cat_opt">
        <!-- 警告区域 -->
        <el-alert title="只允许第三级分类设置相关参数" type="warning" show-icon :closable="false"> </el-alert>
        </el-col>
        <!-- 选择商品分类区域 -->
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择器 -->
          <el-cascader v-model="selectedKey" :options="goodsClassList" :props="cascaderProps" @change="handleChange"></el-cascader>
        </el-col>
        <!-- 标签页 -->
        <el-col>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
              <el-tab-pane label="动态参数" name="many" >
                <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="AddProp">添加属性</el-button>
                <!-- 动态参数表格 -->
                <el-table :data="manyTableDate" border stripe style="width: 100%">
                  <!-- 展开列 -->
                  <el-table-column type="expand">
                    <!-- 详细信息数据 attr_vals 数据 -->
                    <template slot-scope="scope">
                      <!-- 标签栏 -->
                      <el-tag :key="tag.cat_id" v-for="(tag,index) in scope.row.attr_vals" closable :disable-transitions="false"
                      @close="HandlerDelTag(scope.row,index)">{{tag}}</el-tag>
                      <el-input class="input-new-tag" 
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <el-button v-if="!scope.row.inputVisible" class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column type="index" label="#"></el-table-column>
                  <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope"> 
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="editProp(scope.row)">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="delProp(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="AddProp">添加属性</el-button>
                <!-- 静态参数表格 -->
                <el-table :data="onlyTableData" border stripe>
                  <el-table-column type="expand">
                    <!-- 静态页面详细数据 attr_vals 数据 -->
                    <template slot-scope="scope">
                    <el-tag :key="tag.attr_id" v-for="(tag,index) in scope.row.attr_vals" closable :disable-transitions="false" @close="HandlerDelTag(scope.row,index)">{{tag}}</el-tag>
                    <el-input class="input-new-tag" 
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)" >
                      </el-input>
                      <el-button v-if="!scope.row.inputVisible" class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column type="index" label="#"></el-table-column>
                  <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope"> 
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="editProp(scope.row)">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="delProp(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
        </el-col>
      </el-row>
    </el-card>
    <!-- 动态参数添加属性的对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="AddPropDialogVisible"
      width="50%" @close="closeAddPropDialog">
      <el-form ref="addFormRef" :model="tableDate" :rules="AddFormRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="tableDate.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddPropDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddProp">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 参数编辑属性的对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editPropDialogVisible"
     close="editDialogClose" width="50%">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPropDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditPropDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data(){
    return {
      //商品分类数据列表
      goodsClassList:[],
      //级联选择器的属性配置项
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover'
      },
      //级联选择器双向绑定的数组
      selectedKey:[],
      //标签页的双向绑定页码
      activeName:'many',
      manyTableDate:[],
      onlyTableData:[],
      //商品扩展栏详细信息
      manyTableInfo:'',
      // 控制添加对话框的显示与隐藏
      AddPropDialogVisible:false,
      //添加表单数据
      tableDate:{
        attr_name:''
      },
      AddFormRules:{
        attr_name:[
          { required: true, message: '请输入添加属性名称', trigger: 'blur' }
        ]
      },
      editPropDialogVisible:false,
      //修改对话框表单数据
      editFormDate:{
        //新属性
        attr_name:'',
        cat_id:'', //分类 ID
        attr_id:'', //属性 ID
        attr_sel:this.activeName, //属性的类型
        attr_vals:'' //参数的属性值
      },
      editForm:{},
      //编辑对话框的规则验证
      editFormRules:{
        attr_name:[{ required: true, message: '请输入添加属性名称', trigger: 'blur' }]
      },
    }
  },
  methods:{
    //获取商品分类列表
    async getGoodsClassList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsClassList=res.data
    },
    // 级联选择框选中项变化会出发这个函数
    handleChange(){
      this.getParamsData()
    },
    //标签页改变触发的函数
    handleTabClick(){
      this.getParamsData()
    },
    //获取动态静态参数
    async getParamsData(){
      const id=this.cataId
      const {data:res} = await this.$http.get(`categories/${id}/attributes`,{params:{sel:this.activeName}})
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      if(this.activeName==='many'){
        this.manyTableDate=res.data
        //attr_vals 标签栏 this.manyTableInfo=res.data[0].attr_vals
        res.data.forEach(item => {
          item.attr_vals=item.attr_vals ? item.attr_vals.split(' ') :[]
          this.$set(item,"inputValue",'')
          this.$set(item,"inputVisible",false)
        });
        console.log('动态页面',res.data)
      }else{
        this.onlyTableData=res.data
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') :[]
          this.$set(item,"inputValue",'')
          this.$set(item,"inputVisible",false)
        });
        console.log('静态页面',res.data)
      }
    },
    //动态参数添加属性的操作
    AddProp(){
      this.AddPropDialogVisible=true
    },
    //监听对话框的关闭事件
    closeAddPropDialog(){
      this.$refs.addFormRef.resetFields() 
    },
    //提交动态参数添加属性的操作
    submitAddProp(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return 
        const {data:res} = await this.$http.post(`categories/${this.cataId}/attributes`,
        {attr_name:this.tableDate.attr_name,attr_sel:this.activeName})
        if(res.meta.status!==201) return this.$message.error('添加参数失败')
        this.getParamsData()
        this.AddPropDialogVisible=false
        this.$message.success('添加参数成功')
      })
    },
    //删除参数
    async delProp(info){
      const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult!=='confirm') return this.$message.info('取消成功')
        const {data:res} = await this.$http.delete(`categories/${info.cat_id}/attributes/${info.attr_id}`)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()      
    },
    //编辑参数
    async editProp(info){
      const {data:res} =await this.$http.get(`categories/${this.cataId}/attributes/${info.attr_id}`,
      {params:{attr_sel:this.activeName,attr_vals:this.editFormDate.attr_vals}})
      if(res.meta.status !== 200 ) return this.$message.error('修改失败')
      this.editForm=res.data
      console.log(res.data)
      this.editPropDialogVisible=true
    },
    //提交编辑对话框
    submitEditPropDialog(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return this.$message.error('校验失败')
        const {data:res} = await this.$http.put(`categories/${this.cataId}/attributes/${this.editForm.attr_id}`,
        {attr_name:this.editForm.attr_name,attr_sel:this.activeName})
        if(res.meta.status !== 200 ) return this.$message.error('修改失败')
        this.$message.success(res.meta.msg)
        this.editPropDialogVisible=false
        this.getParamsData()
      })
    },
    //重置修改的表单
    editDialogClose(){
      this.$refs.editFormRef.resetFields()
    },
    //失去焦点函数
    handleInputConfirm(info){
      if(info.inputValue.trim().length===0){
        info.inputVisible=false
        info.inputValue=''
        return 
      }
      info.attr_vals.push(info.inputValue.trim())
      info.inputValue=''
      info.inputVisible=false
      this.saveTag(info)
    },
    //输入展示框的文本提交
    showInput(info){
      info.inputVisible=true
      this.$nextTick(()=> {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除标签
    HandlerDelTag(info,index){
      console.log(index)
      info.attr_vals.splice(index,1)
      this.saveTag(info)
    },
    //保存标签
    async saveTag(info){
      const {data:res} = await this.$http.put(`categories/${this.cataId}/attributes/${info.attr_id}`,
      {
        attr_name:info.attr_name,
        attr_sel:info.attr_sel,
        attr_vals:info.attr_vals.join(' ')
      })
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    }
  },
  created(){
    this.getGoodsClassList() 
  },
  computed:{
    isBtnDisable(){
      if(this.selectedKey.length>1){
        return false 
      }
      return true
    },
    //获取三级分类的id
    cataId(){
      if(this.selectedKey.length===3){
        return this.selectedKey[2]
      }else{
        return  null
      }
    },
    titleText(){
      if(this.activeName==='many'){
        return '动态参数'
      }else{
        return '静态参数'
      }
    }
  }
}
</script>

<style scoped>
.cat_opt{
  margin-bottom: 15px;
}
.el-tag{
  margin: 10px;
}
.el-button{
  margin-bottom:10px
}
.input-new-tag{
  width: 120px !important;
}
</style>