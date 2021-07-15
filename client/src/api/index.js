import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000' });

API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    
    return req;
});

export const fetchCards = () => API.get('/cards');
export const fetchUserCards = () => API.get('/cards/user');
export const createCard = (newPost) => API.post('/cards', newPost);
export const updateCard = (id, updatedPost) => API.patch(`/cards/${id}`, updatedPost);
export const lockCard = (id) => API.patch(`/cards/${id}/locked`);
export const deleteCard = (id) => API.delete(`/cards/${id}`);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);