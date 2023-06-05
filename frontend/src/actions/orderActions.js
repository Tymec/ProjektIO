import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,

    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,

    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,

    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,

    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,

    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
} from '../constants/orderConstants'

import { CART_CLEAR_ITEMS } from '../constants/cartConstants'


export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({type: ORDER_CREATE_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/orders/add/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
            body: JSON.stringify(order)
        })
        .then(async res => {
            const data = await res.json();
            dispatch({type: ORDER_CREATE_SUCCESS, payload: data})
            dispatch({type: CART_CLEAR_ITEMS, payload: data})
            localStorage.removeItem('cartItems')
        });
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({type: ORDER_DETAILS_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/orders/${id}/`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        .then(async res => dispatch({ type: ORDER_DETAILS_SUCCESS, payload: await res.json() }));
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const payOrder = (id, paymentResult) => async (dispatch, getState) => {
    try {
        dispatch({type: ORDER_PAY_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/orders/${id}/pay/`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
            body: JSON.stringify(paymentResult)
        })
        .then(async res => dispatch({ type: ORDER_PAY_SUCCESS, payload: await res.json() }));
    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const deliverOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({type: ORDER_DELIVER_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/orders/${order._id}/deliver/`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        .then(async res => dispatch({ type: ORDER_DELIVER_SUCCESS, payload: await res.json() }));
    } catch (error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}



export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({type: ORDER_LIST_MY_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/orders/me/`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        .then(async res => dispatch({ type: ORDER_LIST_MY_SUCCESS, payload: await res.json() }));
    } catch (error) {
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const listOrders = () => async (dispatch, getState) => {
    try {
        dispatch({type: ORDER_LIST_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/orders/`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        .then(async res => dispatch({ type: ORDER_LIST_SUCCESS, payload: await res.json() }));
    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
