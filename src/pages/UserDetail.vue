<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import axios from "axios";
import VideoCard from "../components/VideoCard.vue"; // ⭐️ 1. Import VideoCard
import VideoDetailModal from "../components/VideoDetailModal.vue"; // ⭐️ 1. Import Modal

const route = useRoute();
const router = useRouter();
const userId = route.params.id; // ⭐️ นี่คือ ID (SUB) ของ User ที่ Admin คลิก

const user = ref(null);
const videos = ref([]); // ⭐️ 2. เปลี่ยนชื่อจาก historyItems เป็น videos
const isLoading = ref(true);
const error = ref(null);

// ⭐️ (State สำหรับ Modal)
const showVideoDetail = ref(false);
const selectedVideo = ref(null);

// ฟังก์ชันช่วยสร้าง Header
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    router.push('/login');
    return null;
  }
  return { 'Authorization': `Bearer ${token}` };
};

onMounted(async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const headers = getAuthHeaders();
    if (!headers) return;

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // ⭐️ 3. เรียก API ที่เราสร้างไว้ (API Gateway)
    const [userResponse, videosResponse] = await Promise.all([
      axios.get(`${apiUrl}/api/profile/${userId}`, { headers }), // ⭐️ ใช้ /api/profile (ที่เชื่อมกับ Lambda getProfile)
      axios.get(`${apiUrl}/api/history/${userId}`, { headers })  // ⭐️ /api/history/{id} (ที่เชื่อมกับ getVideosForUser)
    ]);

    user.value = userResponse.data;
    videos.value = videosResponse.data; // ⭐️ 4. เก็บข้อมูลใน videos
  } catch (err) {
    console.error("Error fetching user details:", err);
    error.value = "ไม่สามารถโหลดข้อมูลได้";
    if (err.response && err.response.status === 401) { router.push('/login'); }
  } finally {
    isLoading.value = false;
  }
});

// ⭐️ 5. ฟังก์ชันสำหรับเปิด/ปิด Modal (เหมือนหน้า Home)
function openVideoDetail(video) {
  selectedVideo.value = video;
  showVideoDetail.value = true;
}
function closeVideoDetail() {
  showVideoDetail.value = false;
  selectedVideo.value = null;
}

</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col">
    <Navbar :showUploadButton="false" />

    <div class="container mx-auto p-8 overflow-y-auto flex-1">
      <div v-if="isLoading" class="text-center text-gray-500">
        <p>Loading...</p>
      </div>

      <div v-else-if="error" class="text-center text-red-500">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="user">
        <div class="bg-white p-6 rounded-lg shadow-md flex items-start space-x-6">
          <img :src="user.imageUrl || 'https://via.placeholder.com/150'" :alt="user.firstname"
            class="w-32 h-32 rounded-full object-cover" />
          <div>
            <h1 class="text-4xl font-bold text-gray-800">
              {{ user.firstname || user.email }} {{ user.lastname }}
            </h1>
            <p class="text-lg text-gray-600 mt-2">{{ user.description }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ user.email }}</p>
          </div>
        </div>

        <div class="mt-10">
          <h2 class="text-2xl font-semibold mb-4">Videos by this user</h2>

          <div v-if="videos.length === 0" class="text-center text-gray-500 py-10">
            User has not uploaded any videos.
          </div>

          <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <VideoCard v-for="video in videos" :key="video.id" :title="video.title" :thumbnail="video.thumbnail"
              @click="openVideoDetail(video)" class="cursor-pointer transition-transform hover:scale-105" />
          </div>
        </div>
      </div>
    </div>

    <VideoDetailModal v-if="showVideoDetail && selectedVideo" :video="selectedVideo" @close="closeVideoDetail" />
  </div>
</template>