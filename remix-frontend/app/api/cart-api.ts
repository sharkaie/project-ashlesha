import axios from "axios";
import { AddCartItem } from "~/types/cart";

const API_BASE_URL = "https://api.ashleshajewells.com/api/cart";

// Fetch all cart items for a session
export const GetCart = async (sessionId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${sessionId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, "Failed to fetch the cart");
    }
};

// Add items to the cart
export const addToCart = async (item: AddCartItem) => {
    try {
        console.log(item);
        const response = await axios.post(
            `${API_BASE_URL}`,
            item,

            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                },
            },
        );
        return response.data;
    } catch (error) {
        handleAxiosError(error, "Failed to add item to cart");
    }
};

// Remove all items from the cart for a session
export const removeCart = async (sessionId: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${sessionId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, "Failed to remove all items from the cart");
    }
};

// Remove a single item from the cart by ID
export const updateItemQty = async (
    sessionId: string,
    itemId: string,
    qty: number,
) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/${sessionId}/item/${itemId}`,
            { qty },
        );
        return response.data;
    } catch (error) {
        handleAxiosError(error, "Failed to update item qty from cart");
    }
};

// Remove a single item from the cart by ID
export const removeItemFromCart = async (sessionId: string, itemId: string) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/${sessionId}/item/${itemId}`,
        );
        return response.data;
    } catch (error) {
        handleAxiosError(error, "Failed to remove item from cart");
    }
};

// Get the cart count for a session
export const getCartCount = async (sessionId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${sessionId}/count`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, "Failed to fetch cart count");
    }
};

// Helper function to handle Axios errors
const handleAxiosError = (error: unknown, message: string): never => {
    if (axios.isAxiosError(error)) {
        // Axios-specific error
        console.error(`${message}:`, error.response?.data || error.message);
        throw new Error(
            `${message}: ${error.response?.data?.message || error.message}`,
        );
    } else {
        // Unknown error
        console.error(message, error);
        throw new Error(message);
    }
};
