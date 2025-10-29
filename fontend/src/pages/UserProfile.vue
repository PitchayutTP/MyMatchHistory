<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import TextInput from "../components/textinput.vue";

// --- State ---
// VVV เติม Mock Data (ข้อมูลจำลอง) ลงใน form VVV
const form = ref({
  firstname: "Somsak",
  lastname: "Jaidee",
  email: "somsak.j@example.com",
  phone_number: "081-234-5678",
  address: "123/45 BKK, Thailand 10110",
});
// --- ^^^ สิ้นสุด Mock Data ^^^ ---

const error = ref("");
const userId = ref(null);
const router = useRouter();
// VVV ลบ isLoading state VVV
// const isLoading = ref(true); 

// --- Lifecycle (onMounted) ---
// (onMounted ว่างเปล่า เพราะเรายังไม่ดึงข้อมูลจริง)
function updateUserProfile() {
  // ฟังก์ชันนี้จะถูกเรียกเมื่อผู้ใช้ส่งฟอร์ม
  // ในที่นี้เราจะแค่แสดงข้อมูลในคอนโซล
  console.log("Updating user profile with data:", form.value);
  alert("ข้อมูลของคุณได้รับการอัพเดตแล้ว!");
}
</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col">
    <Navbar :showUploadButton="false" />

    <div class="container mx-auto p-8 overflow-y-auto flex-1">
      
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">
        
        <h2 class="text-4xl mb-10 text-center font-sans text-orange-600">บัญชีของคุณ</h2>
        
        <form @submit.prevent="handleSubmit">
          <div class="flex mb-4">
            <TextInput
              label="Firstname"
              name="firstname"
              v-model="form.firstname"
              placeholder="กรอกชื่อของคุณ"
              class="mr-4 w-1/2"
            />
            <TextInput
              label="Lastname"
              name="lastname"
              v-model="form.lastname"
              placeholder="กรอกนามสกุลของคุณ"
              class="w-1/2"
            />
          </div>
          <div class="flex mb-4">
            <TextInput
              label="Phone number"
              name="phone_number"
              v-model="form.phone_number"
              placeholder="กรอกเบอร์โทรศัพท์ของคุณ"
              class="mr-4 w-1/2"
            />
            <TextInput
              label="Email"
              type="email"
              name="email"
              v-model="form.email"
              placeholder="กรอกอีเมลของคุณ"
              class="w-1/2"
            />
          </div>
          <TextInput
            label="Address"
            name="address"
            v-model="form.address"
            placeholder="กรอกที่อยู่ของคุณ"
            class="mb-4"
          />

          <p v-if="error" class="text-red-500 text-sm mt-2 whitespace-pre-line">
            {{ error }}
          </p>

          <button
            @click="updateUserProfile"
            type="submit"
            class="w-full py-2 mt-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all"
          >
            อัพเดตข้อมูล
          </button>
        </form>
      </div>
      
    </div>
  </div>
</template>