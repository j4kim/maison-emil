<script setup>
import { get } from "../api";

const props = defineProps({ winId: Number });

const content = await get("window-content", props.winId);
</script>

<template>
    <div class="window-content">
        <h1>{{ content.title }}</h1>
        <div v-for="block in content.blocks">
            <div
                v-if="block.type === 'rich-content'"
                v-html="block.content.html"
            ></div>
        </div>
    </div>
</template>
