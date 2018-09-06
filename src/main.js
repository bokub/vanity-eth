/* eslint-env browser */

import Vue from 'vue';
import App from './App.vue';

document.body.removeAttribute('style');

// eslint-disable-next-line no-new
new Vue({
    el: '#app',
    render: (h) => h(App)
});
