import { param2Obj } from '@/utils'

const userMap = {

  //这里写死了，2个用户名
  admin: {
    code: 200,
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://raw.githubusercontent.com/mgbq/nx-admin/master/src/assets/img/home/logo.png',
    name: 'Super Admin'
  },
  editor: {
    code: 200,
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default {
  loginByUsername: config => {
    console.log(JSON.stringify(config));
    const { username } = JSON.parse(config.body)

    //这里就2个用户名 admin登陆就是返回 userMap['admin']
    return userMap[username]
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },
  logout: () => {
    return {
      code: 200,
      Message: 'success'
    }
  }
}
