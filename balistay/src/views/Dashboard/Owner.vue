<template>
  <div class="owner container">
    <v-card class="card-info" elevation="0" tile>
      <v-card-title class="justify-space-between">
        <div class="title">
          Homestay List
        </div>
        <div class="button">
          <router-link to="/new-homestay">
            <v-btn class="white--text ml-5" tile color="#0EBEE4" elevation="0">
              New Homestay
            </v-btn>
          </router-link>
        </div>
      </v-card-title>
      <v-card-text>
        <v-card class="card-list text-center pb-10" outlined>
          <v-card-text>
            <div class="card-list-text">
              <div
                class="mx-5 mr-5 mt-10"
                v-for="(item, index) in daftar_penginapan"
                :key="index"
              >
                <router-link :to="'/homestay/' + item.id">
                  <v-card width="250" outlined>
                    <v-img :src="item.image" height="150"></v-img>
                    <v-card-text class="text-left">
                      <span class="nama-penginapan">{{
                        item.nama_penginapan
                      }}</span>
                    </v-card-text>
                  </v-card>
                </router-link>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
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

<style scoped>
.title {
  font-weight: normal;
}

.button a {
  text-decoration: none;
}

.button .v-btn {
  text-transform: capitalize;
  letter-spacing: unset;
  font-weight: normal;
}

.card-list {
  margin-top: 50px;
}

.card-list-text div {
  display: inline-block;
}

.nama-penginapan {
  font-weight: bold;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
}
</style>
