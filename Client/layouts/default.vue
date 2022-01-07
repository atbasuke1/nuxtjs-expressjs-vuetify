<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-btn :to="'/'">Home</v-btn>
      <!-- <v-btn @click="upload">Upload file</v-btn> -->
      <v-btn @click="photo" :to="'/photo'"> Upload</v-btn>
      <v-spacer></v-spacer>
       <!-- <div v-if="Name">
        <h4>hello, {{ Name }}</h4>
      </div> -->
      <v-spacer></v-spacer>
      <v-btn @click="login">Login</v-btn>
      <v-btn @click="register">Sign Up</v-btn>
      <v-btn @click="logout"> Log Out</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt/>
        <v-img src></v-img>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import api from '../service/api';
import store from "../store/store";

export default {
  name: "DefaultLayout",
  data() {
    return {
      isConnected: false,
      email: "",
      password: "",
      clipped: false,
      drawer: false,
      fixed: false,
      Name: store.state.user,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js",
    };
  },
  methods: {
     logout() {
      try {
        store.commit("setIsUserLoggedIn", this.isConnected);
        this.$router.push({path:"/login"});
        window.localStorage.clear();
        // location.reload();
        alert("ban da dang xuat!!!!"); 
      } catch (error) {
        alert("Ban chua Dang nhap!!!!");
      }
    },

     login() {
      console.log("islogin: ", store.state.isUserLoggedIn);
      console.log("da click vao login");
      if (store.state.isUserLoggedIn) {
        this.$router.push("");
      } else {
        this.$router.push({path:"/login"});
      }
    },

     register() {
      console.log("islogin: ", store.state.isUserLoggedIn);
      if (store.state.isUserLoggedIn) {
        this.$router.push("");
      } else {
        this.$router.push("/register");
      }
    },

    async photo() {
      console.log("islogin: ", store.state.isUserLoggedIn);
      await api().get("/photos");
      if (store.state.isUserLoggedIn) {
        this.$router.push("/photo");
      } else {
        this.$router.push("/login");
      }
    },
  },
  mounted: function () {

  },
};
</script>
<style scoped></style>
