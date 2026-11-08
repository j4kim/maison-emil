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
        beforeEnter: async (to, from) => {
            const mainStore = useMainStore();
            const duration = from.name === "window" ? 2 : 4;
            mainStore.scene.zoomOut(duration);
        },
    },
    {
        path: "/:winId",
        name: "window",
        component: Window,
        beforeEnter: async (to, from) => {
            const mainStore = useMainStore();
            const duration = !from.name ? 0 : 2;
            await mainStore.goToWindow(+to.params.winId, duration);
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from) => {
    if (to.meta?.requireAuth && !useMainStore().user) {
        redirectToLogin(to.href);
        return false;
    }
});

export default router;
