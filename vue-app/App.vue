<script setup>
import { useRoute, useRouter } from "vue-router";
import Drawing from "./drawing/Drawing.vue";
import { useMainStore } from "./stores/main.js";

const router = useRouter();
const route = useRoute();
const store = useMainStore();

function handleClick(ev) {
    if (route.name !== "home") return;
    if (!store.initialized) return;
    const winId = store.scene.pickWindow(ev);
    if (!winId) return;
    router.push({ name: "window", params: { winId } });
}
</script>

<template>
    <Drawing class="fixed" @click="handleClick" />
    <RouterView class="relative" />
</template>
