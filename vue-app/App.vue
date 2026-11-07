<script setup>
import { onMounted, useTemplateRef } from "vue";
import { useMainStore } from "./stores/main";
import { Scene } from "./Scene";
import gsap from "gsap";

const mainStore = useMainStore();

const canvas = useTemplateRef("canvas");

/** @type {Scene} */
let scene;

onMounted(() => {
    scene = new Scene(canvas.value);
});

/**
 * @param ev {PointerEvent}
 */
function onClick(ev) {
    const windowId = scene.pickWindow(ev);
    if (!windowId) return;
    const win = scene.windows[windowId];
    const target = win.isOpen ? 0 : Math.PI;
    gsap.to(win.l.rotation, { y: -target, duration: 1 });
    gsap.to(win.r.rotation, { y: target, duration: 1 });
    win.isOpen = !win.isOpen;
}
</script>

<template>
    <canvas ref="canvas" @click="onClick"></canvas>
</template>
