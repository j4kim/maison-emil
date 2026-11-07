<script setup>
import { useMainStore } from "./stores/main";

const mainStore = useMainStore();
</script>

<template>
    <div class="ui">
        <button class="bg-white px-1" @click="mainStore.zoomOut">retour</button>
    </div>
</template>
