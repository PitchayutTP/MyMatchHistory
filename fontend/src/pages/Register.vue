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
        class="relative z-10 p-10 w-sm h-auto rounded-sm max-w-md bg-white shadow-2xl"
      >
        <h1 class="text-4xl mb-6 text-center text-orange-600">Register</h1>

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
            to="/resetpassword"
            class="flex text-sm text-gray-500 hover:underline hover:text-orange-500 mt-1 justify-start-safe mb-5"
            >Forgot password?</router-link
          >
          <button
            @click="handleRegister"
            type="submit"
            class="w-full bg-orange-500 text-white py-2 rounded-sm hover:bg-orange-600 transition-colors mt-4"
          >
            register
          </button>
        </form>
        <router-link
          to="/login"
          class="flex text-sm text-gray-500 hover:underline hover:text-orange-500 mt-1 justify-end-safe"
          >Have an account?</router-link
        >
      </div>
    </div>
  </div>
</template>