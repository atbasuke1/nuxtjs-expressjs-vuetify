import axios from 'axios'
import store from '../store/store'

export default () => {
    const ajax =  axios.create({
    baseURL: `http://localhost:8081`,
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  })
  return ajax
}
