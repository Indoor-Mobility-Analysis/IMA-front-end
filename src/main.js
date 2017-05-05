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
// Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueVideoPlayer);
Vue.component('icon', Icon);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
