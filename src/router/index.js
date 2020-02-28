import Vue from 'vue'
import Router from 'vue-router'

// const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/



/**
  规则：
      1. 子路由只有1个的话，把icon,把meta写进子路由里
 */


//与权限无关的， 所有人都能看到的
export const constantRouterMap = [
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/login',
  //   name: 'login',
  //   hidden: true
  // },
  {
    path: '',
    component: Layout,
    redirect: '/home/dashboard'
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    name: '登录NxAdmin',
    hidden: true },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },







  // 报表
  {
    path: '/home',
    component: Layout,
    name: 'home',
    // alwaysShow: true,
    meta: {
      title: 'dashboard',
      icon: 'system',
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/dashboard'),
        meta: {
          title: 'dashboard',
          icon: 'dashboard'
        }
      }
    ]
  },

  // 表单
  // {
  //   path: '/form',
  //   component: Layout,
  //   redirect: '/table/BaseForm',
  //   name: 'form',
  //   meta: {
  //     title: 'form',
  //     icon: 'form'
  //   },
  //   children: [
  //     {
  //       path: 'BaseForm',
  //       name: 'BaseForm',
  //       component: () => import('@/views/form/BaseForm'),
  //       meta: { title: 'BaseForm' }
  //     },
  //     {
  //       path: 'VueEditor',
  //       name: 'VueEditor',
  //       component: () => import('@/views/form/VueEditor'),
  //       meta: { title: 'VueEditor' }
  //     },
  //     {
  //       path: 'Upload',
  //       name: 'Upload',
  //       component: () => import('@/views/form/Upload'),
  //       meta: { title: 'Upload' }
  //     }
  //   ]
  // },
  //
  // // 表格
  // {
  //   path: '/table',
  //   component: Layout,
  //   redirect: '/table/complex-table',
  //   name: 'table',
  //   meta: {
  //     title: 'Table',
  //     icon: 'table',
  //
  //   },
  //   children: [
  //     {
  //       path: 'complex-table',
  //       name: 'complex-table',
  //       component: () => import('@/views/table/complex-table'),
  //       meta: { title: 'complexTable' }
  //     },
  //     {
  //       path: 'TreeTable',
  //       name: 'TreeTable',
  //       component: () => import('@/views/table/tree-table/index'),
  //       meta: { title: 'treeTable' }
  //     }
  //
  //   ]
  // }

]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'errorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404',
  //   },
  //   children: [
  //     { path: '401', component: () => import('@/views/errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
  //     { path: '404', component: () => import('@/views/errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
  //   ]
  // },
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/user-management',
    name: 'sys',
    meta: {
      title: 'systemmanagement',
      icon: 'system',
      roles: ['admin']
    },
    children: [
      {
        path: 'user-management',
        name: 'user-management',
        component: () => import('@/views/sysmana/usermanagement'),
        meta: { title: 'userManagement' }
      },
      {
        path: 'role-management',
        name: 'role-management',
        component: () => import('@/views/sysmana/rolemanagement'),
        meta: { title: 'roleManagement' }
      }
    ]
  },
  {
    path: '/sensor',
    component: Layout,
    // redirect: '/sensor/sensor-management',
    name: 'sensor',
    meta: {
      title: 'sensorManagement',
      icon: 'system',
      roles: ['admin', 'sensor_analyst']
    },
    children: [
      {
        path: 'sensor-management',
        name: 'sensor-management',
        component: () => import('@/views/sensor/sensorManagement'),
        meta: {
          title: 'sensorManagement',
          icon: 'system',
        }
      }
    ]
  },
  //泄漏管理
  {
    path: '/leak',
    component: Layout,
    // redirect: '/sensor/sensor-management',
    name: 'leak',
    meta: {
      title: 'leakManagement',
      icon: 'system',
      roles: ['admin']
    },
    children: [
      {
        path: 'leak-management',
        name: 'leak-management',
        component: () => import('@/views/offline/leakManagement'),
        meta: {
          title: 'leakManagement',
          icon: 'system',
        }
      }
    ]
  },
  //密封点管理
  {
    path: '/sealpoint',
    component: Layout,
    // redirect: '/sensor/sensor-management',
    name: 'sealpoint',
    meta: {
      title: 'sealpointManagement',
      icon: 'system',
      roles: ['admin']
    },
    children: [
      {
        path: 'sealpoint-management',
        name: 'sealpoint-management',
        component: () => import('@/views/offline/sealpointManagement'),
        meta: {
          title: 'sealpointManagement',
          icon: 'system',
        }
      }
    ]
  },
  //任务管理
  {
    path: '/task',
    component: Layout,
    // redirect: '/sensor/sensor-management',
    name: 'task',
    meta: {
      title: 'taskManagement',
      icon: 'system',
      roles: ['admin']
    },
    children: [
      {
        path: 'task-management',
        name: 'task-management',
        component: () => import('@/views/offline/taskManagement'),
        meta: {
          title: 'taskManagement',
          icon: 'system',
        }
      }
    ]
  },
  //报警管理
  {
    path: '/alarm',
    component: Layout,
    // redirect: '/sensor/sensor-management',
    name: 'alarm',
    meta: {
      title: 'alarmManagement',
      icon: 'system',
      roles: ['admin']
    },
    children: [
      {
        path: 'alarm-management',
        name: 'alarm-management',
        component: () => import('@/views/offline/alarmManagement'),
        meta: {
          title: 'alarmManagement',
          icon: 'system',
        }
      }
    ]
  },



  {
    path: '/device',
    component: Layout,
    name: 'device',
    // alwaysShow: true,
    meta: {
      title: 'device',
      icon: 'system',
      roles: ['admin']
    },
    children: [
      {
        path: 'deviceManagement',
        name: 'deviceManagement',
        component: () => import('@/views/offline/deviceManagement'),
        meta: {
          title: 'deviceManagement',
          icon: 'system',
          roles: ['admin', 'ldar_manager']
        }
      }
    ]
  },


  { path: '*', redirect: '/404', hidden: true }




  ]
