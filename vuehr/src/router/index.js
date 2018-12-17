import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Chat from '@/components/chat/Chat'
import OrderInfo from '@/components/order/OrderInfo'
import PerBaoJiaInfo from '@/components/audit/PerBaoJiaInfo'
import BusBaoJiaInfo from '@/components/audit/BusBaoJiaInfo'
import PlantOrderInfo from '@/components/plant/PlantOrderInfo'
import OfferBusInfo from '@/components/offer/OfferBusInfo'
import OfferPerInfo from '@/components/offer/OfferPerInfo'
import BusPrint from '@/components/print/Busprint'
import UserInfo from '@/components/user/userInfo'
// import EmpAdv from '@/components/emp/EmpAdv'
// import EmpBasic from '@/components/emp/EmpBasic'
// import PerEc from '@/components/personnel/PerEc'
// import PerEmp from '@/components/personnel/PerEmp'
// import PerMv from '@/components/personnel/PerMv'
// import PerSalary from '@/components/personnel/PerSalary'
// import PerTrain from '@/components/personnel/PerTrain'
// import SalMonth from '@/components/salary/SalMonth'
// import SalSearch from '@/components/salary/SalSearch'
// import SalSob from '@/components/salary/SalSob'
// import SalSobCfg from '@/components/salary/SalSobCfg'
// import SalTable from '@/components/salary/SalTable'
// import StaAll from '@/components/statistics/StaAll'
// import StaPers from '@/components/statistics/StaPers'
// import StaRecord from '@/components/statistics/StaRecord'
// import StaScore from '@/components/statistics/StaScore'
// import SysBasic from '@/components/system/SysBasic'
// import SysCfg from '@/components/system/SysCfg'
// import SysData from '@/components/system/SysData'
// import SysHr from '@/components/system/SysHr'
// import SysInit from '@/components/system/SysInit'
// import SysLog from '@/components/system/SysLog'

Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/',
      name: 'Login',
      component: Login,
      hidden: true
    },
    {
      path: '/print/bus/:id',
      name: 'print',
      component: BusPrint,
      hidden: true
    },
     {
      path: '/home',
      name: '主页',
      component: Home,
      hidden: true,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/chat',
          name: '消息',
          component: Chat,
          hidden: true,
          meta: {
            keepAlive: false,
            requireAuth: true
          }
        }
      ]
    },
    {
     path: '/home',
     name: '主页',
     component: Home,
     hidden: true,
     meta: {
       requireAuth: true
     },
     children: [
       {
         path: '/userInfo',
         name: '个人中心',
         component: UserInfo,
         hidden: true,
         meta: {
           keepAlive: false,
           requireAuth: true
         }
       }
     ]
   },
    {
      path: '/home',
      name: '主页',
      component: Home,
      hidden: false,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/order/info/:id',
          name: '消息',
          component: OrderInfo,
          hidden: false,
          meta: {
            keepAlive: false,
            requireAuth: true
          }
        }
      ]
    },
    // {
    //   path: '/home',
    //   name: '主页',
    //   component: Home,
    //   hidden: true,
    //   meta: {
    //     requireAuth: true
    //   },
    //   children: [
    //     {
    //       path: '/print/bus/:id',
    //       name: '打印',
    //       component: BusPrint,
    //       hidden: false,
    //       meta: {
    //         keepAlive: false,
    //         requireAuth: true
    //       }
    //     }
    //   ]
    // },
    {
      path: '/home',
      name: '主页',
      component: Home,
      hidden: false,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/bus/offer/info/:id',
          name: '消息',
          component: BusBaoJiaInfo,
          hidden: false,
          meta: {
            keepAlive: false,
            requireAuth: true
          }
        },
        {
          path: '/per/offer/info/:id',
          name: '消息',
          component: PerBaoJiaInfo,
          hidden: false,
          meta: {
            keepAlive: false,
            requireAuth: true
          }
        },
        {
          path: '/offer/per/info/:id',
          name: '消息',
          component: OfferPerInfo,
          hidden: false,
          meta: {
            keepAlive: false,
            requireAuth: true
          }
        },
        {
          path: '/offer/bus/info/:id',
          name: '消息',
          component: OfferBusInfo,
          hidden: false,
          meta: {
            keepAlive: false,
            requireAuth: true
          }
        },
        {
          path: '/plant/order/info/:id',
          name: '消息',
          component: PlantOrderInfo,
          hidden: false,
          meta: {
            keepAlive: false,
            requireAuth: true
          }
        }
      ]
    },
    // {
    //     //查看订单详情
    //     path: '/order',
    //     component: resolve => require(['../components/Home.vue'], resolve),
    //     children: [
    //       {
    //           path: '/info',
    //           component: resolve => require(['../components/order/OrderInfo.vue'], resolve),
    //       }
    //     ]
    // }
  ]
})
