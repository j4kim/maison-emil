import { defineStore } from "pinia";
import { ref } from "vue";

export const useMainStore = defineStore("main", () => {
    const user = ref(JSON.parse(document.body.dataset.user));

    const scene = ref(null);
    const focused = ref(null);
    const openWindows = ref([]);

    /**
     * @param ev {PointerEvent}
     */
    function focusWindow(ev) {
        const windowId = scene.value.pickWindow(ev);
        if (!windowId) return;
        const win = scene.value.house.windows[windowId];
        scene.value.focusWindow(win);
        focused.value = windowId;
    }

    function zoomOut() {
        scene.value.zoomOut();
        focused.value = null;
    }

    function open() {
        const win = scene.value.house.windows[focused.value];
        scene.value.open(win);
        openWindows.value.push(focused.value);
    }

    function openAll() {
        scene.value.house.windows.forEach((win) => {
            scene.value.open(win);
        });
    }

    return {
        appVersion: document.body.dataset.appVersion,
        appName: document.body.dataset.appName,
        user,
        scene,
        focused,
        openWindows,
        focusWindow,
        zoomOut,
        open,
        openAll,
    };
});
