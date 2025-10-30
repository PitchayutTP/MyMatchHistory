<script setup>
import { ref } from "vue";
import TextInput from "../components/textinput.vue";
import bgImage from "../assets/tennis.jpg";
import { useRouter } from "vue-router"; // 1. import useRouter
import axios from "axios"; // 2. import axios

// --- State เดิม ---
const email = ref("");
const password = ref("");
const username = ref("");

// --- 3. State ที่เพิ่มเข้ามา ---
const confirmPassword = ref(""); // State สำหรับ "ยืนยันรหัสผ่าน"
const isLoading = ref(false); // State สำหรับ loading
const error = ref(""); // State สำหรับ error
const router = useRouter(); // Instance ของ router

// --- 4. แก้ไข handleRegister ให้ยิง API ---
const handleRegister = async () => {
  isLoading.value = true;
  error.value = "";

  // 5. ตรวจสอบรหัสผ่าน (ฝั่ง Client)
  if (password.value !== confirmPassword.value) {
    error.value = "รหัสผ่านและรหัสผ่านยืนยันไม่ตรงกัน";
    isLoading.value = false;
    return; // หยุดทำงาน
  }

  // 6. ตรวจสอบว่ากรอกครบ (เผื่อ)
  if (!username.value || !email.value || !password.value) {
    error.value = "กรุณากรอกข้อมูลให้ครบถ้วน";
    isLoading.value = false;
    return;
  }

  try {
    // 7. ยิง API ไปยัง Backend (เปลี่ยน URL นี้)
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    // 8. ลงทะเบียนสำเร็จ
    alert("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");

    // 9. พาไปหน้า Login
    router.push("/login");

  } catch (err) {
    // 10. จัดการ Error (แบบใหม่ที่ซ่อมแล้ว)
    console.error("Register failed:", err);

    if (err.response && err.response.data && err.response.data.detail) {
      // ถ้า Backend (Lambda) ส่ง {"detail":"..."} มา
      error.value = err.response.data.detail;

    } else if (err.response && err.response.data) {
      // ถ้า Backend ส่งอะไรอย่างอื่นมา
      error.value = JSON.stringify(err.response.data);

    } else {
      // ถ้าเป็น Network Error
      error.value = "เกิดข้อผิดพลาดในการลงทะเบียน (Network Error)";
    }

  } finally {
    // 11. สิ้นสุด Loading
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

      <div class="relative z-10 p-10 w-sm h-auto rounded-sm max-w-md bg-white shadow-2xl">
        <h1 class="text-4xl mb-6 text-center text-orange-600">Register</h1>

        <form @submit.prevent="handleRegister">
          <TextInput label="Username" type="text" placeholder="Enter your username" v-model="username" />
          <TextInput label="Email" type="email" placeholder="Enter your email" v-model="email" />
          <TextInput label="Password" type="password" placeholder="Enter your password" v-model="password"
            class="mb-2" />
          <TextInput label="Confirm Password" type="password" placeholder="Confirm your password"
            v-model="confirmPassword" class="mb-2" />

          <router-link to="/resetpassword"
            class="flex text-sm text-gray-500 hover:underline hover:text-orange-500 mt-1 justify-start-safe mb-5">Forgot
            password?</router-link>

          <p v-if="error" class="text-red-500 text-sm text-center mb-4 whitespace-pre-line">
            {{ error }}
          </p>

          <button type="submit" :disabled="isLoading" class="w-full bg-orange-500 text-white py-2 rounded-sm hover:bg-orange-600 transition-colors mt-4
                   disabled:bg-gray-400 disabled:cursor-not-allowed">
            <span v-if="isLoading">กำลังลงทะเบียน...</span>
            <span v-else>Register</span>
          </button>
        </form>
        <router-link to="/login"
          class="flex text-sm text-gray-500 hover:underline hover:text-orange-500 mt-1 justify-end-safe">Have an
          account?</router-link>
      </div>
    </div>
  </div>
</template>