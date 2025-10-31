<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import TextInput from "../components/textinput.vue";
import axios from "axios";

const form = ref({
  firstname: "",
  lastname: "",
  email: "",
  phone_number: "",
  description: "",
});

const error = ref("");
const userId = ref(null);
const router = useRouter();
const isLoading = ref(true);

// ⭐️ ฟังก์ชันช่วยสร้าง Header
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    router.push('/login');
    return null;
  }
  return { 'Authorization': `Bearer ${token}` };
};

onMounted(async () => {
  const storedUserId = localStorage.getItem("userId");
  if (!storedUserId) {
    alert("กรุณาเข้าสู่ระบบก่อน");
    router.push("/login");
    return;
  }
  userId.value = storedUserId;

  try {
    const headers = getAuthHeaders();
    if (!headers) return;

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/profile/${storedUserId}`,
      { headers } // ⭐️ ส่ง Header
    );
    form.value = response.data;
  } catch (err) {
    console.error("Error fetching profile:", err);
    error.value = "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้";
    if (err.response && err.response.status === 401) {
      router.push('/login');
    }
  } finally {
    isLoading.value = false;
  }
});

const handleSubmit = async () => {
  error.value = "";
  if (!userId.value) return;

  try {
    const headers = getAuthHeaders();
    if (!headers) return;

    await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/api/profile/${userId.value}`,
      form.value,
      { headers } // ⭐️ ส่ง Header
    );

    alert("อัปเดตข้อมูลสำเร็จ!");
    router.push("/"); 

  } catch (err) {
    console.error("Error updating profile:", err);
    error.value = "เกิดข้อผิดพลาดในการอัปเดตข้อมูล";
    if (err.response && err.response.status === 401) {
      router.push('/login');
    }
  }
};
</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col">
    <Navbar :showUploadButton="false" />

    <div class="container mx-auto p-8 overflow-y-auto flex-1">

      <div v-if="isLoading" class="text-center text-gray-500 mt-10">
        <p>Loading Profile...</p>
      </div>

      <div v-else class="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">

        <h2 class="text-4xl mb-10 text-center font-sans text-orange-600">บัญชีของคุณ</h2>

        <form @submit.prevent="handleSubmit">
          <div class="flex mb-4">
            <TextInput label="Firstname" name="firstname" v-model="form.firstname" placeholder="กรอกชื่อของคุณ"
              class="mr-4 w-1/2" />
            <TextInput label="Lastname" name="lastname" v-model="form.lastname" placeholder="กรอกนามสกุลของคุณ"
              class="w-1/2" />
          </div>
          <div class="flex mb-4">
            <TextInput label="Phone number" name="phone_number" v-model="form.phone_number"
              placeholder="กรอกเบอร์โทรศัพท์ของคุณ" class="mr-4 w-1/2" />
            <TextInput label="Email" type="email" name="email" v-model="form.email" placeholder="กรอกอีเมลของคุณ"
              class="w-1/2" />
          </div>

          <TextInput label="Description" name="description" v-model="form.description" placeholder="กรอกคำอธิบายของคุณ"
            class="mb-4" />
          <p v-if="error" class="text-red-500 text-sm mt-2 whitespace-pre-line">
            {{ error }}
          </p>

          <button type="submit"
            class="w-full py-2 mt-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all">
            อัพเดตข้อมูล
          </button>
        </form>
      </div>

    </div>
  </div>
</template>