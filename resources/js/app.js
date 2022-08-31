import Vue from 'vue'
import store from '../../store';

//Main pages
import App from './views/app.vue'
import '../css/app.css'


const app = new Vue({
    store,
    el: '#app',
    components: { App }
});