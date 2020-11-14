<template>
  <div class="search-homestay">
    <v-card max-width="800px" class="mx-auto" tile elevation="0">
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="filter.current"
            :items="filter.list"
            label="Location"
            persistent-hint
            return-object
            single-line
            outlined
          ></v-select>
        </v-col>
        <v-col>
          <v-text-field
            v-model="filter.max_harga"
            label="Maximum Price"
            min="0"
            outlined
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card>
    <div v-for="(item, index) in filterList" :key="index">
      <v-card class="mx-auto mb-5 pt-4 pb-4 pl-3 pr-3" max-width="800" outlined>
        <v-list-item four-line>
          <v-list-item-avatar
            class="mr-5"
            tile
            width="150px"
            height="100px"
            color="grey"
          >
            <v-img :src="item.image" />
          </v-list-item-avatar>
          <v-list-item-content>
            <!-- <div class="overline mb-4">
              OVERLINE
            </div> -->
            <v-list-item-title class="headline">
              {{ item.nama_penginapan }}
            </v-list-item-title>
            <v-list-item-subtitle class="location">{{
              item.kota_penginapan
            }}</v-list-item-subtitle>
            <v-list-item-subtitle class="price"
              >Price
              <strong
                >${{ item.harga_penginapan }}</strong
              ></v-list-item-subtitle
            >
          </v-list-item-content>
          <router-link class="discover" :to="'/homestay/' + item.id">
            <v-btn class="white--text" color="#0EBEE4">
              Discover
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

<style scoped>
.headline {
  font-size: 18px !important;
  text-transform: uppercase;
  font-weight: 500;
}

.location {
  font-size: 16px;
  margin-top: 10px;
}

.price {
  font-size: 14px;
  margin-top: 20px;
}

.discover {
  text-decoration: none;
}

.discover .v-btn {
  text-transform: capitalize;
  letter-spacing: unset;
  font-weight: normal;
}
</style>
