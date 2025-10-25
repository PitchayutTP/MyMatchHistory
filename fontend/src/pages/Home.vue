<template>
    <div class="min-h-screen bg-gray-100">
        <Navbar @upload="showUpload = true" />

        <div
            class="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
            <VideoCard
                v-for="video in videos"
                :key="video.id"
                :title="video.title"
                :thumbnail="video.thumbnail"
                @click="openVideoDetail(video)"
                class="cursor-pointer transition-transform hover:scale-105"
            />
        </div>

        <Upload
            v-if="showUpload"
            @close="showUpload = false"
            @uploaded="addVideo"
        />

        <VideoDetailModal
            v-if="showVideoDetail && selectedVideo"
            :video="selectedVideo"
            @close="closeVideoDetail"
        />
    </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "../components/Navbar.vue";
import VideoCard from "../components/VideoCard.vue";
import Upload from "./Upload.vue";
import VideoDetailModal from "../components/VideoDetailModal.vue";

const showUpload = ref(false);

const showVideoDetail = ref(false);
const selectedVideo = ref(null);

const videos = ref([
    {
        id: 1,
        title: "Vue 3 Tutorial",
        thumbnail: "https://picsum.photos/300/200?random=1",
        videoSrc:
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    {
        id: 2,
        title: "Build YouTube Clone",
        thumbnail: "https://picsum.photos/300/200?random=2",
        videoSrc:
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    {
        id: 3,
        title: "Frontend Tips",
        thumbnail: "https://picsum.photos/300/200?random=3",
        videoSrc:
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
]);

function openVideoDetail(video) {
    selectedVideo.value = video;
    showVideoDetail.value = true;
}

function closeVideoDetail() {
    showVideoDetail.value = false;
    selectedVideo.value = null;
}
</script>
