<template>
  <div class="transport container">
    <v-card class="card-info" elevation="0" tile>
      <v-card-title class="justify-space-between">
        <div class="title">
          Transport Order List
        </div>
      </v-card-title>
    </v-card>
    <div class="list-wrapper">
      <div class="list-title">
        Active orders
      </div>
      <div class="list-empty" v-if="filterAktif.length == 0">
        Belum ada pemesanan
      </div>
      <v-card
        v-for="(item, index) in filterAktif"
        :key="index"
        class="mx-auto mb-5 pt-4 pb-4 pl-3 pr-3"
        outlined
      >
        <v-list-item four-line>
          <v-list-item-avatar
            class="mr-5"
            tile
            width="150px"
            height="100px"
            color="grey"
          >
            <v-img :src="item.penginapan.image" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline">
              {{ item.pemesanan.nama_pemesan }}
            </v-list-item-title>
            <v-list-item-subtitle class="date">
              {{ formatDate(item.pemesanan.tanggal_mulai_pesanan.seconds) }} -
              {{ formatDate(item.pemesanan.tanggal_akhir_pesanan.seconds) }}
              ({{ item.pemesanan.tipe }})
            </v-list-item-subtitle>
            <v-list-item-subtitle class="homestay">{{
              item.penginapan.nama_penginapan
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
import firebase from "../../firebase";
import { mapState } from "vuex";

export default {
  data() {
    return {
      daftar_pemesanan: []
    };
  },
  methods: {
    formatDate(timestamp) {
      let date = new Date(timestamp * 1000);
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      date = date.getDate();
      return date + "/" + month + "/" + year;
    }
  },
  computed: {
    ...mapState(["currentUser", "userProfile"]),
    filterAktif() {
      return this.daftar_pemesanan.filter(element => {
        return (
          element.pemesanan.status_pesanan == "active" &&
          element.pemesanan.status_pembayaran == "paid"
        );
      });
    }
  },
  watch: {
    get_daftar_pemesanan: {
      immediate: true,
      handler() {
        this.$bind(
          "daftar_pemesanan",
          firebase.db
            .collection("users")
            .doc(this.currentUser.uid)
            .collection("pemesanan")
        );
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
    }
  }
};
</script>

<style scoped>
.button a {
  text-decoration: none;
}

.button .v-btn {
  text-transform: capitalize;
  letter-spacing: unset;
  font-weight: normal;
}

.list-wrapper {
  margin-top: 30px;
  margin-left: 16px;
  margin-right: 16px;
}

.list-title {
  font-size: 18px;
  font-weight: normal;
  margin-bottom: 15px;
}

.list-empty {
  font-weight: 300;
}

.headline {
  font-size: 18px !important;
  text-transform: uppercase;
  font-weight: 500;
}

.date {
  font-size: 16px;
  margin-top: 10px;
  text-transform: capitalize;
}

.homestay {
  font-size: 14px;
  margin-top: 20px;
}
</style>
