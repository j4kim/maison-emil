<script setup>
import { onMounted, useTemplateRef } from "vue";
import { useMainStore } from "./stores/main";
import Ui from "./Ui.vue";

const mainStore = useMainStore();

const canvas = useTemplateRef("canvas");

onMounted(() => {
    mainStore.initScene(canvas.value);
});
</script>

<template>
    <canvas
        class="absolute"
        ref="canvas"
        @click="mainStore.focusWindow"
    ></canvas>
    <Ui class="absolute" />
</template>
