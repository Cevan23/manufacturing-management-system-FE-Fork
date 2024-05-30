import * as http from "../utils/httpRequest";

// Author: Pham Van Cao
// Creates a new work order
export const creatWorkOrder = async (token, req) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.post("/api/WorkOrder/createWorkOrder", req, config);
        return res;
    } catch (e) {
        console.log("Error at WorkOrder Service: ", e);
    }
}

// Updates an existing work order
export const updateWorkOrder = async (token, req) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.put("/api/WorkOrder/updateWorkOrder", req, config);
        return res;
    } catch (e) {
        console.log("Error at WorkOrder Service: ", e);
    }
}

// Deletes a work order by ID
export const deleteWorkOrder = async (token, workOrderID) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.del(`/api/WorkOrder/deleteWorkOrder/${workOrderID}`, config);
        return res;
    } catch (e) {
        console.log("Error at WorkOrder Service: ", e);
    }
}

// Retrieves all work orders
export const getAllWorkOrders = async (token) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.get("/api/WorkOrder/getAllWorkOrders", config);
        return res;
    } catch (e) {
        console.log("Error at WorkOrder Service: ", e);
    }
}

// Retrieves all work orders of a specific PM
export const getAllWorkOrdersOfPM = async (token, pmID) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            params: { pmID }
        };
        const res = await http.get(`/api/WorkOrder/getAllWorkOrdersOfPM`, config);
        return res;
    } catch (e) {
        console.log("Error at WorkOrder Service: ", e);
    }
}

// Retrieves a work order details of a specific PM
export const getWorkOrderDetail = async (token, workOrderID) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.get(`/api/WorkOrder/getDetailAboutWorkOrder/${workOrderID}`, config);
        return res;
    }
    catch (e) {
        console.log("Error at WorkOrder Service: ", e);
    }
}

// Retrieves all work orders starting today
export const getWorkOrderToday = async (token) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.get(`/api/WorkOrder/getAllWorkOrdersStartingToday`, config);
        return res;
    }
    catch (e) {
        console.log("Error at WorkOrder Service: ", e);
    }
}