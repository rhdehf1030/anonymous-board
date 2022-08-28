import axios from 'axios'
import post from './post'
import postComment from './post-comment'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/'
})

export const api = {
  post,
  postComment
}
