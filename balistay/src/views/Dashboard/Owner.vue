<template>
  <div class="owner">
    Dashboard Owner
    <router-link to="/new-homestay">
      New Homestay
    </router-link>
    <div>
      <div v-for="(item, index) in daftar_penginapan" :key="index">
        {{ item.nama_penginapan }}
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "../../firebase";
import { mapState } from "vuex";

export default {
  data() {
    return {
      daftar_penginapan: []
    };
  },
  computed: {
    ...mapState(["currentUser", "userProfile"])
  },
  watch: {
    get_daftar_penginapan: {
      immediate: true,
      handler() {
        this.$bind(
          "daftar_penginapan",
          firebase.db
            .collection("penginapan")
            .where(
              "owner",
              "==",
              firebase.db.collection("users").doc(this.currentUser.uid)
            )
        );
      }
    }
  }
};
</script>

<style></style>
