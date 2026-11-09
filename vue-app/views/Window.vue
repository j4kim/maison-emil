<script setup>
import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "../stores/main";
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiArrowLeft, mdiArrowRight, mdiHome } from "@mdi/js";
import WindowContent from "../components/WindowContent.vue";
import { navigating } from "../router";

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();

const winId = computed(() => +route.params.winId);

const windowState = computed(() => mainStore.getWindowState(winId.value));

async function open() {
    navigating.value = true;
    await mainStore.openAndGoInsideWindow(winId.value);
    navigating.value = false;
}

const nav = computed(() => {
    const windows = mainStore.scene.house.windows;
    const prev = windows[winId.value - 1];
    const next = windows[winId.value + 1];
    return {
        prev,
        next,
        go: async (win) => {
            navigating.value = true;
            router.push({ params: { winId: win.id } });
            await mainStore.navigateFromTo(winId.value, win.id);
            navigating.value = false;
        },
    };
});

const ratio = computed(() => mainStore.scene.ratio);
const articleWidth = computed(
    () => `${Math.min(100, (1 / ratio.value) * 100)}%`,
);
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
                    :disabled="!nav.prev || navigating"
                    @click="nav.go(nav.prev)"
                >
                    <SvgIcon type="mdi" class="size-8" :path="mdiArrowLeft" />
                </button>
                <button
                    class="rounded-full bg-white p-2 hover:bg-sky-300 disabled:opacity-50"
                    :disabled="!nav.next || navigating"
                    @click="nav.go(nav.next)"
                >
                    <SvgIcon type="mdi" class="size-8" :path="mdiArrowRight" />
                </button>
            </div>
        </div>
        <div v-show="mainStore.isOpen(winId) && !navigating">
            <article
                class="prose sm:prose-lg md:prose-xl mx-auto p-2 px-6 pt-28 lg:pt-6"
                :style="{ maxWidth: articleWidth }"
            >
                <h3>Fenêtre {{ winId }}</h3>
                <WindowContent :winId />
            </article>
        </div>
        <div
            v-show="!mainStore.isOpen(winId) && !navigating"
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
    </div>
</template>
