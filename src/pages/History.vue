<template>
    <div class="min-h-screen bg-gray-100 p-4 md:p-8">
        <div class="max-w-4xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center border-b pb-4 mb-6">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
                    ประวัติการแข่งขัน
                </h1>
            </div>

            <div class="flex flex-col gap-5">
                <div v-if="videoList.length === 0" class="text-center text-gray-500 py-10">
                    ยังไม่มีประวัติการแข่งขัน
                </div>

                <div v-for="video in videoList" :key="video.id" class="flex flex-col sm:flex-row items-start gap-4">
                    <a :href="video.videoSrc" target="_blank">
                        <img :src="video.thumbnail" :alt="video.title"
                            class="w-full sm:w-48 aspect-video object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-90" />
                    </a>

                    <div class="flex-1 min-w-0">
                        <a :href="video.videoSrc" target="_blank">
                            <h3 class="text-lg font-semibold text-gray-900 hover:text-blue-700 cursor-pointer"
                                :title="video.title">
                                {{ video.title }}
                            </h3>
                        </a>
                        <p class="text-sm text-gray-600 mt-1">
                            Sport:
                            <span class="font-medium">{{ video.sport_id }}</span>
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
                            <span class="font-medium">{{ video.result }} ({{ video.score }})</span>
                        </p>
                        <p class="text-sm text-gray-600">
                            note:
                            <span class="font-medium">{{ video.notes }}</span>
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                            Date:
                            {{
                                new Date(video.match_date).toLocaleDateString("th-TH")
                            }}
                        </p>
                    </div>

                    <div class="flex sm:flex-col gap-2 pt-2 sm:pt-0">
                        <button @click="editItem(video)"
                            class="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition">
                            แก้ไข
                        </button>
                        <button @click="deleteItem(video.id)"
                            class="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition">
                            ลบ
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <EditModal :isOpen="isModalOpen" :item="currentItemToEdit" @close="closeModal" @save="saveChanges" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import EditModal from "../components/EditModal.vue";

const videoList = ref([]);
const router = useRouter();

// ฟังก์ชันช่วยสร้าง Header
const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        router.push('/login');
        return null;
    }
    return { 'Authorization': `Bearer ${token}` };
};

async function fetchVideos() {
    try {
        const headers = getAuthHeaders();
        if (!headers) return;

        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/videos`,
            { headers }
        );
        videoList.value = response.data;
    } catch (error) {
        console.error("Error fetching videos:", error);
        if (error.response && error.response.status === 401) {
            router.push('/login');
        }
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
        const headers = getAuthHeaders();
        if (!headers) return;

        await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/api/videos/${id}`,
            { headers }
        );
        videoList.value = videoList.value.filter((video) => video.id !== id);
        console.log("ลบวิดีโอ ID:", id);
    } catch (error) {
        console.error("Error deleting video:", error);
        alert("ลบข้อมูลไม่สำเร็จ");
        if (error.response && error.response.status === 401) {
            router.push('/login');
        }
    }
}

function editItem(video) {
    // ⭐️ 4. แก้ไข: เปลี่ยนชื่อ field ให้ตรงกับข้อมูลจริงตอนส่งให้ Modal ⭐️
    // (EditModal.vue คาดหวัง 'sport' และ 'note' และ 'date')
    const itemToEdit = {
        ...video,
        sport: video.sport_id, // แปลง sport_id -> sport
        note: video.notes,     // แปลง notes -> note
        date: video.match_date // แปลง match_date -> date
    };

    currentItemToEdit.value = itemToEdit;
    isModalOpen.value = true;
    console.log("กำลังแก้ไขวิดีโอ:", video.title);
}

function closeModal() {
    isModalOpen.value = false;
    currentItemToEdit.value = null;
}

async function saveChanges(updatedItem) {
    try {
        const headers = getAuthHeaders();
        if (!headers) return;

        // ⭐️ 5. แก้ไข: แปลงชื่อ field กลับไปเป็นแบบที่ DB เก็บ ⭐️
        const itemToSave = {
            ...updatedItem,
            sport_id: updatedItem.sport,
            notes: updatedItem.note,
            match_date: updatedItem.date
        };
        // ลบ field ที่ชื่อไม่ตรงออก
        delete itemToSave.sport;
        delete itemToSave.note;
        delete itemToSave.date;


        const response = await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/api/videos/${itemToSave.id}`,
            itemToSave, // ส่งข้อมูลที่แปลงชื่อแล้ว
            { headers }
        );

        const index = videoList.value.findIndex((v) => v.id === itemToSave.id);
        if (index !== -1) {
            videoList.value[index] = response.data; // รับข้อมูลใหม่จาก DB
        }

        console.log("บันทึกข้อมูล ID:", itemToSave.id);
        closeModal();
    } catch (error) {
        console.error("Error saving video:", error);
        alert("บันทึกข้อมูลไม่สำเร็จ");
        if (error.response && error.response.status === 401) {
            router.push('/login');
        }
    }
}
</script>