import { defineStore } from "pinia";
import { ref } from "vue";

export const useMainStore = defineStore("main", () => {
    const user = ref(JSON.parse(document.body.dataset.user));

    const scene = ref(null);

    /**
     * @param ev {PointerEvent}
     */
    function focusWindow(ev) {
        const windowId = scene.value.pickWindow(ev);
        if (!windowId) return;
        const win = scene.value.house.windows[windowId];
        scene.value.focusWindow(win);
    }

    function zoomOut() {
        scene.value.zoomOut();
    }

    return {
        appVersion: document.body.dataset.appVersion,
        appName: document.body.dataset.appName,
        user,
        scene,
        focusWindow,
        zoomOut,
    };
});
