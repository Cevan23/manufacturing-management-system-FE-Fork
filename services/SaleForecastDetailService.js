import * as http from "../utils/httpRequest";

// Author: Nguyen Cao Nhan
// Function to get sale forecast detail by ID
export const getSaleForecastDetail = async (token, sale_forecast_id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await http.get(`/api/sale_forecast_detail/${sale_forecast_id}`, config);
        return res;
    } catch (e) {
        console.log("Error at Get sale forecast detail: ", e);
    }
};

// Function to add sale forecast detail
export const addSaleForecastDetail = async (token, sid, pids, quantities) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const data = {
        sid,
        pids,
        quantities,
    }
    try {
        const res = await http.post(`/api/sale_forecast_detail/create`, data, config);
        return res;
    } catch (e) {
        console.log("Error at Add sale forecast detail: ", e);
    }
};

// Function to delete sale forecast detail
export const deleteSaleForecastDetail = async (token, pid, sid) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            pid: pid,
        },
    };
    try {
        const res = await http.del(`/api/sale_forecast_detail/${sid}`, config);
        return res;
    } catch (e) {
        console.log("Error at Delete sale forecast detail: ", e);
    }
};

// Function to update sale forecast detail
export const updateSaleForecastDetail = async (token, sid, pid, quantity, totalPrice, totalSalePrice) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const data = {
        sid,
        pid,
        quantity,
        totalPrice,
        totalSalePrice
    }
 
    try {
        const res = await http.put(`/api/sale_forecast_detail`, data, config);
        return res;
    } catch (e) {
        console.log("Error at Update sale forecast: ", e);
    }
};

// Function to get products associated with a sale forecast
export const getProductsForSaleForecast = async (token, sale_forecast_id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await http.get(`/api/products/forSaleDetail/${sale_forecast_id}`, config);
        return res;
    } catch (e) {
        console.log("Error at Get products: ", e);
    }
};
