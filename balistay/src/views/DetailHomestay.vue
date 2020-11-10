<template>
  <div class="detail-homestay">
    ini detail homestay
  </div>
</template>

<script>
import firebase from "../firebase";
import store from "../store";
import { mapState } from "vuex";

export default {
  data() {
    return {
      data_penginapan: []
    };
  },
  watch: {
    get_data_penginapan: {
      immediate: true,
      handler() {
        this.$bind(
          "data_penginapan",
          firebase.db.collection("penginapan").doc(this.$route.params.id)
        );
      }
    }
  },
  computed: {
    ...mapState(["currentUser", "userProfile"])
  },
  async beforeRouteEnter(to, from, next) {
    let doc = await firebase.db
      .collection("penginapan")
      .doc(to.params.id)
      .get();
    console.log(doc);
    if (doc.exists) {
      next();
    } else {
      next("/" + store.state.userProfile.role);
    }
  }
};
</script>

<style></style>
