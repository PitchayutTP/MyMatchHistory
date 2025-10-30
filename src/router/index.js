import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Home from "../pages/Home.vue";
import Upload from "../pages/Upload.vue";
import History from "../pages/History.vue";
import Resetpassword from "../pages/Resetpassword.vue";
import UserList from "../pages/UserList.vue";
import UserDetail from "../pages/UserDetail.vue";
import UserProfile from "../pages/UserProfile.vue";

// ⭐️ สร้าง "การ์ดเฝ้าประตู"
const requireAdmin = (to, from, next) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isAuthenticated = !!localStorage.getItem("authToken");

  if (isAuthenticated && isAdmin) {
    next(); // อนุญาตให้ผ่าน
  } else {
    next("/"); // ถ้าไม่ใช่ Admin, เด้งกลับหน้า Home
  }
};

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/upload", name: "upload", component: Upload },
  { path: "/history", name: "history", component: History },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  { path: "/resetpassword", name: "resetpassword", component: Resetpassword },
  { path: "/profile", name: "userprofile", component: UserProfile },

  // ⭐️ เพิ่มการ์ดเฝ้าประตูให้หน้า Admin
  {
    path: "/userlist",
    name: "userlist",
    component: UserList,
    beforeEnter: requireAdmin // ⭐️
  },
  {
    path: "/user/:id",
    name: "userdetail",
    component: UserDetail,
    beforeEnter: requireAdmin // ⭐️
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;