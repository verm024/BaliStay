<template>
  <div id="app">
    <div id="nav">
      <button @click="logout" v-if="currentUser">Logout</button>
      <router-link to="/">Home</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import firebase from "./firebase";
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    async logout() {
      try {
        await firebase.auth.signOut();
      } catch (error) {
        console.error(error);
      }
      this.$store.commit("setCurrentUser", null);
      this.$store.commit("setUserProfile", null);
      this.$router.push("/login");
    }
  },
  computed: {
    ...mapState(["currentUser"])
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
