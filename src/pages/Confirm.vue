<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import TextInput from "../components/textinput.vue";
import bgImage from "../assets/tennis.jpg";
import axios from "axios";

// --- State ---
const email = ref("");
const code = ref("");
const isLoading = ref(false);
const error = ref("");
const router = useRouter();
const route = useRoute(); // ⭐️ 1. เพื่อดึง Email จาก URL

// ⭐️ 2. เมื่อหน้าโหลด, ดึง Email จาก URL ที่ Register ส่งมา
onMounted(() => {
    if (route.query.email) {
        email.value = route.query.email;
    }
});

// --- Function ---
const handleConfirm = async () => {
    isLoading.value = true;
    error.value = "";

    if (!email.value || !code.value) {
        error.value = "กรุณากรอก Email และรหัสยืนยัน";
        isLoading.value = false;
        return;
    }

    try {
        // 3. ยิง API ไปยัง /api/confirm
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/confirm`, {
            email: email.value,
            code: code.value,
        });

        // 4. สำเร็จ
        alert("ยืนยันบัญชีสำเร็จ! กรุณาเข้าสู่ระบบ");
        router.push("/login");

    } catch (err) {
        // 5. จัดการ Error
        console.error("Confirmation failed:", err);
        if (err.response && err.response.data && err.response.data.detail) {
            if (err.response.data.detail.includes("CodeMismatchException")) {
                error.value = "รหัสยืนยันไม่ถูกต้อง";
            } else {
                error.value = err.response.data.detail;
            }
        } else {
            error.value = "เกิดข้อผิดพลาดในการยืนยันบัญชี";
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

            <div class="relative z-10 p-10 w-sm h-auto rounded-sm max-w-md bg-white shadow-2xl">
                <h1 class="text-4xl mb-6 text-center text-orange-600">Confirm Account</h1>
                <p class="text-center text-gray-600 mb-4">
                    เราได้ส่งรหัสยืนยัน 6 หลักไปที่ Email ของคุณ
                </p>

                <form @submit.prevent="handleConfirm">
                    <TextInput label="Email" type="email" placeholder="Enter your email" v-model="email" />
                    <TextInput label="Confirmation Code" type="text" placeholder="Enter 6-digit code" v-model="code"
                        class="mt-4 mb-2" />

                    <p v-if="error" class="text-red-500 text-sm text-center my-4">
                        {{ error }}
                    </p>

                    <button type="submit" :disabled="isLoading" class="w-full bg-orange-500 text-white py-2 rounded-sm hover:bg-orange-600 transition-colors mt-4
                   disabled:bg-gray-400 disabled:cursor-not-allowed">
                        <span v-if="isLoading">กำลังยืนยัน...</span>
                        <span v-else>Confirm</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>