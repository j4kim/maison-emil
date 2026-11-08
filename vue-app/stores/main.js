import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";
import { Scene } from "../drawing/Scene";
import gsap from "gsap";

export const useMainStore = defineStore("main", () => {
    const user = ref(JSON.parse(document.body.dataset.user));

    /** @type {import("vue").Ref<Scene>} */
    const scene = ref(null);
    const focused = ref(null);
    const openWindows = useStorage("open-windows", []);

    async function initScene(canvas) {
        gsap.globalTimeline.timeScale(
            import.meta.env.VITE_APP_ANIMATION_SCALE ?? 1,
        );
        scene.value = new Scene(canvas);
        await scene.value.init();
        const introTl = gsap.timeline();
        introTl.add(scene.value.zoomOut(4), 0);
        openWindows.value.forEach((winId) => {
            introTl.add(scene.value.openWindow(winId), 2 + 2 * Math.random());
        });
    }

    function isOpen(winId) {
        return openWindows.value.includes(winId);
    }

    /**
     * @param ev {PointerEvent}
     */
    function focusWindow(ev) {
        const winId = scene.value.pickWindow(ev);
        if (!winId) return;
        isOpen(winId)
            ? scene.value.insideWindow(winId)
            : scene.value.focusWindow(winId);
        focused.value = winId;
    }

    function zoomOut() {
        scene.value.zoomOut();
        focused.value = null;
    }

    function openWindow() {
        gsap.timeline()
            .add(scene.value.openWindow(focused.value))
            .add(scene.value.insideWindow(focused.value));
        openWindows.value.push(focused.value);
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
        focused,
        openWindows,
        initScene,
        isOpen,
        focusWindow,
        zoomOut,
        openWindow,
        openAll,
    };
});
