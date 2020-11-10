import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import firebase from "../firebase";
import store from "../store";
import Login from "../views/Auth/Login";
import Register from "../views/Auth/Register";
import DefaultUser from "../views/Dashboard/User";
import Owner from "../views/Dashboard/Owner";
import NewHomestay from "../views/NewHomestay";
import EditHomestay from "../views/EditHomestay";
import Transport from "../views/Dashboard/Transport";
import Admin from "../views/Dashboard/Admin";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "BaliStay"
    }
  },
  {
    path: "/user",
    name: "Dashboard User",
    component: DefaultUser,
    meta: {
      requiresLogin: true,
      allowedRole: "user",
      title: "Dashboard"
    }
  },
  {
    path: "/owner",
    name: "Dashboard Owner",
    component: Owner,
    meta: {
      requiresLogin: true,
      allowedRole: "owner",
      title: "Dashboard"
    }
  },
  {
    path: "/new-homestay",
    name: "New Homestay",
    component: NewHomestay,
    meta: {
      requiresLogin: true,
      allowedRole: "owner",
      title: "New Homestay"
    }
  },
  {
    path: "/edit-homestay/:id",
    name: "Edit Homestay",
    component: EditHomestay,
    meta: {
      requiresLogin: true,
      allowedRole: "owner",
      title: "Edit Homestay"
    }
  },
  {
    path: "/transport",
    name: "Dashboard Transport",
    component: Transport,
    meta: {
      requiresLogin: true,
      allowedRole: "transport",
      title: "Dashboard"
    }
  },
  {
    path: "/admin",
    name: "Dashboard Admin",
    component: Admin,
    meta: {
      requiresLogin: true,
      allowedRole: "admin",
      title: "Dashboard"
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login"
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Register"
    }
  },
  {
    path: "*",
    name: "Unavailable"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth.currentUser;
  let requiresLogin = to.matched.some(x => x.meta.requiresLogin);
  if (to.name == "Unavailable") {
    next("/" + store.state.userProfile.role);
  } else {
    if (currentUser) {
      if (requiresLogin) {
        if (to.meta.allowedRole.includes(store.state.userProfile.role)) {
          next();
        } else {
          next("/" + store.state.userProfile.role); //To user dashboard
        }
      } else {
        if (to.name == "Register" || to.name == "Login") {
          next("/" + store.state.userProfile.role); //To user dashboard
        } else {
          next();
        }
      }
    } else {
      if (requiresLogin) {
        next("/login");
      } else {
        next();
      }
    }
  }
});

export default router;
