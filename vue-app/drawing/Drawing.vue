<script setup>
import { onMounted, useTemplateRef } from "vue";
import { useMainStore } from "../stores/main";

const mainStore = useMainStore();

const canvas = useTemplateRef("canvas");

onMounted(() => {
    mainStore.initScene(canvas.value);
});
</script>

<template>
    <canvas ref="canvas"></canvas>
</template>
