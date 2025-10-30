<template>
    <div class="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Match Form</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
                <label for="user_id" class="block text-sm font-medium text-gray-700">ชื่อ</label>
                <input id="user_id" v-model.number="form.user_id" type="text"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter name" />
            </div>

            <div>
                <label for="sport_id" class="block text-sm font-medium text-gray-700">กีฬา</label>
                <input id="sport_id" v-model.number="form.sport_id" type="text"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter sport" />
            </div>

            <div>
                <label for="match_date" class="block text-sm font-medium text-gray-700">วันที่</label>
                <input id="match_date" v-model="form.match_date" type="date"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
            </div>

            <div>
                <label for="location" class="block text-sm font-medium text-gray-700">สถานที่</label>
                <input id="location" v-model="form.location" type="text" maxlength="100"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter location" />
            </div>

            <div>
                <label for="opponent" class="block text-sm font-medium text-gray-700">ทีมตรงข้าม</label>
                <input id="opponent" v-model="form.opponent" type="text" maxlength="100"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Opponent name" />
            </div>

            <div>
                <label for="result" class="block text-sm font-medium text-gray-700">ผลลัพธ์</label>
                <select id="result" v-model="form.result"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                    <option value="">Select result</option>
                    <option value="win">Win</option>
                    <option value="lose">Lose</option>
                    <option value="draw">Draw</option>
                </select>
            </div>

            <div>
                <label for="score" class="block text-sm font-medium text-gray-700">คะแนน</label>
                <input id="score" v-model="form.score" type="text" maxlength="20"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="e.g. 3-1" />
            </div>

            <div>
                <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
                <textarea id="notes" v-model="form.notes" rows="3"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Additional details..."></textarea>
            </div>

            <div>
                <label for="clip" class="block text-sm font-medium text-gray-700">อัพคลิป</label>
                <input id="clip" ref="fileInput" type="file" accept="video/*" @change="handleFileChange"
                    class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer" />
            </div>

            <div class="flex justify-end gap-3 pt-4">
                <button type="button" @click="resetForm"
                    class="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Cancel
                </button>
                <button type="submit"
                    class="px-4 py-2 rounded-md border border-transparent bg-orange-600 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                    Submit
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router"; // ⭐️ เพิ่ม useRouter
import axios from "axios";

const fileInput = ref(null);
const emit = defineEmits(["uploaded", "close"]);
const router = useRouter(); // ⭐️ เพิ่ม useRouter

const getInitialState = () => ({
    user_id: localStorage.getItem("userId") || null, // ⭐️ ดึง userId ที่เก็บไว้
    sport_id: null,
    match_date: "",
    location: "",
    opponent: "",
    result: "",
    score: "",
    notes: "",
    clip: null,
});

const form = reactive(getInitialState());

function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        form.clip = file;
    } else {
        form.clip = null;
    }
}

// ⭐️ ฟังก์ชันช่วยสร้าง Header
const getAuthHeaders = (contentType = 'application/json') => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        router.push('/login');
        return null;
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': contentType
    };
};

// ⭐️ แก้ไข handleSubmit ทั้งหมด
async function handleSubmit() {
    if (!form.clip) {
        alert("Please select a video file.");
        return;
    }

    try {
        // ----- 1. ดึง Pre-signed URL จาก Backend -----
        const token = localStorage.getItem("authToken");

        const presignedResponse = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/get-presigned-url`,
            {
                fileName: form.clip.name,
                fileType: form.clip.type,
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const { uploadURL, videoUrl } = presignedResponse.data;

        // ----- 2. อัปโหลดไฟล์ไป S3 โดยตรง (ไม่ใช่ไปที่ Backend) -----
        await axios.put(uploadURL, form.clip, {
            headers: { 'Content-Type': form.clip.type }
        });

        // ----- 3. บันทึกข้อมูล (JSON) ลง DB ผ่าน Backend -----
        const videoData = {
            user_id: form.user_id, // คุณอาจต้องเปลี่ยนเป็น User ID ที่ล็อกอินอยู่
            sport_id: form.sport_id,
            match_date: form.match_date,
            location: form.location,
            opponent: form.opponent,
            result: form.result,
            score: form.score,
            notes: form.notes,
            videoSrc: videoUrl, // <--- นี่คือ URL จาก S3
        };

        const dbResponse = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/videos`,
            videoData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert("Match record saved!");
        emit("uploaded", dbResponse.data); //
        resetForm();

    } catch (error) {
        console.error("Error saving match:", error);
        alert("Error: Could not save match.");
    }
}


function resetForm() {
    Object.assign(form, getInitialState());

    if (fileInput.value) {
        fileInput.value.value = "";
    }
}
</script>
