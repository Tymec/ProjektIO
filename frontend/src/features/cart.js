import { createSlice } from '@reduxjs/toolkit'

const getFromLocalStorage = (key, def = '') => {
    const value = localStorage.getItem(key)
    if (value) {
        return JSON.parse(value)
    }
    return def
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: getFromLocalStorage('cartItems', []),
        shippingAddress: getFromLocalStorage('shippingAddress', {}),
        paymentMethod: getFromLocalStorage('paymentMethod', ''),
    },
    reducers: {
        addToCart: (state, action) => {
            const { qty, id, increment = false } = action.payload

            const existItem = state.items.find(x => x.id === id)
            if (existItem) {
                state.items = state.items.map(x => {
                    let item = x
                    if (x.id === existItem.id) {
                        item = increment ? {id, qty: x.qty + 1} : {id, qty}
                    }
                    return item
                })
            } else {
                state.items.push({id, qty})
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items))
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(x => x.id !== action.payload)
            localStorage.setItem('cartItems', JSON.stringify(state.items))
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload
            localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress))
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
            localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod))
        },
        resetCart: (state) => {
            state.items = []
            state.shippingAddress = {}
            state.paymentMethod = ''
            localStorage.removeItem('cartItems')
            localStorage.removeItem('shippingAddress')
            localStorage.removeItem('paymentMethod')
        }
    },
})

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, resetCart } = cartSlice.actions
