<script setup>
import { ref } from "vue";
import bgImage from "../assets/tennis.jpg";
import TextInput from "../components/textinput.vue";
import { useRouter } from "vue-router"; // 1. import useRouter
import axios from "axios"; // 2. import axios

// --- State เดิม ---
const username = ref("");
const password = ref("");

// --- 3. State ที่เพิ่มเข้ามา ---
const isLoading = ref(false); // State สำหรับ loading (เพื่อ disable ปุ่ม)
const error = ref(""); // State สำหรับเก็บข้อความ error
const router = useRouter(); // Instance ของ router

// --- 4. แก้ไข handleLogin ให้ยิง API ---
const handleLogin = async () => {
  // ไม่ต้องใช้ event.preventDefault() ถ้าใช้ @submit.prevent
  
  isLoading.value = true; // 5. เริ่ม Loading
  error.value = ""; // 6. ล้าง error เก่า

  try {
    const response = await axios.post("http://localhost:3000/api/login", {
      username: username.value,
      password: password.value,
    });

    const { token, user } = response.data;
    
    // 9. เก็บ token และ user ID ไว้ใน localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", user.id); // (สำคัญสำหรับหน้า Profile ที่เราคุยกัน)

    // 10. พาไปหน้าหลัก
    router.push("/"); // หรือ '/dashboard' หรือหน้าที่คุณต้องการ

  } catch (err) {
    // 11. จัดการ Error
    console.error("Login failed:", err);
    if (err.response && err.response.status === 401) {
      error.value = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
    } else if (err.response && err.response.data && err.response.data.detail) {
      error.value = err.response.data.detail; // ดึง error จาก
    } else {
      error.value = "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง";
    }
  } finally {
    // 12. สิ้นสุด Loading (ไม่ว่าจะสำเร็จหรือล้มเหลว)
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="h-screen flex flex-col">
    <nav class="bg-white-100 h-20"></nav>

    <div
      class="flex-1 flex items-center justify-center relative" 
      >
      <div
        class="absolute z-0 inset-0 w-full h-full overflow-hidden"
      >
        <img
          :src="bgImage"
          alt="Background Banner"
          class="w-full h-full object-cover"
        />
      </div>

      <div
        class="relative z-10 p-10 w-sm h-120 rounded-sm max-w-md bg-white shadow-2xl"
      >
        <h1 class="text-4xl mb-6 text-center text-orange-600 mt-5">Login</h1>

        <form @submit.prevent="handleLogin">
          <TextInput
            label="Username"
            type="text"
            placeholder="Enter your username"
            v-model="username"
          />

          <TextInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            v-model="password"
            class="mt-4 mb-2"
          />

          <router-link
            to="/resetpassword"
            class="flex text-sm text-gray-500 hover:underline hover:text-orange-500 mt-1 justify-start-safe mb-5"
            >Forgot password?</router-link
          >
          
          <p v-if="error" class="text-red-500 text-sm text-center mb-4">
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="isLoading" 
            class="w-full bg-orange-500 text-white py-2 rounded-sm hover:bg-orange-600 transition-colors mt-4
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">กำลังเข้าสู่ระบบ...</span>
            <span v-else>Login</span>
          </button>
        </form>
        <router-link
          to="/register"
          class="flex text-sm text-gray-500 hover:underline hover:text-orange-500 mt-1 justify-end-safe"
          >Don't have an account? Register</router-link
        >
      </div>
    </div>
  </div>
</template>