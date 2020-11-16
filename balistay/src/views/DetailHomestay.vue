<template>
  <div class="detail-homestay container">
    <div class="header">
      <v-row class="align-center">
        <v-col cols="7">
          <h1 class="title">{{ data_penginapan.nama_penginapan }}</h1>
          <div class="kota">
            <span>{{ data_penginapan.kota_penginapan }}, Bali, Indonesia</span>
          </div>
          <div class="price">
            <span>Price: ${{ data_penginapan.harga_penginapan }}</span>
          </div>
          <div class="button">
            <router-link :to="'/book/' + data_penginapan.id">
              <v-btn class="white--text" tile color="#0EBEE4" elevation="0">
                <v-icon left>
                  mdi-currency-usd
                </v-icon>
                Order Homestay
              </v-btn>
            </router-link>
            <v-btn class="white--text ml-5" tile color="#0EBEE4" elevation="0">
              <v-icon left>
                mdi-email-outline
              </v-icon>
              Contact Homestay
            </v-btn>
          </div>
        </v-col>
        <v-col cols="5">
          <v-img :src="data_penginapan.image" />
        </v-col>
      </v-row>
    </div>
    <div class="homestay-info">
      <v-card class="card-info">
        <v-card-title class="card-info-title">
          Overview {{ data_penginapan.nama_penginapan }}
        </v-card-title>
        <v-card-text>
          <div class="card-info-text">
            {{ data_penginapan.deskripsi_penginapan }}
          </div>
        </v-card-text>
      </v-card>
    </div>
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
    if (doc.exists) {
      next();
    } else {
      next("/" + store.state.userProfile.role);
    }
  }
};
</script>

<style scoped>
.title {
  font-weight: bold !important;
  font-size: 48px !important;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
}

.kota {
  margin-top: 15px;
}

.price {
  margin-top: 20px;
}

.kota span,
.price span {
  font-weight: normal;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.4);
}

.button {
  margin-top: 40px;
}

.button a {
  text-decoration: none;
}

.button .v-btn {
  text-transform: capitalize;
  letter-spacing: unset;
  font-weight: normal;
}

.homestay-info {
  margin-top: 100px;
}

.card-info {
  padding: 30px 70px;
}

.card-info-title {
  font-weight: normal;
  font-size: 18px;
}

.card-info-text {
  font-weight: normal;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.4);
}
</style>
