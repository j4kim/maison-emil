import { until, useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";
import { Scene } from "../drawing/Scene";
import gsap from "gsap";
import dayjs from "../plugins/dayjs";

export const useMainStore = defineStore("main", () => {
    const user = ref(JSON.parse(document.body.dataset.user));

    /** @type {import("vue").Ref<Scene>} */
    const scene = ref(null);
    const openWindows = useStorage("open-windows", []);
    const initialized = ref(false);

    const now = dayjs();
    const year = +import.meta.env.VITE_APP_CAL_YEAR_ ?? now.year();
    const month = (+import.meta.env.VITE_APP_CAL_MONTH ?? now.month()) - 1;
    const calStart = dayjs({ year, month });

    function getWindowState(winId) {
        const opensOn = calStart.clone().date(winId);
        return {
            opensOn,
            isOpen: isOpen(winId),
            openable: opensOn < now,
        };
    }

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
            ? scene.value.focusWindow(winId, true, duration)
            : scene.value.focusWindow(winId, false, duration);
        return tl.then();
    }

    async function navigateFromTo(fromWinId, toWinId) {
        await until(initialized).toBe(true);
        const fromIsOpen = getWindowState(fromWinId).isOpen;
        const toIsOpen = getWindowState(toWinId).isOpen;
        const tl = gsap.timeline();
        const stepDuration = 0.8;
        if (fromIsOpen) {
            tl.add(scene.value.focusWindow(fromWinId, false, stepDuration));
        }
        tl.add(scene.value.focusWindow(toWinId, false, stepDuration));
        if (toIsOpen) {
            tl.add(scene.value.focusWindow(toWinId, true, stepDuration));
        }
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
            .add(scene.value.focusWindow(winId, true))
            .then(() => openWindows.value.push(winId))
            .then(() => scene.value.house.updateWindowState(winId));
    }

    return {
        appVersion: document.body.dataset.appVersion,
        appName: document.body.dataset.appName,
        user,
        scene,
        openWindows,
        initialized,
        getWindowState,
        initScene,
        isOpen,
        goToWindow,
        navigateFromTo,
        zoomOut,
        openAndGoInsideWindow,
    };
});
