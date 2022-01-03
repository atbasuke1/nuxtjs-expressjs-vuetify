<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="4">
      <v-form ref="form" lazy-validation @submit.prevent="">
        <v-toolbar-title class="font-weight-light"> <b>Login</b> </v-toolbar-title>
        <v-text-field
          v-model="email"
          type="email"
          label="E-mail"
          autocomplete="username"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          type="password"
          label="Password"
          autocomplete="current-password"
          required
        ></v-text-field>

        <v-btn color="success" class="mr-4" @click="login"> Login </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import AuthenticationService from "../service/AuthenticationService";
import store from "../store/store";
export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async login() {
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password,
        });
        store.dispatch("setToken", response.data.accessToken);
        store.dispatch("setUser", response.config.data);
        store.state.token = response.data.accessToken;
        store.dispatch("setisUserLoggedIn", true);
        console.log("store.state: ", store.state);
        console.log("response.token", store.state.token);
        this.$router.push("/photo");
      } catch (error) {
        alert("Khong the dang nhap!!!!");
      }
    },
  },
};
</script>

<style scoped>
.col-sm-8.col-md-4.col-12 {
  border: 1px solid #9e9e9e;
  margin-top: 100px;
   box-shadow: 0px 1px 3px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}
</style>
