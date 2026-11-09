<script setup>
import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "../stores/main";
import { computed, ref } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiArrowLeft, mdiArrowRight, mdiHome } from "@mdi/js";

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();

const opening = ref(false);

const winId = computed(() => +route.params.winId);

const windowState = computed(() => mainStore.getWindowState(winId.value));

async function open() {
    opening.value = true;
    await mainStore.openAndGoInsideWindow(winId.value);
    opening.value = false;
}

const navigating = ref(false);

const nav = computed(() => {
    const windows = mainStore.scene.house.windows;
    const prev = windows[winId.value - 1];
    const next = windows[winId.value + 1];
    return {
        prev,
        next,
        go: async (win) => {
            navigating.value = true;
            await mainStore.goToWindow(win.id, 2);
            router.push({ params: { winId: win.id } });
            navigating.value = false;
        },
    };
});
</script>

<template>
    <div>
        <div class="fixed flex w-full items-center justify-between gap-4 p-4">
            <button
                class="rounded-full bg-white p-2 hover:bg-sky-300"
                @click="router.push({ name: 'home' })"
            >
                <SvgIcon type="mdi" class="size-12" :path="mdiHome" />
            </button>
            <div class="flex gap-4">
                <button
                    class="rounded-full bg-white p-2 hover:bg-sky-300 disabled:opacity-50"
                    :disabled="!nav.prev"
                    @click="nav.go(nav.prev)"
                >
                    <SvgIcon type="mdi" class="size-8" :path="mdiArrowLeft" />
                </button>
                <button
                    class="rounded-full bg-white p-2 hover:bg-sky-300 disabled:opacity-50"
                    :disabled="!nav.next"
                    @click="nav.go(nav.next)"
                >
                    <SvgIcon type="mdi" class="size-8" :path="mdiArrowRight" />
                </button>
            </div>
        </div>
        <template v-if="!navigating">
            <div v-if="mainStore.isOpen(winId)">
                <article class="prose-lg mx-auto max-w-3xl p-2 pt-28">
                    <h1>Fenêtre {{ winId }}</h1>
                </article>
            </div>
            <div
                v-else-if="!opening"
                class="flex h-dvh w-dvw flex-col items-center justify-center gap-8"
            >
                <button
                    class="bg-white px-2 py-1 text-6xl hover:bg-sky-300 disabled:opacity-50"
                    @click="open"
                    :disabled="!windowState.openable"
                >
                    ouvrir
                </button>
                <div
                    v-if="!windowState.openable"
                    class="bg-sky-600 p-2 px-4 text-center text-3xl text-white"
                >
                    Tu pourras ouvrir cette fenêtre
                    {{ windowState.opensOn.fromNow() }}
                </div>
            </div>
        </template>
    </div>
</template>
