// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueVideoPlayer from 'vue-video-player'
import 'vue-awesome/icons'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Icon from 'vue-awesome/components/Icon'

// Set language for Elements, timepicker
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)

import VueSocketio from 'vue-socket.io'
// Vue.use(VueSocketio, 'http://localhost:5000/test')
Vue.use(VueSocketio, 'http://itf170b.cse.ust.hk:5000/test')

// Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueVideoPlayer);
Vue.component('icon', Icon);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
