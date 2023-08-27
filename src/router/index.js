import Vue from "vue";
import vueRouter from "vue-router";
import Login from "@/pages/Login";
import root from "@/components/root.vue";

Vue.use(vueRouter);
export const publicRouter = [
  {
    path: "/",
    redirect: "/root", // 设置首页路由为 "/root"
  },
  {
    path: "/root",
    component: root,
    name: "root",
    meta: { title: "富文本" },
  },
  {
    path: "/login",
    component: Login,
    meta: { title: "登录" },
  },
];
export default new vueRouter({
  mode: "hash",
  routes: publicRouter,
});
