<template>
  <el-container class="home-Container">
    <!--头部区-->
  <el-header>
    <div>
      <img src="../assets/dttx.jpg">
      <span>天天优购后台管理系统</span>
    </div>
    <el-button type="info" @click="backHandler">退出</el-button>
  </el-header>
  <!-- 页面主体区 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="collapseTag ? '60px':'200px'"> <!--设置当隐藏栏点击时，隐藏一半-->
      <div class="toggler-button" @click="toggleCollapse">|||</div>
      <el-menu background-color="#333744" text-color="#fff" 
      active-text-color="#409eff" :unique-opened="true" :collapse="collapseTag" 
      :collapse-transition="false" router :default-active="activePath">
        <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
        <!-- 一级菜单模板区 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item v-for="itemChild in item.children" :key="itemChild.id" 
        :index="'/'+itemChild.path" @click="activeHandler('/'+itemChild.path)">
          <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{itemChild.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 右侧内容主题 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  name:'Home',
  data(){
    return{
      //菜单列表
      menuList:[],
      //图片列表
      iconObj:{
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-lock_fill',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      //是否折叠
      collapseTag:false,
      activePath:''
    }
  },
  methods:{
    //回退按钮 清楚临时的token
    backHandler(){
      sessionStorage.clear()
      this.$router.replace('/')
    },
    //创建左侧的标签
    async createList(){
      const {data:res}=await this.$http.get('menus')
      if(res.meta.status!==200)return this.$message.error(res.meta.msg)
      this.menuList=res.data
    },
    //点击按钮，切换菜单的折叠与展开
    toggleCollapse(){
      this.collapseTag=!this.collapseTag
    },
    //保存链接状态
    activeHandler(currentPath){
      window.sessionStorage.setItem('activePath',currentPath)
      this.activePath=currentPath
    }
  },
  created(){
      this.createList()
      this.activePath=sessionStorage.getItem('activePath')
    },
}
</script>

<style scoped lang="less">
img{
  height: 100%;
  width: 70px;
}
.home-Container{
  height: 100%;
}
.el-header{
  padding-left:0 ;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  >div{
    display: flex;
    align-items: center;
  }
  span{
    margin-left: 15px;
    color: #fff;
    font-size: 20px;
  }
}
.el-aside{
  background-color: #333744;
  .el-menu{
  border-right: none;
}
}
.el-main{
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggler-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: white;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>