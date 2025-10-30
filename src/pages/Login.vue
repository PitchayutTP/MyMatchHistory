<script setup>
import { ref } from "vue";
import bgImage from "../assets/tennis.jpg";
import TextInput from "../components/textinput.vue";
import { useRouter } from "vue-router";
import axios from "axios";

// --- 1. เปลี่ยนจาก username เป็น email ---
const email = ref(""); // <--- เปลี่ยนตรงนี้
const password = ref("");

// --- State อื่นๆ เหมือนเดิม ---
const isLoading = ref(false);
const error = ref("");
const router = useRouter();

const handleLogin = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    // --- 2. ส่ง email.value ใน field ที่ชื่อ username ---
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
      username: email.value, // <--- เปลี่ยนตรงนี้
      password: password.value,
    });

    // ... ส่วนที่เหลือเหมือนเดิม ...
    const { token, user } = response.data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", user.id);
    router.push("/");

  } catch (err) {
    // ... การจัดการ Error เหมือนเดิม ...
    console.error("Login failed:", err);
    if (err.response && err.response.status === 401) {
      error.value = "อีเมลหรือรหัสผ่านไม่ถูกต้อง"; // <--- (เปลี่ยนข้อความเล็กน้อย)
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
  <div class="relative z-10 p-10 w-sm h-120 rounded-sm max-w-md bg-white shadow-2xl">
    <h1 class="text-4xl mb-6 text-center text-orange-600 mt-5">Login</h1>

    <form @submit.prevent="handleLogin">

      <TextInput label="Email" type="email" placeholder="Enter your email" v-model="email" />

      <TextInput label="Password" type="password" placeholder="Enter your password" v-model="password"
        class="mt-4 mb-2" />

    </form>
  </div>
</template>