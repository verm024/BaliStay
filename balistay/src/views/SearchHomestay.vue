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
    <div v-for="(item, index) in filterList" :key="index">
      {{ item.nama_penginapan }}
      <br />
      Kota: {{ item.kota_penginapan }} Harga: {{ item.harga_penginapan }}
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
      ref = firebase.db
        .collection("penginapan");
      ref.onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          const data = doc.data();
          this.daftar_penginapan.push(data);
        });
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
