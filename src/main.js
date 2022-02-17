import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入vue-table-with-tree-grid 树型表格
import ZkTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//配置请求的根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//设置请求拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
//注册富文本编辑器
Vue.use(VueQuillEditor, /* { default global options } */)
//导入axios 通过$http请求ajax请求 
Vue.prototype.$http=axios
Vue.config.productionTip = false
// 注册tree-table
Vue.component('tree-table', ZkTable)
Vue.use(VueRouter)
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
