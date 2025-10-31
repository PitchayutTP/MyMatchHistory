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

const requireAdmin = (to, from, next) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isAuthenticated = !!localStorage.getItem("authToken");

  if (isAuthenticated && isAdmin) {
    next();
  } else {
    next("/");
  }
};

const requireAuth = (to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  if (isAuthenticated) {
    next();
  } else {
    next("/login");
  }
};

const routes = [
  { path: "/", name: "home", component: Home, beforeEnter: requireAuth },
  { path: "/upload", name: "upload", component: Upload, beforeEnter: requireAuth },
  { path: "/history", name: "history", component: History, beforeEnter: requireAuth },
  { path: "/confirm", name: "confirm", component: Confirm },
  { path: "/profile", name: "userprofile", component: UserProfile, beforeEnter: requireAuth },
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
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;