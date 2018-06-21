import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login/Login'
import Scenery from '@/components/Scenery/Scenery'
import Error from '@/components/404/404'
import Home from '@/components/Home/Home'
import User from '@/components/User/User'
import Order from '@/components/Order/Order'
import Comment from '@/components/Comment/Comment'
import Ticket from '@/components/Ticket/Ticket'
import AddScenery from '@/components/AddScenery/AddScenery'
import Addticket from '@/components/Addticket/Addticket'
import Main from '@/components/Main/Main'

Vue.use(Router)
const router= new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      // name: 'Home',
      component: Home,
      children:[
        {
          path:'/',
          name:'main',
          component:Main
        },
        {
          path:'/User',
          name:'User',
          component:User
        },
        {
          path:'/Scenery',
          name:'Scenery',
          component:Scenery
        },
        {
          path:'/Order',
          name:'Order',
          component:Order
        },
        {
          path:'/Comment',
          name:'Comment',
          component:Comment
        },
        {
          path:'/Ticket',
          name:'Ticket',
          component:Ticket
        },
        {
          path:'/addticket',
          name:'addticket',
          component:Addticket
        },
        {
          path:'/addscenery',
          name:'addscenery',
          component:AddScenery
        }
      ]
    },
    {
      path:'/notFound',
      name:'NotFound',
      component:Error
    },
    {
      path:'/login',
      name:'Login',
      component:Login
    },{
      path:'*',
      redirect:'/notFound'
    }
  ]
})
//路由守卫
router.beforeEach((to,from,next)=>{
  console.log(to);
  if(to.name!="Login"&&!sessionStorage.getItem("username")){
    console.log("需要登录");
    this.a.app.$alert('当前状态未登录，请登录', '警告', {
      confirmButtonText: '确定',
      callback: action => {
        this.a.replace({name:'Login'})
      }
    });
    next(false);
  }else{
    next()
  }
  
})

export default router
