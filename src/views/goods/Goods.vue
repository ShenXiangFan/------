<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片数据区域 -->
    <el-card>
      <el-row>
        <!-- 第一行 插叙数据区域 -->
        <el-col>
          <el-input placeholder="请输入内容" v-model="searchInput" clearable class="input-with-search">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="primary" @click="goGoodsPage">添加商品</el-button>
        </el-col>
        <!-- 第二行 商品内容区 -->
        <el-col class="MiddleCol">
          <el-table :data="goodsAllData.goods" style="width: 100%" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="600px"></el-table-column>
            <el-table-column prop="goods_price" label="商品价格"></el-table-column>
            <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
            <el-table-column prop="upd_time" label="创建时间">
              <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <el-button type="danger" icon="el-icon-share" size="mini" @click="delGoods(scope.row)"></el-button>   
              </template>
            </el-table-column>
          </el-table>  
        </el-col>
        <!-- 第三行 分页 -->
        <el-col>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="goodsData.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="goodsData.pagesize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加商品对话框 -->
    <el-dialog title="添加商品" :visible.sync="addGoodsDialogVisible" width="50%">

      <span slot="footer">
        <el-button @click="addGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "Goods",
  data(){
    return{
      //查询输入框输入的数据
      searchInput:'',
      goodsData:{
        pagenum:1,
        pagesize:10
      },
      //所有商品信息数组
      goodsAllData:[],
      //页码总数
      total:0,
      //添加商品对话框
      addGoodsDialogVisible:false
    }
  },
  methods:{
    //获取商品列表数据
    async getGoodsListData(){
     const {data:res} =  await this.$http.get('goods',{params:{query:this.searchInput,pagenum:this.goodsData.pagenum,pagesize:this.goodsData.pagesize}})
     if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsAllData=res.data
      this.total=res.data.total
    },
    //分页功能改变分页
    handleSizeChange(newSize){
      this.goodsData.pagesize=newSize
      this.getGoodsListData()
    },
    //分页功能改变当前页码
    handleCurrentChange(newPage){
      this.goodsData.pagenum=newPage
      this.getGoodsListData()
    },
    //删除商品
    async delGoods(row){
      //goods_id
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(confirmResult !== 'confirm') return this.$message.info('取消删除')
      const {data:res} = await this.$http.delete(`goods/${row.goods_id}`)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getGoodsListData()
      this.$message.success(res.meta.msg)
    },
    //第一行 添加商品功能
    goGoodsPage(){
      this.$router.push('/goods/add')
    },
  },
  created(){
    //获取商品列表数据
    this.getGoodsListData()
  },
  computed:{
    currentTime(){
     return this.$dayjs(this.goodsAllData.goods.upd_time).format("YYYY-MM-DD")
    }
  },
  watch:{
    //搜索框查询数据
    searchInput(){
      this.getGoodsListData()
    }
  },
};
</script>

<style scoped>
.input-with-search{
  width: 400px;
  margin-right: 20px;
}
.el-table-column{
  font-size: 10px;
}
.el-table{
  font-size: 10px
}
.MiddleCol{
  margin: 10px 0;
}
</style>