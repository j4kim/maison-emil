<script setup>
import { useRoute } from "vue-router";
import { useMainStore } from "../stores/main";

const route = useRoute();
const mainStore = useMainStore();
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
