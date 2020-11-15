<template>
  <div class="book-detail container">
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
            <v-btn class="white--text" tile color="#0EBEE4" elevation="0">
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
    <div class="book-info">
      <v-card class="card-info">
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Price"
                outlined
                disabled
                v-model="data_pemesanan.harga_total"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5">
              <v-text-field
                label="Transfer to"
                outlined
                disabled
                :value="'812087190547 (' + data_pemesanan.metode_pembayaran + ')'"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                outlined
                disabled
                value="PT Airwave Tech Co."
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              Payment status
              <div class="payment-status">
                {{ data_pemesanan.status_pembayaran }}
              </div>
            </v-col>
          </v-row>
          <v-row v-if="data_pemesanan.status_pembayaran == 'waiting'">
            <v-col
              style="margin-top: 50px"
              class="button text-right"
              offset="8"
              cols="4"
            >
              <v-btn
                class="white--text"
                tile
                color="#FA5151"
                elevation="0"
                @click="cancel"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
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
      data_penginapan: [],
      data_pemesanan: []
    };
  },
  watch: {
    get_data_penginapan: {
      immediate: true,
      handler() {
        this.$bind(
          "data_penginapan",
          firebase.db
            .collection("penginapan")
            .doc(this.$route.params.id.split("+-+")[0])
        );
        this.$bind(
          "data_pemesanan",
          firebase.db
            .collection("penginapan")
            .doc(this.$route.params.id.split("+-+")[0])
            .collection("pemesanan")
            .doc(this.$route.params.id.split("+-+")[1])
        );
      }
    }
  },
  methods: {
    async cancel() {
      try {
        await firebase.db
          .collection("penginapan")
          .doc(this.$route.params.id.split("+-+")[0])
          .collection("pemesanan")
          .doc(this.$route.params.id.split("+-+")[1])
          .update({
            status_pesanan: "canceled",
            status_pembayaran: "canceled"
          });
      } catch (error) {
        console.error(error);
      }
      this.$router.push("/" + this.userProfile.role);
    }
  },
  computed: {
    ...mapState(["currentUser", "userProfile"])
  },
  async beforeRouteEnter(to, from, next) {
    let params = to.params.id.split("+-+");
    let doc = await firebase.db
      .collection("penginapan")
      .doc(params[0])
      .collection("pemesanan")
      .doc(params[1])
      .get();
    if (doc.exists) {
      let data = doc.data();
      if (data.user.id == store.state.currentUser.uid) {
        next();
      } else {
        next("/user");
      }
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

.book-info {
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

.payment-status {
  font-weight: 500;
  font-size: 48px;
  line-height: 56px;
  color: #000000;
  opacity: 0.6;
  text-transform: capitalize;
}
</style>
