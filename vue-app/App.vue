<script setup>
import { useMainStore } from "./stores/main";

const mainStore = useMainStore();
</script>

<template>
    <h1 class="p-2 text-2xl">
        <RouterLink to="/">
            {{ mainStore.appName }}
        </RouterLink>
    </h1>
    <main class="p-2">
        <RouterView></RouterView>
    </main>
    <footer class="p-2 text-sm opacity-50">v{{ mainStore.appVersion }}</footer>
</template>
