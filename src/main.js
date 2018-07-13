import Vue from 'vue';
import App from './App';

import './assets/style/reset';

const root = document.createElement('div');

document.body.appendChild(root);

new Vue({
    render: h => h(App)
}).$mount(root);