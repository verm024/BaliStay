<template>
  <div class="edit-homestay">
    Form tambah penginapan
    <input
      type="text"
      v-model="form_penginapan.nama_penginapan"
      placeholder="Nama Penginapan"
    />
    <input
      type="text"
      v-model="form_penginapan.notelp_penginapan"
      placeholder="Nomor Telepon Penginapan"
    />
    <input
      type="text"
      v-model="form_penginapan.alamat_penginapan"
      placeholder="Alamat Penginapan"
    />
    <input
      type="text"
      v-model="form_penginapan.deskripsi_penginapan"
      placeholder="Deskripsi Penginapan"
    />
    <input
      type="number"
      v-model="form_penginapan.harga_penginapan"
      min="0"
      placeholder="Harga Penginapan (IDR)"
    />
    <select v-model="form_penginapan.kota_penginapan">
      <option v-for="(item, index) in daftar_kota" :key="index" :value="item">{{
        item
      }}</option>
    </select>
    <input type="file" @change="handleChangeInputFotoPenginapan" />
    <button @click="updateHomestay">Add</button>
  </div>
</template>

<script>
import firebase from "../firebase";
import store from "../store";
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
        foto_penginapan: ""
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
    async updateHomestay() {
      let dataPenginapan = {
        nama_penginapan: this.form_penginapan.nama_penginapan,
        notelp_penginapan: this.form_penginapan.notelp_penginapan,
        alamat_penginapan: this.form_penginapan.alamat_penginapan,
        deskripsi_penginapan: this.form_penginapan.deskripsi_penginapan,
        kota_penginapan: this.form_penginapan.kota_penginapan,
        harga_penginapan: parseInt(this.form_penginapan.harga_penginapan),
        owner: firebase.db.collection("users").doc(this.currentUser.uid)
      };
      try {
        await firebase.db
          .collection("penginapan")
          .doc(this.$route.params.id)
          .update(dataPenginapan);
      } catch (error) {
        console.error(error);
      }
      if (this.form_penginapan.foto_penginapan != "") {
        try {
          let ref = firebase.storage
            .ref()
            .child(
              "/penginapan/" +
                this.$route.params.id +
                "." +
                this.form_penginapan.foto_penginapan.type.split("/")[1]
            );
          let task = await ref.put(this.form_penginapan.foto_penginapan);
        } catch (error) {
          console.error(error);
        }
      }
      this.$router.push("/owner");
    },
    handleChangeInputFotoPenginapan(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      if (!files[0].type.includes("image")) {
        this.form_penginapan.foto_penginapan = "";
      } else {
        this.form_penginapan.foto_penginapan = files[0];
      }
    }
  },
  async created() {
    let doc;
    try {
      doc = await firebase.db
        .collection("penginapan")
        .doc(this.$route.params.id)
        .get();
    } catch (error) {
      console.error(error);
    }
    let data = doc.data();
    this.form_penginapan = data;
    this.form_penginapan.foto_penginapan = "";
  },
  computed: {
    ...mapState(["currentUser", "userProfile"])
  },
  async beforeRouteEnter(to, from, next) {
    let doc = await firebase.db
      .collection("penginapan")
      .doc(to.params.id)
      .get();
    if (doc.exists) {
      let data = doc.data();
      if (data.owner.id == store.state.currentUser.uid) {
        next();
      } else {
        next("/owner");
      }
    } else {
      next("/owner");
    }
  }
};
</script>

<style></style>
