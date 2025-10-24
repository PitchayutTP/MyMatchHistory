<template>
    <div class="min-h-screen bg-gray-100">
        <Navbar @upload="showUpload = true" />

        <div
            class="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
            <VideoCard
                v-for="video in videos"
                :key="video.id"
                :title="video.title"
                :thumbnail="video.thumbnail"
            />
        </div>

        <Upload
            v-if="showUpload"
            @close="showUpload = false"
            @uploaded="addVideo"
        />
    </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "../components/Navbar.vue";
import VideoCard from "../components/VideoCard.vue";
import Upload from "./Upload.vue";

const showUpload = ref(false);
const videos = ref([
    {
        id: 1,
        title: "Vue 3 Tutorial",
        thumbnail: "https://picsum.photos/300/200?random=1",
    },
    {
        id: 2,
        title: "Build YouTube Clone",
        thumbnail: "https://picsum.photos/300/200?random=2",
    },
    {
        id: 3,
        title: "Frontend Tips",
        thumbnail: "https://picsum.photos/300/200?random=3",
    },
]);

function addVideo(newVideo) {
    videos.value.unshift({
        id: Date.now(),
        title: newVideo.title,
        thumbnail: URL.createObjectURL(newVideo.file),
    });
}
</script>
