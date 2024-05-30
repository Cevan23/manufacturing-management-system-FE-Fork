import * as http from "../utils/httpRequest";

// Author: Nguyen Cao Nhan
// Function to get sales forecast report for a specific month
export const getReportMonth = async (token, month, year) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await http.get(`/api/sale_forecasts/month/${month}/${year}`, config);
        return res;
    } catch (e) {
        console.log("Error at Get sale forecast report: ", e);
    }
};

// Function to get sales forecast report for a specific year
export const getReportYear = async (token, year) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await http.get(`/api/sale_forecasts/year/${year}`, config);
        return res;
    } catch (e) {
        console.log("Error at Get sale forecast report: ", e);
    }
};
