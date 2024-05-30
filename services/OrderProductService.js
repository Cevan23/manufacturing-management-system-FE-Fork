import * as http from "../utils/httpRequest";

// Author: Nguyen Cao Nhan
// Function to get order product detail by ID
export const getOrderProductDetail = async (token, order_id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await http.get(`/api/order_product_detail/${order_id}`, config);
        return res;
    } catch (e) {
        console.log("Error at Get order product detail: ", e);
    }
};

// Function to add order product detail
export const addOrderProductDetail = async (token, oid, pids, quantities) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const data = {
        oid,
        pids,
        quantities,
    }
    try {
        const res = await http.post(`/api/order_product_detail/create`, data, config);
        return res;
    } catch (e) {
        console.log("Error at Add order product detail: ", e);
    }
};

// Function to delete order product detail
export const deleteOrderProductDetail = async (token, oid, pid) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            pid: pid,
        },
    };
    try {
        const res = await http.del(`/api/order_product_detail/${oid}`, config);
        return res;
    } catch (e) {
        console.log("Error at Delete order product detail: ", e);
    }
};

// Function to update order product detail
export const updateOrderProductDetail = async (token, oid, pid, quantity) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const data = {
        oid,
        pid,
        quantity,
    }

    try {
        const res = await http.put(`/api/order_product_detail`, data, config);
        return res;
    } catch (e) {
        console.log("Error at Update order product detail: ", e);
    }
};

// Function to get products associated with an order product
export const getProductsForOrderProduct = async (token, oid) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await http.get(`/api/products/forOrderProduct/${oid}`, config);
        return res;
    } catch (e) {
        console.log("Error at Get products: ", e);
    }
};
