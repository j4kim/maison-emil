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
    <div class="window-content pb-12" v-if="content">
        <h1>{{ content.title }}</h1>
        <template v-for="block in content.blocks">
            <div
                v-if="block.type === 'rich-content'"
                v-html="block.content.html"
            ></div>
            <img
                v-else-if="block.type === 'image'"
                class="mx-auto"
                :src="`storage/${block.content.filename}`"
            />
            <video
                v-else-if="block.type === 'video'"
                class="mx-auto"
                :src="`storage/${block.content.filename}`"
                controls
            ></video>
            <audio
                v-else-if="block.type === 'audio'"
                class="w-full"
                :src="`storage/${block.content.filename}`"
                controls
            ></audio>
        </template>
    </div>
</template>
