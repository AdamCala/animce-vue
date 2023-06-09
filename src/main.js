import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import ScoreboardPage from './components/ScoreboardPage.vue';
import AdminPage from './components/AdminPage.vue';
import StartPage from './components/StartPage.vue';

const app = createApp(App);

const routes = [
    { path: '/', component: StartPage}, // Default page
    { path: '/scoreboard', component: ScoreboardPage }, // New page
    { path: '/admin', component: AdminPage } // New page
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

app.use(router);
app.mount('#app');
