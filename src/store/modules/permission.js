import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    //route中，有meta属性，且meta中有roles属性才进入判断

    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    //如果route中没有roles这个东西，
    // 其实就是变成了constantRouterMap中的route一样，就直接true即可
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {

    //把asyncRouterMap中的每个route拿出来查看一下
    //查看目前的权限是否可以 访问这个route

    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        //有子路由，进入递归
        route.children = filterAsyncRouter(route.children, roles);
      }
      // true，被保留
      return true;
    }
    //hasPermission = false ，false就会被过滤掉
    return false;
  })
  return accessedRouters;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      //所有的路由 = 普通 + 权限生成的
      state.routers = constantRouterMap.concat(routers);
      console.log('state.routers', state.routers);


    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters;
        if (roles.indexOf('admin') >= 0) {
          console.log('admin>=0');
          //roles有admin， router是最全的
          accessedRouters = asyncRouterMap;
        } else {
          //roles中没有admin,
          console.log('admin<0');
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
          // accessedRouters = '';
          // accessedRouters = asyncRouterMap;
        }
        console.log('accessedRouters', accessedRouters);
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
}

export default permission
