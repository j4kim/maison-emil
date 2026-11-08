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
    <div
        v-if="!mainStore.isOpen(+route.params.winId)"
        class="flex h-dvh w-dvw items-center justify-center"
    >
        <button
            class="bg-white px-2 py-1 text-6xl"
            @click="mainStore.openAndGoInsideWindow(+route.params.winId)"
        >
            ouvrir
        </button>
    </div>
</template>
