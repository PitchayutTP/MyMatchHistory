<script setup>
import Navbar from "../components/Navbar.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router"; // ⭐️ เพิ่ม

const users = ref([]);
const isLoading = ref(true);
const error = ref(null);
const router = useRouter(); // ⭐️ เพิ่ม

async function fetchUsers() {
  try {
    // ⭐️ เพิ่ม Header
    const token = localStorage.getItem("authToken");
    if (!token) { router.push('/login'); return; }

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/userlist`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    users.value = response.data;
    console.log("Fetched users:", users.value);
  } catch (err) {
    console.error("Error fetching users:", err);
    error.value = "ไม่สามารถโหลดข้อมูลผู้ใช้ได้";
    if (err.response && err.response.status === 401) { router.push('/login'); }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="container mx-auto p-8">
      <div v-if="isLoading" class="text-center text-gray-500">
        <p>กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="error" class="text-center text-red-500">
        <p>{{ error }}</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <router-link v-for="user in users" :key="user.id" :to="`/user/${user.id}`"
          class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg hover:scale-105 transition-all duration-200">
          <img :src="user.imageUrl" :alt="user.name" class="w-24 h-24 rounded-full object-cover mb-3" />
          <h3 class="font-semibold text-gray-800 text-center">
            {{ user.name }}
          </h3>
        </router-link>
      </div>
    </div>
  </div>
</template>
