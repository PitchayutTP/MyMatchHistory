<template>
    <div class="min-h-screen bg-gray-100 p-4 md:p-8">
        <div class="max-w-4xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center border-b pb-4 mb-6">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
                    ประวัติการอัพโหลด
                </h1>
            </div>

            <div class="flex flex-col gap-5">
                <div
                    v-if="historyList.length === 0"
                    class="text-center text-gray-500 py-10"
                >
                    ยังไม่มีประวัติการเข้าชม
                </div>

                <div
                    v-for="video in historyList"
                    :key="video.id"
                    class="flex flex-col sm:flex-row items-start gap-4"
                >
                    <a :href="video.url" target="_blank">
                        <img
                            :src="video.thumbnailUrl"
                            :alt="video.title"
                            class="w-full sm:w-48 aspect-video object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-90"
                        />
                    </a>

                    <div class="flex-1 min-w-0">
                        <a :href="video.url" target="_blank">
                            <h3
                                class="text-lg font-semibold text-gray-900 hover:text-blue-700 cursor-pointer"
                                :title="video.title"
                            >
                                {{ video.title }}
                            </h3>
                        </a>
                        <p class="text-sm text-gray-600 mt-1">
                            {{ video.channel }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                            ดูเมื่อ: {{ video.watchedAt }}
                        </p>
                    </div>

                    <div class="flex sm:flex-col gap-2 pt-2 sm:pt-0">
                        <button
                            @click="editItem(video.id)"
                            class="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition"
                        >
                            แก้ไข
                        </button>
                        <button
                            @click="deleteItem(video.id)"
                            class="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition"
                        >
                            ลบ
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <EditModal
            :isOpen="isModalOpen"
            :item="currentItemToEdit"
            @close="closeModal"
            @save="saveChanges"
        />
    </div>
</template>

<script setup>
import { ref } from "vue";
import EditModal from "../components/EditModal.vue";

const historyList = ref([
    {
        id: 1,
        title: "Vue 3 Composition API Tutorial for Beginners",
        channel: "Vue Mastery",
        thumbnailUrl: "https://i.ytimg.com/vi/1_lt8DR_0EY/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=1_lt8DR_0EY",
        watchedAt: "28 ตุลาคม 2568, 14:30น.",
    },
    {
        id: 2,
        title: "Tailwind CSS Full Course - From Beginner to Pro",
        channel: "Traversy Media",
        thumbnailUrl: "https://i.ytimg.com/vi/UBOj6rqRUME/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=UBOj6rqRUME",
        watchedAt: "27 ตุลาคม 2568, 19:15น.",
    },
    {
        id: 3,
        title: "Learn Pinia in 10 Minutes (Vue 3 State Management)",
        channel: "The Net Ninja",
        thumbnailUrl: "https://i.ytimg.com/vi/31gzwYV-V-8/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=31gzwYV-V-8",
        watchedAt: "27 ตุลาคม 2568, 11:05น.",
    },
]);

// *** 2. State สำหรับ Modal (เหมือนเดิม) ***
const isModalOpen = ref(false);
const currentItemToEdit = ref(null);

function deleteItem(id) {
    historyList.value = historyList.value.filter((video) => video.id !== id);
    console.log("ลบวิดีโอ ID:", id);
}

function editItem(id) {
    const video = historyList.value.find((v) => v.id === id);
    if (video) {
        currentItemToEdit.value = video;
        isModalOpen.value = true;
        console.log("กำลังแก้ไขวิดีโอ ID:", id);
    }
}

function closeModal() {
    isModalOpen.value = false;
    currentItemToEdit.value = null;
}

function saveChanges(updatedItem) {
    const index = historyList.value.findIndex((v) => v.id === updatedItem.id);
    if (index !== -1) {
        historyList.value[index] = updatedItem;
    }
    console.log("บันทึกข้อมูล ID:", updatedItem.id);
}
</script>
