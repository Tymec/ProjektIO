import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,

    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,

    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,

    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,

    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,

    PRODUCT_ORDER_BY_DATE

} from '../constants/productConstants'


export const listProducts = (keyword = '', page = 1, orderBy = PRODUCT_ORDER_BY_DATE, orderAsc = false) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_LIST_REQUEST })

        fetch("/api/products/?" + new URLSearchParams({
            search: keyword,
            ordering: `${orderAsc ? '' : '-'}${orderBy}`,
            page: page
        }))
        .then(async res => dispatch({ type: PRODUCT_LIST_SUCCESS, payload: await res.json() }));
    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })

        fetch(`/api/products/${id}`)
        .then(async res => dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: await res.json() }));
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({type: PRODUCT_DELETE_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/products/delete/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        .then(async res => dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: await res.json() }));
    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}




export const createProduct = () => async (dispatch, getState) => {
    try {
        dispatch({type: PRODUCT_CREATE_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/products/create/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        .then(async res => dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: await res.json() }));
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}



export const updateProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({type: PRODUCT_UPDATE_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/products/update/${product._id}/`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
            body: JSON.stringify(product)
        })
        .then(async res => {
            const data = await res.json();
            dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data })
            dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data })
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createProductReview = (productId, review) => async (dispatch, getState) => {
    try {
        dispatch({type: PRODUCT_CREATE_REVIEW_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState()

        fetch(`/api/products/${productId}/reviews/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
            body: JSON.stringify(review)
        })
        .then(async res => dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS, payload: await res.json() }));
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
