import axios from "axios";

// Author: Pham Van Cao
// Base URL for the API
const BASE_URL = "http://172.0.0.159:8082";

// Create an Axios instance with the base URL
const httpRequest = axios.create({
    baseURL: `${BASE_URL}`,
});

// Function to make a GET request
export const get = async (path, config = {}) => {
    const response = await httpRequest.get(path, config);
    return response.data;
};

// Function to make a POST request
export const post = async (path, data, config = {}) => {
    const response = await httpRequest.post(path, data, config);
    return response.data;
};

// Function to make a PUT request
export const put = async (path, data, config = {}) => {
    const response = await httpRequest.put(path, data, config);
    return response.data;
};

// Function to make a DELETE request
export const del = async (path, config = {}) => {
    const response = await httpRequest.delete(path, config);
    return response.data;
};

// Function to make a PATCH request
export const patch = async (path, data, config = {}) => {
    const response = await httpRequest.patch(path, data, config);
    return response.data;
};

// Export the Axios instance for other modules to use
export default httpRequest;
