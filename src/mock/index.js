import Mock from 'mockjs'
import tableAPI from './table'
import loginAPI from './login'
import articleAPI from './article'
// 设置全局延时 没有延时的话有时候会检测不到数据变化 建议保留
Mock.setup({
  timeout: '300-600'
})

// 登录相关
Mock.mock(/\/api\/user\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/api\/user\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/api\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/api\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/api\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/api\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/api\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/api\/article\/update/, 'post', articleAPI.updateArticle)

// 用户相关
Mock.mock(/\/api\/user\/listpage/, 'get', tableAPI.getUserList)
Mock.mock(/\/api\/user\/remove/, 'get', tableAPI.deleteUser)
Mock.mock(/\/api\/user\/batchremove/, 'get', tableAPI.batchremove)
Mock.mock(/\/api\/user\/add/, 'get', tableAPI.createUser)
Mock.mock(/\/api\/user\/edit/, 'get', tableAPI.updateUser)
export default Mock
