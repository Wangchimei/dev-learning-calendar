import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import vueTextareaAutosize from 'vue-textarea-autosize';
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.use(vueTextareaAutosize);

Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: 'AIzaSyAqX0IiiIpCxyPc3ZJBuE6F3_psu0wbvk0',
  authDomain: 'learning-map-00000.firebaseapp.com',
  databaseURL: 'https://learning-map-00000.firebaseio.com',
  projectId: 'learning-map-00000',
  storageBucket: 'learning-map-00000.appspot.com',
  messagingSenderId: '389145605423',
  appId: '1:389145605423:web:1db809bfd17816ff221dda',
});

export const db = firebase.firestore();

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app');
