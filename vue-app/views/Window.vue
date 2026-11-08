<script setup>
import { useRoute } from "vue-router";
import { useMainStore } from "../stores/main";

const route = useRoute();
const mainStore = useMainStore();

mainStore.goToWindow(+route.params.winId);
</script>

<template>
    <div>
        <div>Fenêtre {{ route.params.winId }}</div>
        <button
            v-if="!mainStore.isOpen(+route.params.winId)"
            class="bg-white px-1"
            @click="mainStore.openAndGoInsideWindow(+route.params.winId)"
        >
            ouvrir
        </button>
    </div>
</template>
