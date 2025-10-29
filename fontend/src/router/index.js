import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Home from "../pages/Home.vue";
import Upload from "../pages/Upload.vue";
import History from "../pages/History.vue";
import Resetpassword from "../pages/Resetpassword.vue";
import UserList from "../pages/UserList.vue";
import UserDetail from "../pages/UserDetail.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/upload", name: "upload", component: Upload },
  { path: "/history", name: "history", component: History },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  { path: "/resetpassword", name: "resetpassword", component: Resetpassword },
  { path: "/userlist", name: "userlist", component: UserList },
  { path: "/user/:id", name: "userdetail", component: UserDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
