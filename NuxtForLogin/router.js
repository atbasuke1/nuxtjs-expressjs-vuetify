import Vue from 'vue';
import Router from 'vue-router';
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import Photo from './pages/photo.vue'
import VueJsPaginate from "vuejs-paginate";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.component("vuejs-paginate", VueJsPaginate);
Vue.use(Router);
Vue.config.devtools = true
export const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/Register',
      component: Register
    },
    {
      path: '/'
    },
    {
      path: '/photos',
      component: Photo
    }
  ]
});