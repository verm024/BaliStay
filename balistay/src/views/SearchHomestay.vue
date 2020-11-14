<template>
  <div class="search-homestay">
    <select v-model="filter.current">
      <option v-for="(item, index) in filter.list" :key="index" :value="item">{{
        item
      }}</option>
    </select>
    <input
      type="number"
      min="0"
      placeholder="Price max"
      v-model="filter.max_harga"
    />
    <br />
    <div v-for="(item, index) in filterList" :key="index">
      <v-card class="mx-auto mb-5" max-width="800" outlined>
        <v-list-item four-line>
          <v-list-item-avatar tile size="100" color="grey"></v-list-item-avatar>
          <v-list-item-content>
            <!-- <div class="overline mb-4">
              OVERLINE
            </div> -->
            <v-list-item-title class="headline">
              {{ item.nama_penginapan }}
            </v-list-item-title>
            <v-list-item-subtitle>{{
              item.kota_penginapan
            }}</v-list-item-subtitle>
            <v-list-item-subtitle
              >$ {{ item.harga_penginapan }}</v-list-item-subtitle
            >
          </v-list-item-content>
          <router-link :to="'/homestay/' + item.id">
            <v-btn class="white--text" color="#0EBEE4">
              Book Homestay
            </v-btn>
          </router-link>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
import firebase from "../firebase";

export default {
  data() {
    return {
      filter: {
        current: "All",
        list: [
          "All",
          "Badung",
          "Bangli",
          "Buleleng",
          "Gianyar",
          "Jembrana",
          "Karangasem",
          "Klungkung",
          "Tabanan",
          "Denpasar"
        ],
        max_harga: 0
      },
      daftar_penginapan: []
    };
  },
  async created() {
    let ref;
    try {
      let doc = await firebase.db.collection("penginapan").get();
      doc.forEach(element => {
        let data = element.data();
        data.id = element["id"];
        this.daftar_penginapan.push(data);
      });
    } catch (error) {
      console.error(error);
    }
  },
  computed: {
    filterList() {
      return this.daftar_penginapan.filter(element => {
        if (
          this.filter.current == "All" &&
          parseInt(this.filter.max_harga) == 0
        ) {
          return true;
        } else if (
          this.filter.current != "All" &&
          parseInt(this.filter.max_harga) != 0
        ) {
          return (
            this.filter.current == element.kota_penginapan &&
            this.filter.max_harga >= parseInt(element.harga_penginapan)
          );
        } else if (
          this.filter.current == "All" &&
          parseInt(this.filter.max_harga) != 0
        ) {
          return this.filter.max_harga >= parseInt(element.harga_penginapan);
        } else if (
          this.filter.current != "All" &&
          parseInt(this.filter.max_harga) == 0
        ) {
          return this.filter.current == element.kota_penginapan;
        }
      });
    }
  }
};
</script>

<style></style>
