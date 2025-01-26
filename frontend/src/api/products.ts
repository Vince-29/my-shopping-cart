//API Endpoints
import axios from "axios"

const API_URL = "http://localhost:3000/api"

export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`)
    return response.data
}

export const getProductById = async (id: string) => {
    const response = await axios.get(`${API_URL}/products/${id}`)
    return response.data
}

export const createOrder = async (items: Array<{ product_id: number, quantity: number }>) => {
    const response = await axios.post(`${API_URL}/orders`, { items })
    return response.data
}