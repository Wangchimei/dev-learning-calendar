import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import vueTextareaAutosize from 'vue-textarea-autosize';
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.use(vueTextareaAutosize);

Vue.config.productionTip = false;

firebase.initializeApp({});

export const db = firebase.firestore();

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app');
