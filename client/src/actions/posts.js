import { FETCH_ALL, CREATE, DELETE, UPDATE, FETCH_USER } from '../constants/actionTypes';
import * as api from '../api';

// Action Creators
export const getCards = () => async (dispatch) => {
    try {
        const { data } = await api.fetchCards();

        dispatch({ type: FETCH_ALL, payload: data });
    } catch (error) {
        console.log(error.message);
    }
}

export const getUserCards = () => async (dispatch) => {
    try {
        const { data } = await api.fetchUserCards();

        dispatch({ type: FETCH_USER, payload: data })
    } catch (error) {
        console.log(error.message);
    }
}

export const createCard = (post) => async (dispatch) => {
    try {
        // console.log('post', post.selectedFile)
        // const formData = new FormData();
        // formData.append("photo", post.selectedFile);
        // console.log("formData", formData)
        // try {
        //     const res = await api.upload("/upload",post);
        //           console.log("res.location", res.location);
        //         } catch (ex) {
        //           console.log(ex);
        //         }
        // const { data } = await api.createCard(post);
        // console.log("createCard", data)
        // dispatch({ type: CREATE, payload: data});
    } catch (error) {
        console.log(error);
    }
}

export const updateCard = (id, post) => async (dispatch) => {
    try {
        const { data } = await api.updateCard(id, post);

        dispatch({type: UPDATE, payload: data});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteCard = (id) => async (dispatch) => {
    try {
        await api.deleteCard(id); // 여기서는 const 변수를 쓸 필요가 없다.(삭제이기때문에 반환데이터는 필요없음)
        dispatch({ type: DELETE, payload: id });
    } catch (error) {
        console.log(error);
    }
}

export const lockCard = (id) => async (dispatch) => {
    try {
        const { data } = await api.lockCard(id);
        dispatch({type: UPDATE, payload: data});
    } catch (error) {
        console.log(error.message);
    }
}