import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Window from "../views/Window.vue";
import { useMainStore } from "../stores/main";
import { redirectToLogin } from "../api";

const routes = [
    {
        path: "/",
        name: "home",
        component: Home,
    },
    {
        path: "/:winId",
        name: "window",
        component: Window,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from) => {
    console.log("beforeEach", { to, from });
    if (to.meta?.requireAuth && !useMainStore().user) {
        redirectToLogin(to.href);
        return false;
    }
});

export let previousRouteName = null;

router.afterEach((to, from) => {
    previousRouteName = from?.name;
});

export default router;
