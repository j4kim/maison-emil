<script setup>
import { onMounted, useTemplateRef } from "vue";
import { useMainStore } from "./stores/main";
import { Scene } from "./Scene";

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
    const win = scene.house.windows[windowId];
    scene.focusWindow(win);
}
</script>

<template>
    <canvas ref="canvas" @click="onClick"></canvas>
</template>
