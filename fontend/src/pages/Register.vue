<script setup>
import { ref } from "vue";
import TextInput from "../components/textinput.vue";
import bgImage from "../assets/tennis.jpg";

const email = ref("");
const password = ref("");
const username = ref("");

const handleRegister = (event) => {
  event.preventDefault();
  console.log("Username:", username.value);
  console.log("Email:", email.value);
  console.log("Password:", password.value);
};
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- รอใส่ nav เสี่ย -->
    <nav class="bg-gray-100 h-20"></nav>

    <div
      class="flex-1 flex items-center justify-center bg-white relative pr-[25%]"
    >
      <div
        class="absolute z-0 top-1/2 -translate-y-1/2 left-0 w-full h-[500px] overflow-hidden mt-10"
      >
        <img
          :src="bgImage"
          alt="Background Banner"
          class="w-full h-full object-cover"
        />
      </div>

      <div
        class="relative z-10 p-10 w-sm h-auto rounded-sm max-w-md bg-white shadow-2xl"
      >
        <h1 class="text-4xl mb-6 text-center text-blue-600">Register</h1>

        <form @submit="handleLogin">
          <TextInput
            label="Username"
            type="text"
            placeholder="Enter your username"
            v-model="username"
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            v-model="email"
          />

          <TextInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            v-model="password"
            class="mb-2"
          />
          <TextInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            v-model="confirmPassword"
            class="mb-2"
          />

          <router-link
            to="/register"
            class="flex text-sm text-gray-500 hover:underline hover:text-blue-500 mt-1 justify-start-safe mb-5"
            >Forgot password?</router-link
          >
          <button
            @click="handleRegister"
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded-sm hover:bg-blue-600 transition-colors mt-4"
          >
            register
          </button>
        </form>
        <router-link
          to="/login"
          class="flex text-sm text-gray-500 hover:underline hover:text-blue-500 mt-1 justify-end-safe"
          >Have an account?</router-link
        >
      </div>
    </div>
  </div>
</template>