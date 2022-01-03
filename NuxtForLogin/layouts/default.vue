<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-btn :to="'/'">Home</v-btn>
      <!-- <v-btn @click="upload">Upload file</v-btn> -->
      <v-btn @click="photo" :to = "'/photo'"> Upload</v-btn>

      <v-spacer></v-spacer>
      <v-btn @click="login">Login</v-btn>
      <v-btn @click="register">Sign Up</v-btn>
      <v-btn @click="logout"> Log Out</v-btn>

    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
        <v-img src></v-img>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AuthenticationService from "../service/AuthenticationService";
import store from "../store/store";
import axios from "axios";

export default {
  name: "DefaultLayout",
  data() {
    return {
      islogin: true,
      email: "",
      password: "",
      clipped: false,
      drawer: false,
      fixed: false,
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
    async logout() {
      try {
        // islogin = store.state.isUserLoggedIn
        console.log("islogin: ", store.state.isUserLoggedIn);
        console.log("response", store.state);
        const test = JSON.parse(store.state.user);
        const response = AuthenticationService.logout({
          email: test.email,
          password: test.password,
        });
        console.log("response", test.password);
        store.dispatch("setisUserLoggedIn", false);
        store.dispatch("setToken", "");
        store.dispatch("setUser", "");

        console.log("islogin: ", store.state.isUserLoggedIn);
        alert("ban da dang xuat!!!!");
        this.$router.push("/login");
      } catch (error) {
        alert("Ban chua Dang nhap!!!!");
      }
    },
    // async upload() {
    //   console.log("token", store.state.token == "");
    //   if (store.state.token !== "") {
    //     this.$router.push("/upload");
    //   } else {
    //     this.$router.push("/login");
    //   }
    // },
    async login() {
      console.log("token", store.state.token == "");
      if (store.state.token !== "") {
        this.$router.push("/");
      } else {
        this.$router.push("/login");
      }
    },
    async register() {
      console.log("token", store.state.token == "");
      if (store.state.token !== "") {
        this.$router.push("/");
      } else {
        this.$router.push("/register");
      }
    },
    async photo(){
        await axios.get("http://localhost:8081/photos");
        // const response = await AuthenticationService.photo({
        //   email: this.email,
        //   password: this.password,
        // });
        if (store.state.token !== "") {
        this.$router.push("/photo");
      } else {
        this.$router.push("/login");
      }
    }

  },
};
</script>
<style scoped>
</style>
