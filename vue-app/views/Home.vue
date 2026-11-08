<script setup>
import { useMainStore } from "../stores/main";

const mainStore = useMainStore();

mainStore.scene.zoomOut(4);
</script>

<template>
    <button class="bg-white px-1" @click="mainStore.openAll">
        ouvrir tout
    </button>
</template>
