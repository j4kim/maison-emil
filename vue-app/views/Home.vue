<script setup>
import { useMainStore } from "../stores/main";
import { previousRouteName } from "../router";

const mainStore = useMainStore();

const duration = previousRouteName === "window" ? 2 : 4;
mainStore.scene.zoomOut(duration);
</script>

<template>
    <button class="bg-white px-1" @click="mainStore.openAll">
        ouvrir tout
    </button>
</template>
