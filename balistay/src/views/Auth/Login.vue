<template>
  <div class="login container">
    <v-card class="mx-auto px-10 py-5 my-12" max-width="500" min-height="350">
      <v-card-text>
        <div class="title text-center mb-5">LOGIN</div>
        <v-form class="ma-40" ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="form_login.email"
            label="E-mail"
            :rules="[rules.required, rules.email]"
            outlined
          ></v-text-field>

          <v-text-field
            v-model="form_login.password"
            label="Password"
            type="password"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <div class="button text-center">
            <v-btn
              elevation="0"
              class="mb-5 white--text"
              color="#0EBEE4"
              @click="login"
            >
              LOGIN
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import firebase from "../../firebase";

export default {
  data() {
    return {
      form_login: {
        email: "",
        password: ""
      },
      rules: {
        required: value => !!value || "Required.",
        counter: value => value.length <= 20 || "Max 20 characters",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      },
      valid: false
    };
  },
  methods: {
    async validate() {
      this.valid = await this.$refs.form.validate();
    },
    async login() {
      await this.validate();
      if (this.valid) {
        let user;
        try {
          user = await firebase.auth.signInWithEmailAndPassword(
            this.form_login.email,
            this.form_login.password
          );
        } catch (error) {
          console.error(error);
        }
        if (user) {
          user = user.user;
          this.$store.commit("setCurrentUser", user);
          await this.$store.dispatch("fetchUserProfile");
          let role = this.$store.state.userProfile.role;
          this.$router.push("/" + this.$store.state.userProfile.role);
        }
      }
    }
  }
};
</script>

<style scoped>
.button {
  text-decoration: none;
}

.button .v-btn {
  text-transform: capitalize;
  letter-spacing: unset;
  font-weight: normal;
}
</style>
