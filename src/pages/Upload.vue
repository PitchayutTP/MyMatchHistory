<template>
    <Navbar @upload="showUpload = true" v-model:search="searchTerm" />
    <div class="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Match Form</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">

            <div>
                <label for="title" class="block text-sm font-medium text-gray-700">ชื่อเรื่อง (Title)</label>
                <input id="title" v-model="form.title" type="text"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter match title" required />
            </div>

            <div>
                <label for="sport_id" class="block text-sm font-medium text-gray-700">กีฬา</label>
                <input id="sport_id" v-model="form.sport_id" type="text"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter sport (e.g., Tennis, Badminton)" />
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
                <label for="thumbnail" class="block text-sm font-medium text-gray-700">อัพโหลดภาพปก
                    (Thumbnail)</label>
                <input id="thumbnail" ref="thumbnailInput" type="file" accept="image/*" @change="handleThumbnailChange"
                    class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer" />
            </div>

            <div>
                <label for="clip" class="block text-sm font-medium text-gray-700">อัพคลิป</label>
                <input id="clip" ref="fileInput" type="file" accept="video/*" @change="handleFileChange"
                    class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer" />
            </div>

            <div class="flex justify-end gap-3 pt-4">
                <button type="button" @click="resetForm"
                    class="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Reset Form
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
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import axios from "axios";

const fileInput = ref(null);
const thumbnailInput = ref(null);
const emit = defineEmits(["uploaded", "close"]);
const router = useRouter();

const getInitialState = () => ({
    user_id: localStorage.getItem("userId") || null,
    title: "",
    sport_id: null,
    match_date: "",
    location: "",
    opponent: "",
    result: "",
    score: "",
    notes: "",
    clip: null,
    thumbnailFile: null,
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

function handleThumbnailChange(event) {
    const file = event.target.files[0];
    if (file) {
        form.thumbnailFile = file;
    } else {
        form.thumbnailFile = null;
    }
}

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

async function getUploadUrl(token, file) {
    const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/get-presigned-url`,
        {
            fileName: file.name,
            fileType: file.type,
        },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
}


async function handleSubmit() {
    if (!form.clip) {
        alert("Please select a video file.");
        return;
    }
    if (!form.thumbnailFile) {
        alert("Please select a thumbnail image.");
        return;
    }
    if (!form.title) {
        alert("Please enter a Title.");
        return;
    }

    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push('/login');
            return;
        }

        // --- 1. อัปโหลด Thumbnail ---
        const thumbnailUrls = await getUploadUrl(token, form.thumbnailFile);
        await axios.put(thumbnailUrls.uploadURL, form.thumbnailFile, {
            headers: { 'Content-Type': form.thumbnailFile.type }
        });
        const thumbnailUrl = thumbnailUrls.videoUrl; // URL จริงของภาพปก

        // --- 2. อัปโหลด Video ---
        const videoUrls = await getUploadUrl(token, form.clip);
        await axios.put(videoUrls.uploadURL, form.clip, {
            headers: { 'Content-Type': form.clip.type }
        });
        const videoUrl = videoUrls.videoUrl; // URL จริงของวิดีโอ

        // --- 3. บันทึกข้อมูล (JSON) ลง DB ---
        const videoData = {
            user_id: form.user_id,
            sport_id: form.sport_id,
            match_date: form.match_date,
            location: form.location,
            opponent: form.opponent,
            result: form.result,
            score: form.score,
            notes: form.notes,
            videoSrc: videoUrl,
            title: form.title,
            thumbnail: thumbnailUrl, // ⭐️ ใช้ URL จริงของภาพปก
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
        emit("uploaded", dbResponse.data);
        resetForm();
        router.push("/");

    } catch (error) {
        console.error("Error saving match:", error);
        alert("Error: Could not save match.");
        if (error.response && error.response.status === 401) {
            router.push('/login');
        }
    }
}


function resetForm() {
    Object.assign(form, getInitialState());

    if (fileInput.value) {
        fileInput.value.value = "";
    }
    if (thumbnailInput.value) {
        thumbnailInput.value.value = "";
    }
}
</script>