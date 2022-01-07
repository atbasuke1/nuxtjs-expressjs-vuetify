<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="4">
      <v-form ref="form" lazy-validation @submit.prevent="">
        <v-toolbar-title class="font-weight-light">
          <b>Login</b>
        </v-toolbar-title>
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
        <div class="signup-buttons">
          <div id="fb-root"></div>
          <a
            href="#"
            class="facebook-signup"
            @click.prevent="loginWithFacebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#3578E5"
            >
              <path
                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
              />
            </svg>
            Login with Facebook
          </a>
        </div>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import facebookLogin from "facebook-login-vuejs";
import AuthenticationService from "../service/AuthenticationService";
import store from "../store/store";
import { initFbsdk } from "../service/init-facebook-sdk";
export default {
  components: {
    facebookLogin,
  },
  data() {
    return {
      email: "",
      password: "",
      error: null,
      isConnected: false,
      name: "",
      personalID: "",
      picture: "",
      FB: undefined,
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
        this.isConnected = true;
        store.commit('setIsUserLoggedIn', this.isConnected)
        console.log("islogin",this.isConnected)
        console.log("store.state: ", store.state);
        this.$router.push("/photo");
      } catch (error) {
        alert("Khong the dang nhap!!!!");
      }
    },
    loginWithFacebook() {
      window.FB.login((response) => {
        if (response && response.authResponse) {
          console.log("response", response.authResponse);
          var userInfo = {
            loginType: "fb",
            fb: {
              auth: response.authResponse,
            },
          };
          store.commit("setLoginUser", userInfo);
          window.FB.api(
            "/me",
            "GET",
            { fields: "id,name,email,picture" },
            (user) => {
              this.personalID = user.id;
              this.email = user.email;
              this.name = user.name;
              this.picture = user.picture.data.url;
              store.commit("setLoginUser", user);
              console.log(user);
              try {
                const response = AuthenticationService.register({
                  email: this.email,
                  password: this.email,
                });
              } catch {
                console.log("can't register!");
              }
            }
          );
          window.FB.api(
            `/${response.authResponse.userID}`,
            (userResponse) => {
              if (userResponse) {
                console.log(userResponse);
                var userInfo = {
                  loginType: "fb",
                  fb: {
                    auth: response.authResponse,
                    user: userResponse,
                  },
                };
                this.isConnected = true;
                store.commit("setIsUserLoggedIn", this.isConnected);
                // store.commit("setLoginUser", userInfo);
                store.commit("setUser", userInfo.fb.user.name);
                this.$router.push("/photo");
              }
            },
            this.params
          );
        }
      }, this.params);
    },
  },
  mounted() {
    initFbsdk();
  },
  mutations:{
      
  }
};
</script>

<style scoped>

.col-sm-8.col-md-4.col-12 {
  border: 1px solid #9e9e9e;
  margin-top: 100px;
  box-shadow: 0px 1px 3px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}

.signup-buttons {
  margin-top: 15px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  position: relative;
}
</style>
