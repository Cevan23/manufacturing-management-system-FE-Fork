import * as http from "../utils/httpRequest";

// Author: Nguyen Cao Nhan
// Function to get order material detail by ID
export const getOrderMaterialDetail = async (token, order_id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await http.get(`/api/order_material_detail/${order_id}`, config);
        return res;
    } catch (e) {
        console.log("Error at Get order material detail: ", e);
    }
};

// Function to add order material detail
export const addOrderMaterialDetail = async (token, oid, mids, quantities) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const data = {
        oid,
        mids,
        quantities,
    }
    try {
        const res = await http.post(`/api/order_material_detail/create`, data, config);
        return res;
    } catch (e) {
        console.log("Error at Add order material detail: ", e);
    }
};

// Function to delete order material detail
export const deleteOrderMaterialDetail = async (token, oid, mid) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            mid: mid,
        },
    };
    try {
        const res = await http.del(`/api/order_material_detail/${oid}`, config);
        return res;
    } catch (e) {
        console.log("Error at Delete order material detail: ", e);
    }
};

// Function to update order material detail
export const updateOrderMaterialDetail = async (token, oid, mid, quantity) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const data = {
        oid,
        mid,
        quantity,
    }

    try {
        const res = await http.put(`/api/order_material_detail`, data, config);
        return res;
    } catch (e) {
        console.log("Error at Update order material detail: ", e);
    }
};

// Function to get materials associated with an order material
export const getMaterialForOrderMaterial = async (token, oid) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await http.get(`/api/material/forOrderMaterial/${oid}`, config);
        return res;
    } catch (e) {
        console.log("Error at Get material: ", e);
    }
};
