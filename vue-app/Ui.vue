<script setup>
import { useMainStore } from "./stores/main";

const mainStore = useMainStore();
</script>

<template>
    <div class="ui">
        <button
            v-if="mainStore.focused"
            class="bg-white px-1"
            @click="mainStore.zoomOut"
        >
            retour
        </button>
        <button
            v-if="
                mainStore.focused &&
                !mainStore.openWindows.includes(mainStore.focused)
            "
            class="bg-white px-1"
            @click="mainStore.openWindow"
        >
            ouvrir
        </button>
        <button class="bg-white px-1" @click="mainStore.openAll">
            ouvrir tout
        </button>
    </div>
</template>
