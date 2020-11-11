<template>
  <div class="user">
    Dashboard User
  </div>
</template>

<script>
import firebase from "../../firebase";
import { mapState } from "vuex";

export default {
  data() {
    return {
      history_pemesanan: []
    };
  },
  watch: {
    get_history_pemesanan: {
      immediate: true,
      handler() {
        this.$bind(
          "history_pemesanan",
          firebase.db
            .collection("users")
            .doc(this.currentUser.uid)
            .collection("history")
        );
      }
    },
    filterMenungguPembayaran: {
      deep: true,
      handler() {
        this.filterMenungguPembayaran.sort((a, b) => {
          return (
            a.pemesanan.tanggal_mulai_pesanan.seconds -
            b.pemesanan.tanggal_mulai_pesanan.seconds
          );
        });
      }
    },
    filterAktif: {
      deep: true,
      handler() {
        this.filterAktif.sort((a, b) => {
          return (
            a.pemesanan.tanggal_mulai_pesanan.seconds -
            b.pemesanan.tanggal_mulai_pesanan.seconds
          );
        });
      }
    },
    filterSelesai: {
      deep: true,
      handler() {
        this.filterSelesai.sort((a, b) => {
          return (
            a.pemesanan.tanggal_mulai_pesanan.seconds -
            b.pemesanan.tanggal_mulai_pesanan.seconds
          );
        });
      }
    },
    filterDibatalkan: {
      deep: true,
      handler() {
        this.filterDibatalkan.sort((a, b) => {
          return (
            a.pemesanan.tanggal_mulai_pesanan.seconds -
            b.pemesanan.tanggal_mulai_pesanan.seconds
          );
        });
      }
    }
  },
  computed: {
    ...mapState(["currentUser", "userProfile"]),
    filterMenungguPembayaran() {
      return this.history_pemesanan.filter(element => {
        return (
          element.pemesanan.status_pesanan == "active" &&
          element.pemesanan.status_pembayaran == "waiting"
        );
      });
    },
    filterAktif() {
      return this.history_pemesanan.filter(element => {
        return (
          element.pemesanan.status_pesanan == "active" &&
          element.pemesanan.status_pembayaran == "paid"
        );
      });
    },
    filterSelesai() {
      return this.history_pemesanan.filter(element => {
        return (
          element.pemesanan.status_pesanan == "finished" &&
          element.pemesanan.status_pembayaran == "paid"
        );
      });
    },
    filterDibatalkan() {
      return this.history_pemesanan.filter(element => {
        return element.pemesanan.status_pesanan == "canceled";
      });
    }
  }
};
</script>

<style></style>
