<script setup>
import Navbar from "../components/Navbar.vue";
import { ref } from "vue";

// mock รอ db
const users = ref([
  { id: 1, name: "Alice", imageUrl: "https://picsum.photos/seed/1/100/100" },
  { id: 2, name: "Bob", imageUrl: "https://picsum.photos/seed/2/100/100" },
  { id: 3, name: "Charlie", imageUrl: "https://picsum.photos/seed/3/100/100" },
  { id: 4, name: "David", imageUrl: "https://picsum.photos/seed/4/100/100" },
  { id: 5, name: "Eve", imageUrl: "https://picsum.photos/seed/5/100/100" },
  { id: 6, name: "Frank", imageUrl: "https://picsum.photos/seed/6/100/100" },
  { id: 7, name: "Grace", imageUrl: "https://picsum.photos/seed/7/100/100" },
  { id: 8, name: "Heidi", imageUrl: "https://picsum.photos/seed/8/100/100" },
  { id: 9, name: "Ivan", imageUrl: "https://picsum.photos/seed/9/100/100" },
  { id: 10, name: "Judy", imageUrl: "https://picsum.photos/seed/10/100/100" },
  {
    id: 11,
    name: "Mallory",
    imageUrl: "https://picsum.photos/seed/11/100/100",
  },
]);
</script>
<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="container mx-auto p-8">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <router-link
          v-for="user in users"
          :key="user.id"
          :to="`/user/${user.id}`"
          class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          <img
            :src="user.imageUrl"
            :alt="user.name"
            class="w-24 h-24 rounded-full object-cover mb-3"
          />
          <h3 class="font-semibold text-gray-800 text-center">
            {{ user.name }}
          </h3>
        </router-link>
      </div>
    </div>
  </div>
</template>
