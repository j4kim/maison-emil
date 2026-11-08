<script setup>
import { useRoute } from "vue-router";
import { useMainStore } from "../stores/main";
import { previousRouteName } from "../router";

const route = useRoute();
const mainStore = useMainStore();

const duration = !previousRouteName ? 0 : 2;
mainStore.goToWindow(+route.params.winId, duration);
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
