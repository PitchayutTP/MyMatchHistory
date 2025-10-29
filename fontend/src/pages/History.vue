<template>
    <div class="min-h-screen bg-gray-100 p-4 md:p-8">
        <div class="max-w-4xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center border-b pb-4 mb-6">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
                    ประวัติการแข่งขัน
                </h1>
            </div>

            <div class="flex flex-col gap-5">
                <div
                    v-if="videoList.length === 0"
                    class="text-center text-gray-500 py-10"
                >
                    ยังไม่มีประวัติการแข่งขัน
                </div>

                <div
                    v-for="video in videoList"
                    :key="video.id"
                    class="flex flex-col sm:flex-row items-start gap-4"
                >
                    <a :href="video.videoSrc" target="_blank">
                        <img
                            :src="video.thumbnail"
                            :alt="video.title"
                            class="w-full sm:w-48 aspect-video object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-90"
                        />
                    </a>

                    <div class="flex-1 min-w-0">
                        <a :href="video.videoSrc" target="_blank">
                            <h3
                                class="text-lg font-semibold text-gray-900 hover:text-blue-700 cursor-pointer"
                                :title="video.title"
                            >
                                {{ video.title }}
                            </h3>
                        </a>
                        <p class="text-sm text-gray-600 mt-1">
                            Sport:
                            <span class="font-medium">{{ video.sport }}</span>
                        </p>
                        <p class="text-sm text-gray-600">
                            Opponent:
                            <span class="font-medium">{{
                                video.opponent
                            }}</span>
                        </p>
                        <p class="text-sm text-gray-600">
                            Location:
                            <span class="font-medium">{{
                                video.location
                            }}</span>
                        </p>
                        <p class="text-sm text-gray-600">
                            result:
                            <span class="font-medium"
                                >{{ video.result }} ({{ video.score }})</span
                            >
                        </p>
                        <p class="text-sm text-gray-600">
                            note:
                            <span class="font-medium">{{ video.note }}</span>
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                            Date:
                            {{
                                new Date(video.date).toLocaleDateString("th-TH")
                            }}
                        </p>
                    </div>

                    <div class="flex sm:flex-col gap-2 pt-2 sm:pt-0">
                        <button
                            @click="editItem(video)"
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
import { ref, onMounted } from "vue";
import axios from "axios";
import EditModal from "../components/EditModal.vue";

const videoList = ref([]);

async function fetchVideos() {
    try {
        const response = await axios.get("http://localhost:3000/api/videos");
        videoList.value = response.data;
    } catch (error) {
        console.error("Error fetching videos:", error);
    }
}

onMounted(() => {
    fetchVideos();
});

const isModalOpen = ref(false);
const currentItemToEdit = ref(null);

async function deleteItem(id) {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
        return;
    }

    try {
        await axios.delete(`http://localhost:3000/api/videos/${id}`);
        videoList.value = videoList.value.filter((video) => video.id !== id);
        console.log("ลบวิดีโอ ID:", id);
    } catch (error) {
        console.error("Error deleting video:", error);
        alert("ลบข้อมูลไม่สำเร็จ");
    }
}

function editItem(video) {
    currentItemToEdit.value = { ...video };
    isModalOpen.value = true;
    console.log("กำลังแก้ไขวิดีโอ:", video.title);
}

function closeModal() {
    isModalOpen.value = false;
    currentItemToEdit.value = null;
}

async function saveChanges(updatedItem) {
    try {
        const response = await axios.put(
            `http://localhost:3000/api/videos/${updatedItem.id}`,
            updatedItem,
        );

        const index = videoList.value.findIndex((v) => v.id === updatedItem.id);
        if (index !== -1) {
            videoList.value[index] = response.data;
        }

        console.log("บันทึกข้อมูล ID:", updatedItem.id);
        closeModal();
    } catch (error) {
        console.error("Error saving video:", error);
        alert("บันทึกข้อมูลไม่สำเร็จ");
    }
}
</script>
