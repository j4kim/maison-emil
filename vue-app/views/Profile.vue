<script setup>
import { ref } from "vue";
import { get } from "../api";
import { useMainStore } from "../stores/main";

const mainStore = useMainStore();

const quote = ref(null);

get("inspire").then((data) => (quote.value = data));
</script>

<template>
    <div>Bienvenue {{ mainStore.user.name }}</div>
    <blockquote class="whitespace-pre" v-html="quote"></blockquote>
</template>
