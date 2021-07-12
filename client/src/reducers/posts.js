import { FETCH_ALL, UPDATE, DELETE, CREATE, FETCH_USER } from '../constants/actionTypes';

// eslint-disable-next-line import/no-anonymous-default-export
export default (posts = [], action) => {
    switch (action.type) {
        case DELETE:
            // console.log("action posts", posts)
            return posts.filter((post) => post.id !== action.payload);
        case UPDATE:
            return posts.map((post) => post.id === action.payload.id ? action.payload : post);
        case FETCH_ALL:
        case FETCH_USER:
            return action.payload;
        case CREATE:
            return [...posts, action.payload];
        default:
            return posts;
    }
}