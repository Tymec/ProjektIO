import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_LOGOUT,

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,

    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_RESET,

    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,

    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_LIST_RESET,

    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,

    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,

} from '../constants/userConstants'

import { ORDER_LIST_MY_RESET } from '../constants/orderConstants'

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({type: USER_LOGIN_REQUEST})

        fetch(`/api/users/login/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        })
        .then(async res => {
            const data = await res.json();
            dispatch({type: USER_LOGIN_SUCCESS, payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data))
        });
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({ type: USER_LOGOUT })
    dispatch({ type: USER_DETAILS_RESET })
    dispatch({ type: ORDER_LIST_MY_RESET })
    dispatch({ type: USER_LIST_RESET })
}


export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({type: USER_REGISTER_REQUEST})

        fetch(`/api/users/register/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ 'name': name, 'email': email, 'password': password })
        })
        .then(async res => {
            const data = await res.json();
            dispatch({type: USER_REGISTER_SUCCESS, payload: data})
            dispatch({type: USER_LOGIN_SUCCESS, payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data))
        });
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({type: USER_DETAILS_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/users/${id}/`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        })
        .then(async res => dispatch({type: USER_DETAILS_SUCCESS, payload: await res.json()}));
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch({type: USER_UPDATE_PROFILE_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/users/`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
            body: JSON.stringify(user)
        })
        .then(async res => {
            const data = await res.json();
            dispatch({type: USER_UPDATE_PROFILE_SUCCESS, payload: data})
            dispatch({type: USER_LOGIN_SUCCESS, payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data))
        });
    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch({type: USER_LIST_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/users/`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        })
        .then(async res => dispatch({type: USER_LIST_SUCCESS, payload: await res.json()}));
    } catch (error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({type: USER_DELETE_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/users/delete/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        })
        .then(async res => dispatch({type: USER_DELETE_SUCCESS, payload: await res.json()}));
    } catch (error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const updateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({type: USER_UPDATE_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/users/${user._id}/`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
            body: JSON.stringify(user)
        })
        .then(async res => {
            const data = await res.json();
            dispatch({type: USER_UPDATE_SUCCESS})
            dispatch({type: USER_DETAILS_SUCCESS, payload: data})
        });
    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
