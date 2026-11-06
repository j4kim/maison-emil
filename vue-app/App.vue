<script setup>
import { onMounted, useTemplateRef } from "vue";
import { useMainStore } from "./stores/main";
import { Scene } from "./Scene";

const mainStore = useMainStore();

const canvas = useTemplateRef("canvas");

let scene;

onMounted(() => {
    scene = new Scene(canvas.value);
});

function onClick(ev) {
    scene.pick(ev);
}
</script>

<template>
    <canvas ref="canvas" @click="onClick"></canvas>
</template>
