import { defineStore } from "pinia";
import { ref } from "vue";

export const useMainStore = defineStore("main", () => {
    const user = ref(JSON.parse(document.body.dataset.user));

    return {
        appVersion: document.body.dataset.appVersion,
        appName: document.body.dataset.appName,
        user,
    };
});
