<template>
  <div class="book-homestay">
    Page book homestay

    <input type="text" v-model="form_pemesanan.nama_pemesan" />
    <input type="text" v-model="form_pemesanan.notelp_pemesan" />
    <!-- Tanggal mulai = tanggal check in, tanggal akhir = tanggal check out -->
    <input
      type="date"
      @change="handleDateChange"
      :min="Date.now()"
      v-model="form_pemesanan.tanggal_mulai_pesanan"
    />
    <input
      type="date"
      @change="handleDateChange"
      :min="form_pemesanan.tanggal_mulai_pesanan"
      v-model="form_pemesanan.tanggal_akhir_pesanan"
    />
    <input type="number" v-model="form_pemesanan.harga_total" disabled />
    <button @click="book">Book Now!</button>

    <div v-if="available">
      Tersedia
    </div>
    <div v-else>
      Tidak tersedia
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
      data_homestay: [],
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
      try {
        await firebase.db
          .collection("penginapan")
          .doc(this.$route.params.id)
          .collection("pemesanan")
          .add(dataPemesanan);
      } catch (error) {
        console.error(error);
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
            let currentMulaiDate =
              new Date(this.form_pemesanan.tanggal_mulai_pesanan) / 1000;
            let currentAkhirDate =
              new Date(this.form_pemesanan.tanggal_akhir_pesanan) / 1000;
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
              currentMulaiDate <= elementAkhirDate
            ) {
              // Tanggal mulai pesanan ada di antara yang sudah ada
              this.available = false;
            } else if (
              currentAkhirDate >= elementMulaiDate &&
              currentAkhirDate <= elementAkhirDate
            ) {
              // Tanggal akhir pesanan ada di antara yang sudah ada
              this.available = false;
            } else {
              this.available = true;
            }
          }
        });
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
        jumlahMalam * this.data_homestay.harga_penginapan;
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
    get_data_homestay: {
      immediate: true,
      handler() {
        this.$bind(
          "data_homestay",
          firebase.db.collection("penginapan").doc(this.$route.params.id)
        );
      }
    }
  },
  async updated() {
    this.daftar_pemesanan.forEach(async element => {
      if (element.tanggal_akhir_pesanan.seconds > firebase.timestamp.seconds) {
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

<style></style>
