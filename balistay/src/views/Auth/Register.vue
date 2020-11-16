<template>
  <div class="container">
    <v-card class="mx-auto px-10 py-5 my-12" max-width="500" min-height="400">
      <v-card-text>
        <div class="title text-center mb-5">REGISTER</div>
        <v-form class="ma-40" ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="form_register.email"
            label="E-mail"
            :rules="[rules.required, rules.email]"
            outlined
          ></v-text-field>

          <v-text-field
            v-model="form_register.password"
            label="Password"
            type="password"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <v-text-field
            v-model="form_register.nama"
            label="Full Name"
            type="text"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <v-text-field
            v-model="form_register.notelp"
            label="Phone Number"
            type="text"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <v-select
            v-model="form_register.role"
            :rules="[rules.required]"
            :items="items"
            item-text="text"
            item-value="value"
            label="Role"
            persistent-hint
            single-line
            outlined
          ></v-select>

          <v-text-field
            v-if="form_register.role == 'transport'"
            v-model="form_register.perusahaan_transport"
            label="Company Name"
            type="text"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <v-select
            v-if="form_register.role == 'transport'"
            v-model="form_register.transports"
            :rules="[rules.required]"
            :items="transports"
            item-text="text"
            item-value="value"
            label="Available Types"
            persistent-hint
            multiple
            outlined
            chips
          ></v-select>

          <div class="button text-center">
            <v-btn
              elevation="0"
              class="mb-5 white--text"
              color="#0EBEE4"
              @click="register"
            >
              REGISTER
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
      form_register: {
        email: "",
        password: "",
        nama: "",
        notelp: "",
        role: "user",
        perusahaan_transport: "",
        transports: []
      },

      rules: {
        required: value => !!value || "Required.",
        counter: value => value.length <= 20 || "Max 20 characters",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      },
      valid: false,
      items: [
        { text: "Default User", value: "user" },
        { text: "Owner", value: "owner" },
        { text: "Transport", value: "transport" }
      ],
      transports: [
        { text: "Large (<=25 persons)", value: "large" },
        { text: "Medium (<=15 persons)", value: "medium" },
        { text: "Small (<=5 persons)", value: "small" }
      ]
    };
  },
  methods: {
    async validate() {
      this.valid = await this.$refs.form.validate();
    },
    async register() {
      await this.validate();
      if (this.valid) {
        let registerData;
        if (this.form_register.role == "user") {
          registerData = {
            email: this.form_register.email,
            nama: this.form_register.nama,
            notelp: this.form_register.notelp,
            role: this.form_register.role
          };
        } else if (this.form_register.role == "owner") {
          registerData = {
            email: this.form_register.email,
            nama: this.form_register.nama,
            notelp: this.form_register.notelp,
            role: this.form_register.role
          };
        } else if (this.form_register.role == "transport") {
          registerData = {
            email: this.form_register.email,
            nama: this.form_register.nama,
            notelp: this.form_register.notelp,
            perusahaan_transport: this.form_register.perusahaan_transport,
            transports: this.form_register.transports,
            role: this.form_register.role
          };
        }
        let user;
        try {
          user = await firebase.auth.createUserWithEmailAndPassword(
            this.form_register.email,
            this.form_register.password
          );
        } catch (error) {
          console.error(error);
        }
        user = user.user;
        try {
          await firebase.db
            .collection("users")
            .doc(user.uid)
            .set(registerData);
        } catch (error) {
          console.error(error);
        }
        this.$store.commit("setCurrentUser", user);
        await this.$store.dispatch("fetchUserProfile");
        this.$router.push("/" + this.form_register.role);
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
