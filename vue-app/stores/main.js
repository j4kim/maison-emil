import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";
import { Scene } from "../Scene";
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
        openWindows.value.forEach((windowId) => {
            const win = scene.value.house.windows[windowId];
            introTl.add(scene.value.openWindow(win), 2 + 2 * Math.random());
        });
    }

    function isOpen(windowId) {
        return openWindows.value.includes(windowId);
    }

    /**
     * @param ev {PointerEvent}
     */
    function focusWindow(ev) {
        const windowId = scene.value.pickWindow(ev);
        if (!windowId) return;
        const win = scene.value.house.windows[windowId];
        isOpen(windowId)
            ? scene.value.insideWindow(win)
            : scene.value.focusWindow(win);
        focused.value = windowId;
    }

    function zoomOut() {
        scene.value.zoomOut();
        focused.value = null;
    }

    function openWindow() {
        const win = scene.value.house.windows[focused.value];
        gsap.timeline()
            .add(scene.value.openWindow(win))
            .add(scene.value.insideWindow(win));
        openWindows.value.push(focused.value);
    }

    function openAll() {
        scene.value.house.windows.forEach((win) => {
            scene.value.openWindow(win);
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
