import { until, useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";
import { Scene } from "../drawing/Scene";
import gsap from "gsap";

export const useMainStore = defineStore("main", () => {
    const user = ref(JSON.parse(document.body.dataset.user));

    /** @type {import("vue").Ref<Scene>} */
    const scene = ref(null);
    const openWindows = useStorage("open-windows", []);
    const initialized = ref(false);

    async function initScene(canvas) {
        gsap.globalTimeline.timeScale(
            import.meta.env.VITE_APP_ANIMATION_SCALE ?? 1,
        );
        scene.value = new Scene(canvas);
        initialized.value = await scene.value.init();
        openWindows.value.forEach((winId) => {
            scene.value.openWindow(winId, 0);
        });
    }

    function isOpen(winId) {
        return openWindows.value.includes(winId);
    }

    async function goToWindow(winId, duration = 2) {
        await until(initialized).toBe(true);
        const tl = isOpen(winId)
            ? scene.value.insideWindow(winId, duration)
            : scene.value.focusWindow(winId, false, duration);
        return tl.then();
    }

    async function zoomOut() {
        await until(initialized).toBe(true);
        scene.value.zoomOut();
    }

    function openAndGoInsideWindow(winId) {
        return gsap
            .timeline()
            .add(scene.value.openWindow(winId))
            .add(scene.value.insideWindow(winId))
            .then(() => openWindows.value.push(winId));
    }

    function openAll() {
        scene.value.house.windows.forEach((win, id) => {
            scene.value.openWindow(id);
        });
    }

    return {
        appVersion: document.body.dataset.appVersion,
        appName: document.body.dataset.appName,
        user,
        scene,
        openWindows,
        initialized,
        initScene,
        isOpen,
        goToWindow,
        zoomOut,
        openAndGoInsideWindow,
        openAll,
    };
});
