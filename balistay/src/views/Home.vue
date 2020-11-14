<template>
  <div class="home">
    <img class="topImage" alt="BaliStay" src="../assets/mainImage.svg" />
    <div class="titleS">
      <div class="sTitle">
        Simple, Cheap place to stay. Take your time to explore & hang out
      </div>
      <div>we can deliver even the most unusual ideas!</div>
      <div>Discover best Homestay at Bali, Indonesia</div>
      <router-link to="/search">
        <v-btn class="mt-5 white--text" color="#0EBEE4">
          Find Homestay
        </v-btn>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style scoped>
.titleS {
  float: left;
  margin: 80px 0 0 80px;
}
.sTitle {
  font-size: 40;
}
.topImage {
  float: right;
}
</style>
