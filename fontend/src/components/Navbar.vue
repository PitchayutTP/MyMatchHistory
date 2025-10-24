<template>
    <nav class="bg-white shadow-md px-4 py-2 flex items-center justify-between">
        <div class="text-2xl font-bold text-orange-600">My History</div>

        <div class="flex-1 px-4">
            <input
                type="text"
                placeholder="Search..."
                class="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
                v-model="search"
            />
        </div>

        <button
            class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
            @click="goToUpload"
        >
            Upload
        </button>
    </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const search = ref("");
const router = useRouter();

function goToUpload() {
    router.push("/upload");
}
</script>
