import Vue from 'vue'
import vueRouter from 'vue-router'
import Login from "@/pages/Login"
Vue.use(vueRouter)
export const publicRouter = [{
    path:'/login',
    component:Login,
    meta:{title:'登录'}

}]
export default new vueRouter({
    mode:"hash",
    routes:publicRouter
})