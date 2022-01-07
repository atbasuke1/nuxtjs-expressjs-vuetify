import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { setStore, getStore } from '../service/utils'

Vue.use(Vuex)
const user = getStore('user')
export default new Vuex.Store({
  plugins: [
    createPersistedState()
  ],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    loginUser: user
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setUser (state, user) {
      state.user = user
    },
    setIsUserLoggedIn (state, isUserLoggedIn) {
      state.isUserLoggedIn = isUserLoggedIn
    },
    setLoginUser(state, user) {
      state.loginUser = user
      setStore('user', user)
    }
  },
  actions: {
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    setUser ({commit}, user) {
      commit('setUser', user)
    },
    setIsUserLoggedIn ({commit}, isUserLoggedIn) {
      commit('setIsUserLoggedIn', isUserLoggedIn)
    }

    }
})
