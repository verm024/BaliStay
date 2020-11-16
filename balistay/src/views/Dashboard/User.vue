<template>
  <div class="user container">
    <v-card class="card-info" elevation="0" tile>
      <v-card-title class="justify-space-between">
        <div class="title">
          History Pemesanan
        </div>
        <div class="button">
          <router-link to="/search">
            <v-btn class="white--text ml-5" tile color="#0EBEE4" elevation="0">
              Search Homestay
            </v-btn>
          </router-link>
        </div>
      </v-card-title>
    </v-card>
    <div class="list-wrapper">
      <div class="list-title">
        Waiting for payment
      </div>
      <div class="list-empty" v-if="filterMenungguPembayaran.length == 0">
        Belum ada pemesanan
      </div>
      <v-card
        v-for="(item, index) in filterMenungguPembayaran"
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
              {{ item.penginapan.nama_penginapan }}
            </v-list-item-title>
            <v-list-item-subtitle class="date">
              {{ formatDate(item.pemesanan.tanggal_mulai_pesanan.seconds) }} -
              {{ formatDate(item.pemesanan.tanggal_akhir_pesanan.seconds) }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="price"
              >Price
              <strong
                >${{ item.pemesanan.harga_total }}</strong
              ></v-list-item-subtitle
            >
          </v-list-item-content>
          <div class="button">
            <router-link
              class="discover"
              :to="
                '/book-detail/' + item.penginapan.id + '+-+' + item.pemesanan.id
              "
            >
              <v-btn class="white--text" color="#0EBEE4" elevation="0">
                See details
              </v-btn>
            </router-link>
          </div>
        </v-list-item>
      </v-card>
    </div>
    <div class="list-wrapper">
      <div class="list-title">
        Active Book
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
              {{ item.penginapan.nama_penginapan }}
            </v-list-item-title>
            <v-list-item-subtitle class="date">
              {{ formatDate(item.pemesanan.tanggal_mulai_pesanan.seconds) }} -
              {{ formatDate(item.pemesanan.tanggal_akhir_pesanan.seconds) }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="price"
              >Price
              <strong
                >${{ item.pemesanan.harga_total }}</strong
              ></v-list-item-subtitle
            >
          </v-list-item-content>
          <div class="button">
            <router-link
              class="discover"
              :to="
                '/book-detail/' + item.penginapan.id + '+-+' + item.pemesanan.id
              "
            >
              <v-btn class="white--text" color="#0EBEE4" elevation="0">
                See details
              </v-btn>
            </router-link>
          </div>
        </v-list-item>
      </v-card>
    </div>
    <div class="list-wrapper">
      <div class="list-title">
        Finished Book
      </div>
      <div class="list-empty" v-if="filterSelesai.length == 0">
        Belum ada pemesanan
      </div>
      <v-card
        v-for="(item, index) in filterSelesai"
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
              {{ item.penginapan.nama_penginapan }}
            </v-list-item-title>
            <v-list-item-subtitle class="date">
              {{ formatDate(item.pemesanan.tanggal_mulai_pesanan.seconds) }} -
              {{ formatDate(item.pemesanan.tanggal_akhir_pesanan.seconds) }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="price"
              >Price
              <strong
                >${{ item.pemesanan.harga_total }}</strong
              ></v-list-item-subtitle
            >
          </v-list-item-content>
          <div class="button">
            <router-link
              class="discover"
              :to="
                '/book-detail/' + item.penginapan.id + '+-+' + item.pemesanan.id
              "
            >
              <v-btn class="white--text" color="#0EBEE4" elevation="0">
                See details
              </v-btn>
            </router-link>
          </div>
        </v-list-item>
      </v-card>
    </div>
    <div class="list-wrapper">
      <div class="list-title">
        Calceled
      </div>
      <div class="list-empty" v-if="filterDibatalkan.length == 0">
        Belum ada pemesanan
      </div>
      <v-card
        v-for="(item, index) in filterDibatalkan"
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
              {{ item.penginapan.nama_penginapan }}
            </v-list-item-title>
            <v-list-item-subtitle class="date">
              {{ formatDate(item.pemesanan.tanggal_mulai_pesanan.seconds) }} -
              {{ formatDate(item.pemesanan.tanggal_akhir_pesanan.seconds) }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="price"
              >Price
              <strong
                >${{ item.pemesanan.harga_total }}</strong
              ></v-list-item-subtitle
            >
          </v-list-item-content>
          <div class="button">
            <router-link
              class="discover"
              :to="
                '/book-detail/' + item.penginapan.id + '+-+' + item.pemesanan.id
              "
            >
              <v-btn class="white--text" color="#0EBEE4" elevation="0">
                See details
              </v-btn>
            </router-link>
          </div>
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
      history_pemesanan: []
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
}

.price {
  font-size: 14px;
  margin-top: 20px;
}
</style>
