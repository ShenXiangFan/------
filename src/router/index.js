import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/user/Users.vue'
import Rights from '../views/power/Rights.vue'
import Roles from '../views/power/Roles.vue'
import Cate from '../views/goods/Cate.vue'
import Params from '../views/goods/Params.vue'
import Goods from '../views/goods/Goods.vue'
import Add from '../views/goods/Add.vue'
import Orders from '../views/order/Orders.vue'
import Reports from '../views/report/Reports.vue'
const router = new VueRouter({
  routes:[
    {path:'/',component:Login},
    {
      path:'/home',
      component:Home,
      redirect:'/welcome',
      children:[
        {path:'/welcome',component:Welcome},
        {path:'/users',component:Users},
        {path:'/rights',component:Rights},
        {path:'/roles',component:Roles},
        {path:'/categories',component:Cate},
        {path:'/params',component:Params},
        {path:'/goods',component:Goods},
        {path:'/goods/Add',component:Add},     
        {path:'/orders',component:Orders},     
        {path:'/reports',component:Reports},     
    ]
    }
  ]
})
//挂载路由导航守卫ie
router.beforeEach((to,form,next)=>{
  if(to.path==='/') return next()
  let tokenStr=sessionStorage.getItem('token')
  if(!tokenStr)return next('/')
  next()
})

export default router