<script setup>
import { ref, watchEffect } from "vue";
import { get } from "../api";

const props = defineProps({ winId: Number });

const content = ref(null);

watchEffect(async () => {
    content.value = await get("window-content", props.winId);
});
</script>

<template>
    <div class="window-content" v-if="content">
        <h1>{{ content.title }}</h1>
        <div v-for="block in content.blocks">
            <div
                v-if="block.type === 'rich-content'"
                v-html="block.content.html"
            ></div>
        </div>
    </div>
</template>
