<template>
  <div class="new-homestay container">
    <div class="homestay-info">
      <v-card class="card-info" elevation="0" tile>
        <v-card-title class="justify-center title">
          Add New Homestay
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Name"
                outlined
                v-model="form_penginapan.nama_penginapan"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Phone Number"
                outlined
                v-model="form_penginapan.notelp_penginapan"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Address"
                outlined
                v-model="form_penginapan.alamat_penginapan"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                label="Description"
                outlined
                v-model="form_penginapan.deskripsi_penginapan"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Price (USD)"
                outlined
                v-model="form_penginapan.harga_penginapan"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="form_penginapan.kota_penginapan"
                :items="daftar_kota"
                label="Location"
                persistent-hint
                return-object
                single-line
                outlined
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-file-input
                label="Photo"
                outlined
                v-model="form_penginapan.foto_penginapan"
                @change="handleChangeInputFotoPenginapan"
              ></v-file-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="button text-center" cols="12">
              <v-btn
                class="white--text"
                tile
                color="#0EBEE4"
                elevation="0"
                @click="addHomestay"
              >
                Add Homestay
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
import { mapState } from "vuex";

export default {
  data() {
    return {
      form_penginapan: {
        nama_penginapan: "",
        notelp_penginapan: "",
        alamat_penginapan: "",
        deskripsi_penginapan: "",
        harga_penginapan: "",
        kota_penginapan: "Badung",
        foto_penginapan: []
      },
      daftar_kota: [
        "Badung",
        "Bangli",
        "Buleleng",
        "Gianyar",
        "Jembrana",
        "Karangasem",
        "Klungkung",
        "Tabanan",
        "Denpasar"
      ]
    };
  },
  methods: {
    async addHomestay() {
      let dataPenginapan = {
        nama_penginapan: this.form_penginapan.nama_penginapan,
        notelp_penginapan: this.form_penginapan.notelp_penginapan,
        alamat_penginapan: this.form_penginapan.alamat_penginapan,
        deskripsi_penginapan: this.form_penginapan.deskripsi_penginapan,
        kota_penginapan: this.form_penginapan.kota_penginapan,
        harga_penginapan: parseInt(this.form_penginapan.harga_penginapan),
        owner: firebase.db.collection("users").doc(this.currentUser.uid)
      };
      let docPenginapan;
      try {
        docPenginapan = await firebase.db
          .collection("penginapan")
          .add(dataPenginapan);
      } catch (error) {
        console.error(error);
      }
      if (docPenginapan.id) {
        try {
          let ref = firebase.storage
            .ref()
            .child(
              "/penginapan/" +
                docPenginapan.id +
                "." +
                this.form_penginapan.foto_penginapan.type.split("/")[1]
            );
          let task = await ref.put(this.form_penginapan.foto_penginapan);
          let url = await task.ref.getDownloadURL();
          console.log(url);
          if (url) {
            try {
              await firebase.db
                .collection("penginapan")
                .doc(docPenginapan.id)
                .update({ image: url });
            } catch (error) {
              console.error(error);
            }
          }
        } catch (error) {
          console.error(error);
        }
        this.$router.push("/owner");
      }
    },
    handleChangeInputFotoPenginapan(files) {
      if (files) {
        if (!files.type.includes("image")) {
          this.form_penginapan.foto_penginapan = undefined;
        } else {
          this.form_penginapan.foto_penginapan = files;
        }
      }
    }
  },
  computed: {
    ...mapState(["currentUser", "userProfile"])
  }
};
</script>

<style scoped>
.title {
  font-size: 24px !important;
  margin-bottom: 20px;
}

.button .v-btn {
  text-transform: capitalize;
  letter-spacing: unset;
  font-weight: normal;
  width: 100%;
}
</style>
