<template>
    <div
        class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
    >
        <img
            :src="thumbnail"
            alt="thumbnail"
            class="w-full h-40 object-cover"
        />
        <div class="p-3">
            <h3 class="font-semibold text-gray-800 line-clamp-2">
                {{ title }}
            </h3>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    thumbnail: String,
});
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
