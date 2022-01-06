<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="4">
      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="">
        <v-toolbar-title class="font-weight-light"> <b>Register</b> </v-toolbar-title>
        <v-text-field
          v-model="name"
          type="text"
          label="Name"
          autocomplete="name"
          required
        ></v-text-field>

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

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="register"
        >
          Create Account
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import AuthenticationService from "../service/AuthenticationService";
export default {
  data: () => ({
    valid: true,
    name: "",
    password: "",
    email: "",
    errorMessage: "",
  }),
  methods: {
    async register() {
      try {
        const response = await AuthenticationService.register({
          email: this.email,
          password: this.password,
        });
        console.log("response", response);
         this.$router.push("/");
      } catch (error) {
        this.error = error.response.data.error;
      }
    },
  },
};
</script>

<style scoped>
.col-sm-8.col-md-4.col-12 {
  border: 1px solid #9e9e9e;
  margin-top: 120px;
   box-shadow: 0px 1px 3px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}
</style>
