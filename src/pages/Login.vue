<script setup>
import { ref } from "vue";
import bgImage from "../assets/tennis.jpg";
import TextInput from "../components/textinput.vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ⭐️ (อย่าลืม npm install jwt-decode)

// --- State ---
const username = ref(""); // (นี่คือ Email)
const password = ref("");
const isLoading = ref(false);
const error = ref("");
const router = useRouter();

const handleLogin = async () => {
  isLoading.value = true;
  error.value = "";

  // ⭐️ 1. เพิ่ม Validation (นี่คือการแก้ปัญหา Error) ⭐️
  if (!username.value || !password.value) {
    error.value = "กรุณากรอก Email และรหัสผ่าน";
    isLoading.value = false;
    return;
  }
  // ------------------------------------------

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
      username: username.value, // (นี่คือ Email ที่ผู้ใช้กรอก)
      password: password.value,
    });

    const { token, user } = response.data;
    
    // 9. เก็บ token และ user ID
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", user.id);

    // 10. ตรวจสอบสิทธิ์ Admin
    try {
      const decodedToken = jwtDecode(token);
      const groups = decodedToken['cognito:groups'] || [];
      
      if (groups.includes('Admins')) {
        localStorage.setItem("isAdmin", "true");
      } else {
        localStorage.removeItem("isAdmin");
      }
    } catch (e) {
      console.error("Error decoding token:", e);
      localStorage.removeItem("isAdmin");
    }

    // 11. พาไปหน้าหลัก
    router.push("/");

  } catch (err) {
    // 12. จัดการ Error
    console.error("Login failed:", err);
    if (err.response && err.response.status === 401) {
      error.value = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
    } else if (err.response && err.response.data && err.response.data.detail) {
      error.value = err.response.data.detail;
    } else {
      error.value = "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="h-screen flex flex-col">

    <div class="flex-1 flex items-center justify-center relative">
      <div class="absolute z-0 inset-0 w-full h-full overflow-hidden">
        <img :src="bgImage" alt="Background Banner" class="w-full h-full object-cover" />
      </div>

      <div class="relative z-10 p-10 w-sm h-120 rounded-sm max-w-md bg-white shadow-2xl">
        <h1 class="text-4xl mb-6 text-center text-orange-600 mt-5">Login</h1>

        <form @submit.prevent="handleLogin">

          <TextInput label="Email" type="email" placeholder="Enter your email" v-model="email" />

          <TextInput label="Password" type="password" placeholder="Enter your password" v-model="password"
            class="mt-4 mb-2" />

          <router-link to="/resetpassword"
            class="flex text-sm text-gray-500 hover:underline hover:text-orange-500 mt-1 justify-start-safe mb-5">Forgot
            password?</router-link>

          <p v-if="error" class="text-red-500 text-sm text-center mb-4">
            {{ error }}
          </p>

          <button type="submit" :disabled="isLoading" class="w-full bg-orange-500 text-white py-2 rounded-sm hover:bg-orange-600 transition-colors mt-4
                   disabled:bg-gray-400 disabled:cursor-not-allowed">
            <span v-if="isLoading">กำลังเข้าสู่ระบบ...</span>
            <span v-else>Login</span>
          </button>
        </form>
        <router-link to="/register"
          class="flex text-sm text-gray-500 hover:underline hover:text-orange-500 mt-1 justify-end-safe">Don't have an
          account? Register</router-link>
      </div>
    </div>
  </div>
</template>