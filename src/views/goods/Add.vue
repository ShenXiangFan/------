<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card内容区 -->
    <el-card>
      <el-row>
      <!-- 最上层提示面板 -->
        <el-col>
          <el-alert title="添加商品的信息" type="info" :closable="false" show-icon center></el-alert>
        </el-col>
        <el-col>
          <!-- 步骤条 -->
          <el-steps :space="200" :active="activeIndex-0" finish-status="success" :align-center="true">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        <!-- 标签页 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
          <el-tabs :tab-position="tabPosition" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="getParamsList">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类">
                <div class="block">
                  <el-cascader v-model="addForm.goods_cat" :options="classData"
                    :props="cascaderProps"></el-cascader>
                </div> 
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品参数" name="1">
              <el-form-item v-for="item in paramsListData" :key="item.attr_id" :label="item.attr_name">
                <!-- 多选框组 -->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox border v-for="(cb,index) in item.attr_vals" :key="index " :label="cb"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品属性" name="2">
              <el-form-item v-for="item in onlyParamsListData" :key="item.attr_id" :label="item.attr_name">
                <el-input placeholder="请输入内容" v-model="item.attr_name" clearable></el-input>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品图片" name="3">
              <el-upload :headers="headersObj" :on-success="handleSuccess"
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-tab-pane>

            <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑器 :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"-->
                <quill-editor
                  ref="myQuillEditor"
                  v-model="addForm.goods_introduce"
                />
                <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>  
        </el-col>
      </el-row>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片浏览" :visible.sync="ImgDialogVisible" width="50%">
      <img :src="ImgUrl" class="imgSize">
      <span slot="footer" class="dialog-footer">
        <el-button @click="ImgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ImgDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Add',
  data(){
    return {
      //当前步骤条在哪
      activeIndex:'0',
      //tabs从上到下移动
      tabPosition: 'left',
      //添加表单的信息 🐕
      addForm:{
        goods_name:'',
        goods_price:'0',
        goods_weight:'0',
        goods_number:'0',
        // 商品所属的分类列表
        goods_cat:[],
        pics:[],
        //商品介绍
        goods_introduce:'',
        //商品的参数
        attrs:[]
      },
      //添加表单的校验规则
      addFormRules:{
        goods_name:[{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price:[{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight:[{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number:[{ required: true, message: '请输入商品数量', trigger: 'blur' }],
      },
      //分类列表的数据
      classData:[],
      //级联选择器选中的值
      cascaderValue:[],
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger:'hover'
      },
      //参数列表数据
      paramsListData:[],
      //静态参数列表数据
      onlyParamsListData:[],
      headersObj:{Authorization:window.sessionStorage.getItem('token')},
      ImgUrl:'',
      ImgDialogVisible:false
    }
  },
  methods:{
    //得到级联选择器的数据
    async getClassData(){ 
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.classData=res.data
    },
    //进入下一个标签页前要判断
    beforeTabLeave(activeName,oldActiveName){
      if(oldActiveName === '0' && this.addForm.goods_cat.length === 0){
        this.$message.error('请先选择商品分类')
        return false
      }
      this.getParamsList()
    },
    //得到静态页面参数列表
    async getParamsList(){
      if(this.activeIndex === '1'){
      const {data:res} = await this.$http.get(`categories/${this.addForm.goods_cat[this.addForm.goods_cat.length-1]}/attributes`,{params:{sel:"many"}})
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.paramsListData=res.data
      //渲染attr_vals多选框
      res.data.forEach(item=>{
        item.attr_vals= item.attr_vals.length?item.attr_vals.split(' '):[]
      })
      }
      if(this.activeIndex === '2'){
        const {data:res} = await this.$http.get(`categories/${this.addForm.goods_cat[this.addForm.goods_cat.length-1]}/attributes`,{params:{sel:"only"}})
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyParamsListData=res.data
        //res.data.forEach(item=>{
          //item.attr_vals=item.attr_vals.split(' ')
        //})
      }
    },
    //图片浏览呈现效果 file.response.data.tmp_path
    handlePreview(file){
      this.ImgDialogVisible=true
      this.ImgUrl=file.response.data.url
    },
    //图片删除
    handleRemove(file){
      //1 找到文件
      const filePath=file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item=>{
        return item.pic === filePath
      })
      this.addForm.pics.splice(index,1)
    },
    //图片上传的全局钩子
    handleSuccess(response){
      const picsInfo={"pic":response.data.tmp_path}
      this.addForm.pics.push(picsInfo)
    },
    //添加商品
    add(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return this.$message.error('请填写必要的表单')
        //执行添加商品逻辑
        const newForm=JSON.parse(JSON.stringify(this.addForm))
        newForm.goods_cat=newForm.goods_cat.join(',')
        //处理动态属性
        this.paramsListData.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
            }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyParamsListData.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals
            }
          this.addForm.attrs.push(newInfo)
        })
        newForm.attrs=this.addForm.attrs
        //添加商品
       const {data:res} = await this.$http.post('goods',newForm)
       if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
       this.$message.success(res.meta.msg)
       this.$router.push('/goods')
      })
    }
  },
  created(){
    //获取分类数据
    this.getClassData()
  }
}
</script>

<style scoped>
.el-checkbox{
  margin-right: 10px !important;
}
.imgSize{
  width: 100%;
  height: 100%;
}
.btnAdd{
  margin-top: 10px;
}
</style>