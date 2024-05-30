import * as http from "../utils/httpRequest";

// Author: Pham Van Cao
// Retrieves all MPS records.
export const getAllMPS = async (token) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.get("/api/MPS/getAll", config);
        return res;
    } catch (e) {
        console.log("Error at MPS Service: ", e);
    }
};

// Retrieves all MPS records associated with a particular project manager (PM)
export const getAllMPSofPM = async (token, id) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.get(`/api/MPS/getAllMPSofPM/${id}`, config);
        return res;
    } catch (e) {
        console.log("Error at MPS Service: ", e);
    }
}

// Retrieves a specific MPS record by its ID
export const getMPSByID = async (token, mpsID) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.get(`/api/MPS/getById/${mpsID}`, config);
        return res;
    } catch (e) {
        console.log("Error at MPS Service: ", e);
    }
}

// Creates a new MPS record
export const createMPS = async (token, data) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.post("/api/MPS/createMPS", data, config);
        return res;
    } catch (e) {
        console.log("Error at MPS Service: ", e);
    }
};

// Updates an existing MPS record
export const updateMPS = async (token, data) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.put(`/api/MPS/updateMPS`, data, config);
        return res;
    } catch (e) {
        console.log("Error at MPS Service: ", e);
    }
}

// Deletes an MPS record
export const deleteMPS = async (token, mpsID) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await http.del(`/api/MPS/deleteMPS/${mpsID}`, config);
        return res;
    } catch (e) {
        console.log("Error at MPS Service: ", e);
    }
}
