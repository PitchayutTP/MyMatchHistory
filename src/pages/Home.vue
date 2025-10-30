<template>
    <div class="min-h-screen bg-gray-100">
        <Navbar @upload="showUpload = true" v-model:search="searchTerm" />

        <div class="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <VideoCard v-for="video in filteredVideos" :key="video.id" :title="video.title" :thumbnail="video.thumbnail"
                @click="openVideoDetail(video)" class="cursor-pointer transition-transform hover:scale-105" />
        </div>

        <VideoDetailModal v-if="showVideoDetail && selectedVideo" :video="selectedVideo" @close="closeVideoDetail" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router"; // ⭐️ เพิ่ม useRouter
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import VideoCard from "../components/VideoCard.vue";
import VideoDetailModal from "../components/VideoDetailModal.vue";

const showVideoDetail = ref(false);
const selectedVideo = ref(null);
const videos = ref([]);
const searchTerm = ref("");
const router = useRouter(); // ⭐️ เพิ่ม useRouter

const filteredVideos = computed(() => {
    if (!searchTerm.value) {
        return videos.value;
    }
    return videos.value.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.value.toLowerCase()),
    );
});

async function fetchVideos() {
    try {
        // ⭐️ 1. ดึง Token
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push('/login');
            return;
        }

        // ⭐️ 2. ส่ง Token ไปใน Header
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/videos`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        videos.value = response.data;
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

function openVideoDetail(video) {
    selectedVideo.value = video;
    showVideoDetail.value = true;
}

function closeVideoDetail() {
    showVideoDetail.value = false;
    selectedVideo.value = null;
}
</script>