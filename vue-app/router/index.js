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

router.beforeEach((to) => {
    if (to.meta?.requireAuth && !useMainStore().user) {
        redirectToLogin(to.href);
        return false;
    }
});

export default router;
