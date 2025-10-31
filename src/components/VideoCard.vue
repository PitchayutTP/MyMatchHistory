<template>
    <div class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
        <img :src="thumbnail" alt="thumbnail" class="w-full h-40 object-cover" />
        <div class="p-3">
            <h3 class="font-semibold text-gray-800 line-clamp-2">
                {{ title }}
            </h3>
            <p class="text-xs text-gray-500 mt-1 truncate" :title="uploaderEmail">
                {{ uploaderEmail }}
            </p>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    thumbnail: String,
    uploaderEmail: String, // ⭐️ 2. เพิ่ม Prop นี้เพื่อรับ Email ⭐️
});
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>