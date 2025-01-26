
import axios from "axios"

const API_URL = "http://localhost:3000/api"

export const getOrders = async () => {
    const response = await axios.get(`${API_URL}/orders`)
    return response.data

    if (response.data.length > 0) {
        console.log("May laman")
    }
}