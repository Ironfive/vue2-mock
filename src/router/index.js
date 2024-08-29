import Vue from "vue";
import vueRouter from "vue-router";
import Login from "@/pages/Login";
import root from "@/components/root.vue";
import home from "@/pages/home/home.vue";
Vue.use(vueRouter);
export const publicRouter = [
  {
    path: "/",
    redirect: "/home", // 设置首页路由为 "/home"
  },
  {
    path: "/root",
    component: root,
    name: "root",
    meta: { title: "富文本" },
  },
  {
    path: "/home",
    component: home,
    name: "Home",
    meta: { title: "首页" },
  },
  {
    path: "/login",
    component: Login,
    meta: { title: "登录" },
  },
  {
    path:'/cityOption',
    name:'Option',
    component: () => import('@/pages/position/index.vue'),
    meta: { title: "城市定位" },
  },{
  path:'/caculateResult',
    name:'CaculateResult',
    component: ()=>import('@/pages/home/components/caculateResult'),
    meta: { title: "测算结果" },
  },{
  path:'/scrollPage',
    name:'ScrollPage',
    component: ()=>import('@/pages/animation/scrollPage'),
    meta: { title: "滚动页面" },
  }
];
export default new vueRouter({
  mode: "hash",
  routes: publicRouter,
});
