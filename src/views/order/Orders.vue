<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>

      <!-- 表格区 -->
      <el-table :data="ordersListData" border style="width: 100%" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" ></el-table-column>
        <el-table-column prop="order_price" label="订单价格" ></el-table-column>
        <el-table-column  label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status==='0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" ></el-table-column>
        <el-table-column prop="create_time" label="下单时间" >
          <template slot-scope="scope">
            {{scope.row.update_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column abel="操作" >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="changeLocation(scope.row)"></el-button>
            <el-button type="success" icon="el-icon-location" @click="showExpressInfo"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination  @size-change="handleSizeChange"  @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="changeLocationDialogVisible" width="50%" @close="closeAddress">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address1">
        <!-- 级联选择器 -->
          <el-cascader v-model="addressForm.address1" :options="cityData" :props="cityProps"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
       </el-form> 
      <span slot="footer">
        <el-button @click="changeLocationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeLocationDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 快递信息的对话框 -->
    <el-dialog title="快递信息" :visible.sync="expressDialogVisible" width="50%" @close="closeAddress">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in expressInfo"
            :key="index"
            :timestamp="expressInfo.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      <span slot="footer">
        <el-button @click="expressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="expressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  name:'Orders',
  data(){
    return {
      query:'',
      //输入框输入的搜索信息
      queryInfo:{pagenum:1,pagesize:10},
      //订单列表数据
      ordersListData:[],
      //总页码数
      total:0,
      //修改地址对话框
      changeLocationDialogVisible:false,
      addressForm:{
        address1:[],
        address2:''
      },
      addressFormRules:{
        address1:[{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2:[{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      //城市数据
      cityData,
      cityProps:{
        expandTrigger:'hover'
      },
      expressInfo:[
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ],
      expressDialogVisible:false
    }
  },
  methods:{
    //获取列表数据
    async getOrdersListData(){
      const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.ordersListData=res.data.goods
      this.total=res.data.total
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getOrdersListData()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getOrdersListData()
    },
    //修改地址的tag
    changeLocation(info){
      this.changeLocationDialogVisible=true
      console.log(info)
    },
    closeAddress(){
      this.$refs.addressFormRef.resetFields()
    },
    //展示快递信息
    showExpressInfo(){
      this.expressDialogVisible=true
    }
  },
  created(){
    this.getOrdersListData()
  },
  watch:{
    query(){
      this.getOrdersListData()
    }
  }
}
</script>

<style scoped>
.input-with-select{
  width: 30%;
  margin-bottom: 10px;
}
</style>