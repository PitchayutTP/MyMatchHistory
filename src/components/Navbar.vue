<template>
    <nav class="bg-white shadow-md px-4 py-2 flex items-center justify-between">
        <router-link to="/">
            My History
        </router-link>

        <div class="flex-1 px-4">
            <input type="text" placeholder="Search..."
                class="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none" v-model="search" />
        </div>

        <div class="flex items-center space-x-4">
            <router-link to="/upload"
                class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
                Upload
            </router-link>

            <router-link to="/history" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                History
            </router-link>

            <div class="relative">
                <button @click="toggleDropdown"
                    class="flex items-center text-gray-700 hover:text-orange-600 focus:outline-none">
                    <span class="font-medium">{{ username }}</span>
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <div v-if="isDropdownOpen"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <router-link to="/profile" @click="isDropdownOpen = false"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                    </router-link>
                    <button @click="handleLogout"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios"; // ⭐️ 1. Import axios (ดีกว่า fetch สำหรับ JSON)

const search = defineModel("search");
const isDropdownOpen = ref(false);
const router = useRouter();

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const username = ref("..."); // ตัวแปรนี้จะใช้เก็บชื่อจริง

onMounted(async () => {
    try {
        // ⭐️ 2. ดึง Token และ UserId (จาก localStorage)
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId"); // เราต้องการ id เพื่อเรียก profile

        if (!token || !userId) {
            username.value = "Guest";
            return;
        }

        // ⭐️ 3. เปลี่ยนไปเรียก API /api/profile/:id (เหมือนหน้า UserProfile)
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/profile/${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        // ⭐️ 4. ตั้งค่าการแสดงผลชื่อ
        const profileData = response.data;
        if (profileData && profileData.firstname && profileData.lastname) {
            // ถ้ามีทั้งชื่อและนามสกุล
            username.value = `${profileData.firstname} ${profileData.lastname}`;
        } else if (profileData && profileData.firstname) {
            // ถ้ามีแค่ชื่อ
            username.value = profileData.firstname;
        } else {
            // ถ้ายังไม่กรอกโปรไฟล์ (Fallback)
            username.value = "User"; // หรือคุณจะให้ไปเรียก /api/me เพื่อเอา Email ก็ได้
        }

    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        username.value = "Guest"; // ถ้า API ล้มเหลว
        if (error.response && error.response.status === 401) {
            router.push("/login");
        }
    }
});

const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    isDropdownOpen.value = false;

    try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Server logout failed:", error);
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin"); // (ลบสิทธิ์ Admin ถ้ามี)

    router.push("/login");
};
</script>