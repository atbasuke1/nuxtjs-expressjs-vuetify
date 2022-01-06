import Api from '../service/API'

export default {
  register(credentials) {
    return Api().post('register', credentials)
  },
  login(credentials) {
    return Api().post('login', credentials)
  },
  logout(credentials) {
    return Api().post('logout', credentials)
  },
  files(credentials){
    return Api().get('upload',credentials)
  },
  photo(credentials){
    return Api().delete('many',credentials)
  },
  delete(credentials){
    return Api().delete('photos',credentials)
  },
  update(credentials){
    return Api().post('update',credentials)
  },
  facebook(credentials){
    return Api().get('auth/facebook',credentials)
  },
  
}
