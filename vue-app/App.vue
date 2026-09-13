<script setup>
import { onMounted, useTemplateRef } from "vue";
import { useMainStore } from "./stores/main";
import { Scene } from "./Scene";

const mainStore = useMainStore();

const canvas = useTemplateRef("canvas");

onMounted(() => {
    new Scene(canvas.value);
});
</script>

<template>
    <canvas ref="canvas"></canvas>
</template>
