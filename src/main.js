import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/gloable.css'
import request from "@/utils/request"
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

Vue.use(ElementUI, {size: "mini"});

Vue.use(VueLazyload, {
  preLoad: 1.3,
  // 懒加载默认加载图片
  loading: 'https://img1.imgtp.com/2022/11/17/EsSRoTqt.png',
  // 加载失败后加载的图片
  error: 'https://img1.imgtp.com/2022/11/17/EsSRoTqt.png',
  attempt: 1
})

Vue.prototype.request = request;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
