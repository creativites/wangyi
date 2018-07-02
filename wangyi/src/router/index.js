import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import VueJsonp from "vue-jsonp"
import VueScroller from 'vue-scroller'  //滚动条刷新加载组件
import {ToastPlugin} from 'vux'		//刷新后的提示文字
Vue.use(Router)
Vue.use(VueJsonp);
Vue.use(VueScroller)
Vue.use(ToastPlugin)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
