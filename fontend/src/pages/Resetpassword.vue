<script setup>
import { ref } from "vue";
import TextInput from "../components/textinput.vue";
import bgImage from "../assets/tennis.jpg";

const email = ref("");
const password = ref("");

const handleLogin = (event) => {
  event.preventDefault();
  console.log("Email:", email.value);
  console.log("Password:", password.value);
};
</script>
<template>
  <div class="h-screen flex flex-col">
    <nav class="bg-white-100 h-20"></nav>

    <div
      class="flex-1 flex items-center justify-center relative" 
      >
      <div
        class="absolute z-0 inset-0 w-full h-full overflow-hidden"
      >
        <img
          :src="bgImage"
          alt="Background Banner"
          class="w-full h-full object-cover"
        />
      </div>

      <div
        class="relative z-10 p-10 w-sm h-120 rounded-sm max-w-md bg-white shadow-2xl"
      >
        <h1 class="text-4xl mb-6 text-center text-orange-600 mt-5">Reset Password</h1>

        <form @submit="handleLogin">
          <TextInput
            label="Username"
            type="text"
            placeholder="Enter your username"
            v-model="username"
          />

          <TextInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            v-model="password"
            class="mt-4 mb-2"
          />
          <TextInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            v-model="confirmPassword"
            class="mt-4 mb-2"
          />
          <button
            type="submit"
            class="w-full bg-orange-500 text-white py-2 rounded-sm hover:bg-orange-600 transition-colors mt-4"
          >
            Login
          </button>
        </form>
        <router-link
          to="/login"
          class="flex text-sm text-gray-500 hover:underline hover:text-orange-500 mt-1 justify-end-safe"
          >Login</router-link
        >
      </div>
    </div>
  </div>
</template>