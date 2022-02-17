<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>手机报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name:'Reports',
  data(){
    return{
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted(){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    const {data:res} = await this.$http.get('reports/type/1')
    if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
    //console.log(res.data)
    // const obj=Object.assign({},res.data,this.options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption({...this.options,...res.data});
  }
}
</script>

<style>

</style>