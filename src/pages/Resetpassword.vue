<script setup>
import { ref } from "vue";
import TextInput from "../components/textinput.vue";
import bgImage from "../assets/tennis.jpg";
import { useRouter } from "vue-router";
import axios from "axios";

// --- State (⭐️ 1. เปลี่ยน username เป็น email) ---
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const error = ref("");
const router = useRouter();

// --- Function ---
const handleResetPassword = async () => {
  isLoading.value = true;
  error.value = "";

  // 1. ตรวจสอบรหัสผ่าน (ฝั่ง Client)
  if (password.value !== confirmPassword.value) {
    error.value = "รหัสผ่านและรหัสผ่านยืนยันไม่ตรงกัน";
    isLoading.value = false;
    return;
  }

  try {
    // 2. ⭐️ ส่ง email.value ใน key ที่ชื่อ "username" (เพราะ Backend Lambda คาดหวัง key นี้)
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/reset-password`, {
      username: email.value, // ⭐️ ส่ง email ไปใน field username
      password: password.value,
    });

    // 3. สำเร็จ
    alert("อัปเดตรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่");
    router.push("/login");

  } catch (err) {
    // 4. จัดการ Error
    console.error("Reset password failed:", err);
    if (err.response && err.response.data && err.response.data.detail) {
      error.value = err.response.data.detail;
    } else {
      error.value = "เกิดข้อผิดพลาด หรือไม่พบอีเมลนี้ในระบบ";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="h-screen flex flex-col">
    <nav class="bg-white-100 h-20"></nav>

    <div class="flex-1 flex items-center justify-center relative">
      <div class="absolute z-0 inset-0 w-full h-full overflow-hidden">
        <img :src="bgImage" alt="Background Banner" class="w-full h-full object-cover" />
      </div>

      <div class="relative z-10 p-10 w-sm h-120 rounded-sm max-w-md bg-white shadow-2xl">
        <h1 class="text-4xl mb-6 text-center text-orange-600 mt-5">Reset Password</h1>

        <form @submit.prevent="handleResetPassword">

          <TextInput label="Email" type="email" placeholder="Enter your email" v-model="email" />

          <TextInput label="New Password" type="password" placeholder="Enter your new password" v-model="password"
            class="mt-4 mb-2" />
          <TextInput label="Confirm New Password" type="password" placeholder="Confirm your new password"
            v-model="confirmPassword" class="mt-4 mb-2" />

          <p v-if="error" class="text-red-500 text-sm text-center my-4">
            {{ error }}
          </p>

          <button type="submit" :disabled="isLoading" class="w-full bg-orange-500 text-white py-2 rounded-sm hover:bg-orange-600 transition-colors mt-4
                   disabled:bg-gray-400 disabled:cursor-not-allowed">
            <span v-if="isLoading">กำลังอัปเดต...</span>
            <span v-else>Reset Password</span>
          </button>
        </form>
        <router-link to="/login"
          class="flex text-sm text-gray-500 hover:underline hover:text-orange-500 mt-1 justify-end-safe">Login</router-link>
      </div>
    </div>
  </div>
</template>