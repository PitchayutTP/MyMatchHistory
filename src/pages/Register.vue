<script setup>
import { ref } from "vue";
import TextInput from "../components/textinput.vue";
import bgImage from "../assets/tennis.jpg";
import { useRouter } from "vue-router";
import axios from "axios";

// --- State (ลบ username ออก) ---
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const error = ref("");
const router = useRouter();

const handleRegister = async () => {
  isLoading.value = true;
  error.value = "";

  if (password.value !== confirmPassword.value) {
    error.value = "รหัสผ่านและรหัสผ่านยืนยันไม่ตรงกัน";
    isLoading.value = false;
    return;
  }
  if (!email.value || !password.value) {
    error.value = "กรุณากรอกข้อมูลให้ครบถ้วน";
    isLoading.value = false;
    return;
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
      email: email.value,
      password: password.value,
    });

    // 8. ⭐️ แก้ไข Alert ⭐️
    alert("ลงทะเบียนสำเร็จ! กรุณาตรวจสอบ Email ของคุณเพื่อรับรหัสยืนยัน");

    // 9. ⭐️ พาไปหน้า Confirm (พร้อมส่ง Email ไปด้วย) ⭐️
    router.push({ path: "/confirm", query: { email: email.value } });

  } catch (err) {
    // 10. (ส่วน Error ที่ซ่อมแล้ว)
    console.error("Register failed:", err);
    if (err.response && err.response.data && err.response.data.detail) {
      error.value = err.response.data.detail;
    } else {
      error.value = "เกิดข้อผิดพลาดในการลงทะเบียน";
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

      <div class="relative z-10 p-10 w-sm h-auto rounded-sm max-w-md bg-white shadow-2xl">
        <h1 class="text-4xl mb-6 text-center text-orange-600">Register</h1>

        <form @submit.prevent="handleRegister">

          <TextInput label="Email" type="email" placeholder="Enter your email" v-model="email" />

          <TextInput label="Password" type="password" placeholder="Enter your password" v-model="password"
            class="mb-2" />

          <TextInput label="Confirm Password" type="password" placeholder="Confirm your password"
            v-model="confirmPassword" class="mb-2" />

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