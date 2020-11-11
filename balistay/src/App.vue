<template>
  <v-app>
    <v-app-bar app color="white" flat>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo-balistay.png"
          transition="scale-transition"
          width="120"
        />
      </div>

      <v-spacer></v-spacer>
      <router-link to="/">
        <v-btn text>
          Home
        </v-btn>
      </router-link>
      <router-link v-if="currentUser" :to="'/' + userProfile.role">
        <v-btn text>
          Dashboard
        </v-btn>
      </router-link>
      <v-btn v-if="currentUser" @click="logout" text>
        <span class="mr-2">Logout</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <router-link v-if="!currentUser" to="/login">
        <v-btn text>
          Login
        </v-btn>
      </router-link>
      <router-link v-if="!currentUser" to="/register">
        <v-btn text>
          Register
        </v-btn>
      </router-link>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer dark padless>
      <v-card
        flat
        tile
        class="white--text text-center"
        color="#0EBEE4"
        width="100%"
      >
        <v-card-text>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">
              mdi-instagram
            </v-icon>
          </v-btn>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">
              mdi-twitter
            </v-icon>
          </v-btn>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">
              mdi-facebook
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text width="100%" class="white--text pt-0">
          <v-row justify="center" no-gutters>
            <router-link v-for="link in links" :key="link.name" :to="link.to">
              <v-btn color="white" text rounded class="my-2">
                {{ link.name }}
              </v-btn>
            </router-link>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          Copyright {{ new Date().getFullYear() }}
          <strong>BaliStay is a registered trademark</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from "./firebase";
import { mapState } from "vuex";
export default {
  data() {
    return {
      links: [
        { name: "About", to: "/about" },
        { name: "Contact", to: "/contact" },
        { name: "FAQ", to: "/faq" },
        { name: "Search Homestay", to: "/search" }
      ]
    };
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

<style scoped>
a {
  text-decoration: none;
}

a.router-link-exact-active button {
  color: #0ebee4;
}

</style>
