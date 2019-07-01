// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
// 引入路由
import myaxios from './assets/js/axios.js'
Vue.use(myaxios)
import './assets/css/login.css'
Vue.use(ElementUI)
// 引入element-tree-grid
import ElTreeGrid from 'element-tree-grid'
// 定义一个全局组件
// 引入moment
import myFilter from './assets/js/mymoment.js'
// 引入富文本框
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import BMap from 'BMap'
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(myFilter)
Vue.component(ElTreeGrid.name,ElTreeGrid);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
