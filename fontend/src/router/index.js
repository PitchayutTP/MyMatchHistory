import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Home from "../pages/Home.vue";
import Upload from "../pages/Upload.vue";
import Resetpassword from "../pages/Resetpassword.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/upload", name: "upload", component: Upload },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  { path: "/resetpassword", name: "resetpassword", component: Resetpassword },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
