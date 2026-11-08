<script setup>
import { useRoute } from "vue-router";
import { useMainStore } from "../stores/main";
import { ref } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiHome } from "@mdi/js";

const route = useRoute();
const mainStore = useMainStore();

const opening = ref(false);

async function open() {
    opening.value = true;
    await mainStore.openAndGoInsideWindow(+route.params.winId);
    opening.value = false;
}
</script>

<template>
    <div>
        <div class="absolute p-4">
            <button
                class="rounded-full bg-white p-2"
                @click="$router.push({ name: 'home' })"
            >
                <SvgIcon type="mdi" class="size-12" :path="mdiHome" />
            </button>
        </div>
        <div v-if="mainStore.isOpen(+route.params.winId)">
            <article class="prose-xl mx-auto max-w-4xl p-2">
                <h1>Fenêtre {{ route.params.winId }}</h1>
            </article>
        </div>
        <div
            v-else-if="!opening"
            class="flex h-dvh w-dvw items-center justify-center"
        >
            <button class="bg-white px-2 py-1 text-6xl" @click="open">
                ouvrir
            </button>
        </div>
    </div>
</template>
