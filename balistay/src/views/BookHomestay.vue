<template>
  <div class="book-homestay container">
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
            <v-col cols="6">
              <v-text-field
                label="FullName"
                outlined
                v-model="form_pemesanan.nama_pemesan"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Phone Number"
                outlined
                v-model="form_pemesanan.notelp_pemesan"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row style="height: 86px">
            <v-col cols="12">
              <label>Date</label>
              <br />
              <input
                class="mr-5"
                type="date"
                @change="handleDateChange"
                :min="Date.now()"
                v-model="form_pemesanan.tanggal_mulai_pesanan"
              />
              to
              <input
                class="ml-5"
                type="date"
                @change="handleDateChange"
                :min="form_pemesanan.tanggal_mulai_pesanan"
                v-model="form_pemesanan.tanggal_akhir_pesanan"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-text-field
                label="Price"
                outlined
                v-model="form_pemesanan.harga_total"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row style="height: 86px">
            <v-col cols="12">
              <label>Payment Method</label>
              <div class="d-flex justify-space-between">
                <div class="payment-choice">
                  Go-Pay
                </div>
                <div class="payment-choice payment-choice-active">
                  OVO
                </div>
                <div class="payment-choice">
                  BCA
                </div>
                <div class="payment-choice">
                  Mandiri
                </div>
                <div class="payment-choice">
                  BNI
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row style="margin-top: 60px">
            <v-col class="button text-center" offset="4" cols="4">
              <v-btn
                v-if="available"
                class="white--text"
                tile
                color="#0EBEE4"
                elevation="0"
                @click="book"
              >
                Order
              </v-btn>
              <div v-else>
                Tanggal tidak tersedia
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import firebase from "../firebase";
import { mapState } from "vuex";
import store from "../store";

export default {
  data() {
    return {
      form_pemesanan: {
        nama_pemesan: "",
        notelp_pemesan: "",
        tanggal_mulai_pesanan: "",
        tanggal_akhir_pesanan: "",
        metode_pembayaran: "ovo",
        harga_total: 0
      },
      daftar_pemesanan: [],
      data_penginapan: [],
      available: false
    };
  },
  computed: {
    ...mapState(["currentUser", "userProfile"])
  },
  methods: {
    async book() {
      let tanggalMulai = new Date(this.form_pemesanan.tanggal_mulai_pesanan);
      let tanggalAkhir = new Date(this.form_pemesanan.tanggal_akhir_pesanan);
      tanggalMulai.setHours(12, 0, 0, 0);
      tanggalAkhir.setHours(12, 0, 0, 0);
      let dataPemesanan = {
        nama_pemesan: this.form_pemesanan.nama_pemesan,
        notelp_pemesan: this.form_pemesanan.notelp_pemesan,
        harga_total: this.form_pemesanan.harga_total,
        tanggal_mulai_pesanan: tanggalMulai,
        tanggal_akhir_pesanan: tanggalAkhir,
        metode_pembayaran: "ovo",
        status_pesanan: "active",
        status_pembayaran: "waiting",
        user: firebase.db.collection("users").doc(this.currentUser.uid)
      };
      if (this.userProfile.role == "owner") {
        dataPemesanan.status_pembayaran = "paid";
      }
      let data;
      try {
        data = await firebase.db
          .collection("penginapan")
          .doc(this.$route.params.id)
          .collection("pemesanan")
          .add(dataPemesanan);
      } catch (error) {
        console.error(error);
      }
      if (data.id) {
        await firebase.db
          .collection("users")
          .doc(this.currentUser.uid)
          .collection("history")
          .add({
            pemesanan: firebase.db
              .collection("penginapan")
              .doc(this.$route.params.id)
              .collection("pemesanan")
              .doc(data.id)
          });
      }
      this.$router.push("/user");
    },
    handleDateChange() {
      if (
        !(
          this.form_pemesanan.tanggal_mulai_pesanan == "" &&
          this.form_pemesanan.tanggal_akhir_pesanan == ""
        )
      ) {
        this.daftar_pemesanan.forEach(element => {
          if (element.tanggal_mulai_pesanan && element.tanggal_akhir_pesanan) {
            let temp = new Date(this.form_pemesanan.tanggal_mulai_pesanan);
            temp.setHours(12, 0, 0, 0);
            let currentMulaiDate = temp / 1000;
            temp = new Date(this.form_pemesanan.tanggal_akhir_pesanan);
            temp.setHours(12, 0, 0, 0);
            let currentAkhirDate = temp / 1000;
            let elementMulaiDate = element.tanggal_mulai_pesanan.seconds;
            let elementAkhirDate = element.tanggal_akhir_pesanan.seconds;
            if (
              currentMulaiDate <= elementMulaiDate &&
              currentAkhirDate >= elementAkhirDate
            ) {
              // Tanggal yang sudah ada di antara mulai pesanan dan akhir pesanan
              this.available = false;
            } else if (
              currentMulaiDate >= elementMulaiDate &&
              currentMulaiDate < elementAkhirDate
            ) {
              // Tanggal mulai pesanan ada di antara yang sudah ada
              this.available = false;
            } else if (
              currentAkhirDate > elementMulaiDate &&
              currentAkhirDate <= elementAkhirDate
            ) {
              // Tanggal akhir pesanan ada di antara yang sudah ada
              this.available = false;
            } else {
              this.available = true;
            }
          }
        });
        if (this.daftar_pemesanan.length == 0) {
          this.available = true;
        }
        this.calculatePrice();
      }
    },
    calculatePrice() {
      let tanggalMulai = new Date(this.form_pemesanan.tanggal_mulai_pesanan);
      let tanggalAkhir = new Date(this.form_pemesanan.tanggal_akhir_pesanan);
      let jumlahMalam = Math.floor(
        Math.floor(tanggalAkhir / 1000 - tanggalMulai / 1000) / 86400
      );
      this.form_pemesanan.harga_total =
        jumlahMalam * this.data_penginapan.harga_penginapan;
    }
  },
  created() {
    this.form_pemesanan.nama_pemesan = this.userProfile.nama;
    this.form_pemesanan.notelp_pemesan = this.userProfile.notelp;
  },
  watch: {
    get_daftar_pemesanan: {
      immediate: true,
      handler() {
        this.$bind(
          "daftar_pemesanan",
          firebase.db
            .collection("penginapan")
            .doc(this.$route.params.id)
            .collection("pemesanan")
            .where("status_pesanan", "==", "active")
        );
      }
    },
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
  async updated() {
    this.daftar_pemesanan.forEach(async element => {
      if (element.tanggal_akhir_pesanan.seconds < firebase.timestamp.seconds) {
        try {
          await firebase.db
            .collection("penginapan")
            .doc(this.$route.params.id)
            .collection("pemesanan")
            .doc(element.id)
            .update({ status_pesanan: "finished" });
        } catch (error) {
          console.error(error);
        }
      }
    });
  },
  async beforeRouteEnter(to, from, next) {
    let doc = await firebase.db
      .collection("penginapan")
      .doc(to.params.id)
      .get();
    if (doc.exists) {
      if (store.state.userProfile.role == "owner") {
        if (store.state.currentUser.uid == doc.owner.id) {
          next();
        } else {
          next("/owner");
        }
      } else {
        next();
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

.payment-choice {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  margin-top: 10px;
}

.payment-choice-active {
  border-color: #0ebee4;
}
</style>
