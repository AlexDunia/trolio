// Placeholder ProfileService to be used later for API calls
import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/',
})

export default {
  async fetchProfile(id) {
    try {
      // placeholder - endpoint not implemented yet
      const res = await API.get(`/profiles/${id}`)
      return res.data
    } catch (err) {
      console.error('ProfileService.fetchProfile error', err)
      throw err
    }
  },
}
