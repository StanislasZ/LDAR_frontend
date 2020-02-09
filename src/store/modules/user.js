import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),     //设置为用户名
    userId: '',
    name: '',
    avatar: '',
    roles: [],
    permissions: []

  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }

  },

  actions: {
    // 登录，只返回一个token，装入vuex中
    Login({ commit }, userInfo) {

      console.log(userInfo.username + ', ' + userInfo.password);

      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {

        //@/api/login中的login方法
        login(username, userInfo.password).then(response => {

          // 类似于ajax请求后的
          // success: function(response) {...}
          console.log('返回的response is ' + JSON.stringify(response));


          const data = response.data;
          console.log('token is ' + data.token);
          //设置token(传回来的里的token)
          setToken(data.token);
          // 上面第一个参数 { commit } 等效于 context
          // commit就是  context.commit
          // SET_TOKEN是mutations里的方法
          commit('SET_TOKEN', data.token);  //把token存在store中
          resolve();
        }).catch(error => {
          console.log("login回调 -> catch error")
          reject(error);
        })
      });
    },

    //这里才是获取用户信息（主要是role和permission）
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {


          getInfo(state.token).then(response => {
            const data = response.data.userPermission;
            console.log("in func:getInfo... data is " + JSON.stringify(data));
            if (data.roleName && data.roleName.length > 0) { // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', data.roleName);
            } else {
              reject('getInfo: roles must be a non-null array !');
            }
            commit('SET_NAME', data.nickname);
            commit('SET_AVATAR', data.avatar);
            commit('SET_PERMISSIONS', data.permissionList);
            commit('SET_USERID', data.userId);
            console.log("state is " + JSON.stringify(state));
            resolve(response);
          }).catch(error => {
            reject(error);
          })



      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          commit('SET_PERMISSIONS', []);
          commit('SET_USERID', '');
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      })
    },
    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getInfo(role).then(response => {
          const data = response
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve()
        })
      })
    }
  }
}

export default user
