import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Window from "../views/Window.vue";
import { useMainStore } from "../stores/main";
import { redirectToLogin } from "../api";
import { ref } from "vue";

export const navigating = ref(false);

const routes = [
    {
        path: "/",
        name: "home",
        component: Home,
        beforeEnter: (to, from) => {
            navigating.value = true;
            const mainStore = useMainStore();
            const duration = from.name === "window" ? 2 : 4;
            mainStore.scene
                .zoomOut(duration)
                .then(() => (navigating.value = false));
        },
    },
    {
        path: "/:winId",
        name: "window",
        component: Window,
        beforeEnter: (to, from) => {
            navigating.value = true;
            const mainStore = useMainStore();
            const duration = !from.name ? 0 : 2;
            mainStore
                .goToWindow(+to.params.winId, duration)
                .then(() => (navigating.value = false));
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
