<template>
    <div class="min-h-screen bg-gray-100">
        <Navbar @upload="showUpload = true" v-model:search="searchTerm" />

        <div class="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            <VideoCard v-for="video in filteredVideos" :key="video.id" :title="video.title" :thumbnail="video.thumbnail"
                :uploaderEmail="video.uploaderEmail" @click="openVideoDetail(video)"
                class="cursor-pointer transition-transform hover:scale-105" />
        </div>

        <VideoDetailModal v-if="showVideoDetail && selectedVideo" :video="selectedVideo" @close="closeVideoDetail" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import VideoCard from "../components/VideoCard.vue";
import VideoDetailModal from "../components/VideoDetailModal.vue";

const showVideoDetail = ref(false);
const selectedVideo = ref(null);
const videos = ref([]);
const searchTerm = ref("");
const router = useRouter();

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
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push('/login');
            return;
        }

        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/videos`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        // ⭐️ 2. ข้อมูลที่ได้กลับมาจะมี uploaderEmail พ่วงมาด้วย ⭐️
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