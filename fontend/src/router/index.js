import { createRouter, createWebHistory } from "vue-router";
// import Login from "../pages/Login.vue";
import Home from "../pages/Home.vue";
import Upload from "../pages/Upload.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/upload", name: "upload", component: Upload },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
