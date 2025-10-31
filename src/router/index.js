import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Home from "../pages/Home.vue";
import Upload from "../pages/Upload.vue";
import History from "../pages/History.vue";
import UserList from "../pages/UserList.vue";
import UserDetail from "../pages/UserDetail.vue";
import UserProfile from "../pages/UserProfile.vue";
import Confirm from "../pages/Confirm.vue";

// ⭐️ 1. สร้าง "การ์ดเฝ้าประตู"
const requireAdmin = (to, from, next) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isAuthenticated = !!localStorage.getItem("authToken");

  if (isAuthenticated && isAdmin) {
    next(); // อนุญาตให้ผ่าน (ถ้าเป็น Admin)
  } else {
    next("/"); // ถ้าไม่ใช่ Admin, เด้งกลับหน้า Home
  }
};

// ⭐️ 2. สร้างการ์ดสำหรับผู้ใช้ทั่วไป (ป้องกันการเข้าหน้า Home ถ้ายังไม่ Login)
const requireAuth = (to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  if (isAuthenticated) {
    next(); // อนุญาตให้ผ่าน
  } else {
    next("/login"); // ถ้ายังไม่ Login, เด้งไปหน้า Login
  }
};

const routes = [
  // ⭐️ 3. เพิ่มการ์ด requireAuth 
  { path: "/", name: "home", component: Home, beforeEnter: requireAuth },
  { path: "/upload", name: "upload", component: Upload, beforeEnter: requireAuth },
  { path: "/history", name: "history", component: History, beforeEnter: requireAuth },
  { path: "/confirm", name: "confirm", component: Confirm },
  { path: "/profile", name: "userprofile", component: UserProfile, beforeEnter: requireAuth },

  // ⭐️ 4. เพิ่มการ์ด requireAdmin
  {
    path: "/userlist",
    name: "userlist",
    component: UserList,
    beforeEnter: requireAdmin
  },
  {
    path: "/user/:id",
    name: "userdetail",
    component: UserDetail,
    beforeEnter: requireAdmin
  },

  // หน้าสาธารณะ (ไม่ต้องใช้การ์ด)
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;