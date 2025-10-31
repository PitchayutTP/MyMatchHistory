<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import axios from "axios";
// ⭐️ 1. Import Modal ที่จำเป็น
import VideoDetailModal from "../components/VideoDetailModal.vue";
import EditModal from "../components/EditModal.vue";

const route = useRoute();
const router = useRouter();
const userId = route.params.id;

const user = ref(null);
const videos = ref([]);
const isLoading = ref(true);
const error = ref(null);

// ⭐️ 2. เพิ่ม State สำหรับ Modal (ทั้งสองแบบ)
const showVideoDetail = ref(false);
const selectedVideo = ref(null);
const isModalOpen = ref(false); // (สำหรับ EditModal)
const currentItemToEdit = ref(null); // (สำหรับ EditModal)


// ⭐️ (ฟังก์ชัน Get Header เหมือนเดิม)
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    router.push('/login');
    return null;
  }
  return { 'Authorization': `Bearer ${token}` };
};

// ⭐️ (onMounted เหมือนเดิม)
onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const headers = getAuthHeaders();
    if (!headers) return;
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const [userResponse, videosResponse] = await Promise.all([
      axios.get(`${apiUrl}/api/profile/${userId}`, { headers }),
      axios.get(`${apiUrl}/api/history/${userId}`, { headers })
    ]);

    user.value = userResponse.data;
    videos.value = videosResponse.data;
  } catch (err) {
    console.error("Error fetching user details:", err);
    error.value = "ไม่สามารถโหลดข้อมูลได้";
    if (err.response && err.response.status === 401) { router.push('/login'); }
  } finally {
    isLoading.value = false;
  }
});

// ⭐️ 3. เพิ่มฟังก์ชันทั้งหมดจาก History.vue (Delete, Edit, Save) ⭐️
// (ฟังก์ชันสำหรับเปิด Modal "ดู" วิดีโอ)
function openVideoDetail(video) {
  selectedVideo.value = video;
  showVideoDetail.value = true;
}
function closeVideoDetail() {
  showVideoDetail.value = false;
  selectedVideo.value = null;
}

// (ฟังก์ชันสำหรับ "ลบ" วิดีโอ)
async function deleteItem(id) {
  if (!confirm("คุณ (Admin) แน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
    return;
  }
  try {
    const headers = getAuthHeaders();
    if (!headers) return;
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/api/videos/${id}`,
      { headers }
    );
    // ⭐️ แก้ไข: ต้องอัปเดต 'videos' (ไม่ใช่ videoList)
    videos.value = videos.value.filter((video) => video.id !== id);
  } catch (error) {
    console.error("Error deleting video:", error);
    alert("ลบข้อมูลไม่สำเร็จ");
  }
}

// (ฟังก์ชันสำหรับเปิด Modal "แก้ไข")
function editItem(video) {
  const itemToEdit = {
    ...video,
    sport: video.sport_id,
    note: video.notes,
    date: video.match_date
  };
  currentItemToEdit.value = itemToEdit;
  isModalOpen.value = true;
}

// (ฟังก์ชันสำหรับปิด Modal "แก้ไข")
function closeModal() {
  isModalOpen.value = false;
  currentItemToEdit.value = null;
}

// (ฟังก์ชันสำหรับ "บันทึก" การแก้ไข)
async function saveChanges(updatedItem) {
  try {
    const headers = getAuthHeaders();
    if (!headers) return;

    const itemToSave = {
      ...updatedItem,
      sport_id: updatedItem.sport,
      notes: updatedItem.note,
      match_date: updatedItem.date
    };
    delete itemToSave.sport;
    delete itemToSave.note;
    delete itemToSave.date;

    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/videos/${itemToSave.id}`,
      itemToSave,
      { headers }
    );

    // ⭐️ แก้ไข: ต้องอัปเดต 'videos' (ไม่ใช่ videoList)
    const index = videos.value.findIndex((v) => v.id === itemToSave.id);
    if (index !== -1) {
      videos.value[index] = response.data;
    }
    closeModal();
  } catch (error) {
    console.error("Error saving video:", error);
    alert("บันทึกข้อมูลไม่สำเร็จ");
  }
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

          <div v-else class="flex flex-col gap-5">
            <div v-for="video in videos" :key="video.id"
              class="flex flex-col sm:flex-row items-start gap-4 p-4 bg-white rounded-lg shadow-sm">

              <img :src="video.thumbnail" :alt="video.title" @click="openVideoDetail(video)"
                class="w-full sm:w-48 aspect-video object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-90" />

              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 cursor-pointer" :title="video.title"
                  @click="openVideoDetail(video)">
                  {{ video.title }}
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  Sport: <span class="font-medium">{{ video.sport_id }}</span>
                </p>
                <p class="text-sm text-gray-600">
                  Opponent: <span class="font-medium">{{ video.opponent }}</span>
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  Date: <span v-if="video.match_date">{{ new Date(video.match_date).toLocaleDateString("th-TH")
                    }}</span>
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
      </div>
    </div>

    <VideoDetailModal v-if="showVideoDetail && selectedVideo" :video="selectedVideo" @close="closeVideoDetail" />

    <EditModal :isOpen="isModalOpen" :item="currentItemToEdit" @close="closeModal" @save="saveChanges" />
  </div>
</template>