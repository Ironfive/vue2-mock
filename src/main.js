import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "@/utils/Mock";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import BaiduMap from "vue-baidu-map";
import '@/assets/common.scss' // global css
import Echart from './components/echart/index.vue'
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component("Echart",Echart)
Vue.use(BaiduMap, {
  ak:'mkPO6JNKHGPvlTrNz28TDUSRL5UZa6en'
})
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
