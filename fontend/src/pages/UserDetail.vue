<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Navbar from "../components/Navbar.vue";

// (โค้ด <script setup> ของคุณเหมือนเดิมทั้งหมด)
// ...
const route = useRoute();
const userId = route.params.id;
const user = ref(null);
const historyItems = ref([]);
const showEditModal = ref(false);
const editingItem = ref({});

onMounted(() => {
  // (โค้ด onMounted เหมือนเดิม)
  user.value = {
    id: userId,
    name: `Name of User ${userId}`,
    imageUrl: `https://picsum.photos/seed/${userId}/200/200`,
    bio: "ตารางแสดงข้อมูลของผู้ใช้",
  };
  historyItems.value = [
    {
      id: 101,
      date: "2025-10-25",
      type: "Upload",
      title: "Video A",
      details: "อัปโหลดวิดีโอ A สำเร็จ",
    },
    {
      id: 102,
      date: "2025-10-24",
      type: "Edit",
      title: "Profile",
      details: "แก้ไขรูปโปรไฟล์",
    },
    {
      id: 103,
      date: "2025-10-23",
      type: "Delete",
      title: "Video B",
      details: "ลบวิดีโอ B",
    },
  ];
});

function handleDelete(itemId) {
  // (ฟังก์ชันเหมือนเดิม)
  if (confirm(`คุณต้องการลบรายการ ID: ${itemId} ใช่หรือไม่?`)) {
    historyItems.value = historyItems.value.filter(
      (item) => item.id !== itemId
    );
  }
}
function openEditModal(item) {
  // (ฟังก์ชันเหมือนเดิม)
  editingItem.value = { ...item };
  showEditModal.value = true;
}
function handleSaveEdit() {
  // (ฟังก์ชันเหมือนเดิม)
  const index = historyItems.value.findIndex(
    (item) => item.id === editingItem.value.id
  );
  if (index !== -1) {
    historyItems.value[index] = { ...editingItem.value };
  }
  closeModal();
}
function closeModal() {
  // (ฟังก์ชันเหมือนเดิม)
  showEditModal.value = false;
  editingItem.value = {};
}
</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col">
    <Navbar :showUploadButton="false" />

    <div class="container mx-auto p-8 overflow-y-auto flex-1">
      <div
        v-if="user"
        class="bg-white p-6 rounded-lg shadow-md flex items-start space-x-6"
      >
        <img
          :src="user.imageUrl"
          :alt="user.name"
          class="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <h1 class="text-4xl font-bold text-gray-800">{{ user.name }}</h1>
          <p class="text-lg text-gray-600 mt-2">{{ user.bio }}</p>
        </div>
      </div>

      <div class="mt-10">
        <h2 class="text-2xl font-semibold mb-4">My History</h2>
        <div class="overflow-x-auto bg-white rounded-lg shadow-md">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  วันที่ทำรายการ
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ประเภท
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ชื่อรายการ
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  รายละเอียด
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in historyItems" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.title }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate"
                >
                  {{ item.details }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="openEditModal(item)"
                    class="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    แก้ไข
                  </button>
                  <button
                    @click="handleDelete(item.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
              <tr v-if="historyItems.length === 0">
                <td
                  colspan="6"
                  class="px-6 py-4 text-center text-sm text-gray-500"
                >
                  ไม่พบข้อมูลประวัติ
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="!user">
        <p class="text-center text-gray-500">Loading...</p>
      </div>
    </div>

    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
    >
      <form
        @submit.prevent="handleSaveEdit"
        class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg"
      >
        <h2 class="text-2xl font-semibold mb-4">
          แก้ไขรายการ (ID: {{ editingItem.id }})
        </h2>
        <div class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700"
              >ชื่อรายการ</label
            >
            <input
              type="text"
              id="title"
              v-model="editingItem.title"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700"
              >ประเภท</label
            >
            <input
              type="text"
              id="type"
              v-model="editingItem.type"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label for="details" class="block text-sm font-medium text-gray-700"
              >รายละเอียด</label
            >
            <textarea
              id="details"
              v-model="editingItem.details"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            @click="closeModal"
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
