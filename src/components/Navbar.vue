<template>
    <nav class="bg-white shadow-md px-4 py-2 flex items-center justify-between">
        <router-link to="/" class="text-2xl font-bold text-orange-600">My History</router-link>

        <div class="flex-1 px-4">
            <input type="text" placeholder="Search..."
                class="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none" v-model="search" />
        </div>

        <div class="flex items-center space-x-4">
            <router-link v-if="isAdmin" to="/userlist"
                class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                Admin
            </router-link>

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

const search = defineModel("search");
const isDropdownOpen = ref(false);
const router = useRouter();

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const username = ref("...");
const isAdmin = ref(false); // ⭐️ เพิ่ม state

onMounted(async () => {
    // ⭐️ ตรวจสอบสิทธิ์ Admin ตอนโหลดหน้า
    isAdmin.value = localStorage.getItem("isAdmin") === "true";

    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            username.value = "Guest";
            return;
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/me`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }

        const userData = await response.json();
        username.value = userData.username;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        username.value = "Guest";
        if (error.message.includes("401") || (error.response && error.response.status === 401)) {
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
    localStorage.removeItem("isAdmin"); // ⭐️ ลบสิทธิ์ Admin ตอน Logout

    router.push("/login");
};
</script>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // ⭐️ เพิ่ม useRouter

const search = defineModel("search");
const isDropdownOpen = ref(false);
const router = useRouter(); // ⭐️ เพิ่ม useRouter

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const username = ref("...");

onMounted(async () => {
    try {
        // ⭐️ 1. ดึง Token
        const token = localStorage.getItem("authToken");
        if (!token) {
            username.value = "Guest";
            // ไม่ต้อง redirect ทันที เผื่ออยู่หน้า Login
            return;
        }

        // ⭐️ 2. ส่ง Token ไปใน Header
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/me`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const userData = await response.json();
        username.value = userData.username;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        username.value = "Guest";
        // ถ้า Error 401 (Token หมดอายุ)
        if (error.message.includes("401") || (error.response && error.response.status === 401)) {
            router.push("/login");
        }
    }
});

const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    isDropdownOpen.value = false;

    try {
        // โค้ดส่วนนี้ของคุณถูกต้องอยู่แล้ว
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

    router.push("/login");
};
</script>
