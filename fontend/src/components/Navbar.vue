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

        <router-link
            to="/upload"
            class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
            Upload
        </router-link>

        <router-link
            to="/history"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition ml-2"
        >
            History
        </router-link>
    </nav>
</template>

<script setup>
import { ref } from "vue";

const search = ref("");
</script>
