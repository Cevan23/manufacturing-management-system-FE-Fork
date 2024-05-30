import * as http from "../utils/httpRequest";

// Author: Pham Van Cao
// Function to get all products
export const getAllProduct = async (token) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.get("/api/products/all", config);
        return res;
    } catch (e) {
        console.log("Error at Product Service: ", e);
    }
}