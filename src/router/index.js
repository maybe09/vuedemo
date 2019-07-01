import Vue from 'vue'
import Router from 'vue-router'
var Login=()=> import ( '../components/login/login.vue')
var Home=()=> import ( '../components/home/home.vue')
var Users=()=> import ( '../components/content/users.vue')
var Rights=()=> import ( '../components/content/rights.vue')
var Roles=()=> import ( '../components/content/roles.vue')
var Goods=()=> import ( '../components/content/goods.vue')
var Categories=()=> import ( '../components/content/categories.vue')
var Params=()=> import ( '../components/content/params.vue')
var Goodsadd=()=> import ( '../components/content/goodsadd.vue')
var Orders=()=> import ( '../components/content/orders.vue')
var Reports=()=> import ( '../components/content/reports.vue')
// 引入message
import { Message } from 'element-ui'
Vue.use(Router)
var router=new Router({
  routes: [
    { path: '/', redirect: '/home' },
   {path:'/login',name:'login',component:Login},
   {path:'/home',name:'home',component:Home,
      children:[
        {path:'/users',name:'users',component:Users},
        {path:'/rights',name:'rights',component:Rights},
        {path:'/roles',name:'roles',component:Roles},
        {path:'/goods',name:'goods',component:Goods},
        {path:'/categories',name:'categories',component:Categories},
        {path:'/params',name:'params',component:Params},
        {path:'/goods/add',name:'goodsadd',component:Goodsadd},
        {path:'/orders',name:'orders',component:Orders},
        {path:'/reports',name:'reports',component:Reports},
      ]
  }
  ]
  
})
// 导航守卫
// 注册一个全局导航守卫,作用:实际工作中可能不止一个页面,那么如果给每一个页面都进行登录
// 验证会比较麻烦,使用导航守卫就可以解决这个问题
// to 将要进入的路由
// from 从哪个路由跳转
// next.是否执行后面的代码
router.beforeEach((to, from, next) => {
  // 只要请求的不是login,都需要进行验证
  if(to.path!='/login'){
    //  判断是否存在token
    if(!localStorage.getItem('token')){
       //   this.$router.push("/login"); 不能这样写
      //  因为此时的this指向的是router这个对象,直接通过router.push就可以了
      // 不能直接用this.message的方法,因为这个方法属于vue实例的
      Message.error('您还没有登录')
      router.push('/login');
      return 
    }
  }
  next()
})
export default router
