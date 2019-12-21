import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import vueTextareaAutosize from 'vue-textarea-autosize';
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.use(vueTextareaAutosize);

Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: 'AIzaSyCDJONmWvZETjCCf5lMRjTVp8fukOs2xc0',
  authDomain: 'dev-learning-plan.firebaseapp.com',
  databaseURL: 'https://dev-learning-plan.firebaseio.com',
  projectId: 'dev-learning-plan',
  storageBucket: 'dev-learning-plan.appspot.com',
  messagingSenderId: '132619820768',
  appId: '1:132619820768:web:8604c2eabb62c38479fa85',
});

export const db = firebase.firestore();

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app');
