import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
        shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
        paymentMethod: localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : '',
    },
    reducers: {
        addToCart: (state, action) => {
            const item = {
                quantity: action.payload.qty,
                id: action.payload.product,
            }
            const existItem = state.cartItems.find(x => x.product === item.product)
            if (existItem) {
                existItem.qty += item.qty
            } else {
                state.cartItems.push(item)
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(x => x.product !== action.payload)
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload
            localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress))
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
            localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod))
        },
        resetCart: (state, action) => {
            state.cartItems = []
            state.shippingAddress = {}
            state.paymentMethod = ''
            localStorage.removeItem('cartItems')
            localStorage.removeItem('shippingAddress')
            localStorage.removeItem('paymentMethod')
        }
    },
})

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, resetCart } = cartSlice.actions
