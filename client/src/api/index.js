// src/api/index.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  return req;
});

// Posts API
export const fetchPosts = () => API.get('/posts'); // Fetch all posts
export const createPost = (newPost) => API.post('/posts', newPost); // Create a new post
export const likePost = (id) => API.patch(`/posts/${id}/likePost`); // Like a post
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost); // Update a post
export const deletePost = (id) => API.delete(`/posts/${id}`); // Delete a post

// Auth API
export const signIn = (formData) => API.post('/user/signin', formData); // Sign in user
export const signUp = (formData) => API.post('/user/signup', formData); // Sign up user
