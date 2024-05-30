import * as http from "../utils/httpRequest";

// Author: Pham Hien Nhan
// Function to login with email and password
export const login = async (email, password) => {
    try {
        const res = await http.post(
            "/api/auth/login",
            {
                email,
                password,
            },
            { withCredentials: true } // Include credentials in the request
        );
        return res;
    } catch (e) {
        console.log("Error at Login Service: ", e);
    }
};

// Function to sign up or insert a new user
export const signUpOrInsertUser = async (fullName, email, password, dateOfBirth, phoneNumber, address, roleName) => {
    try {
        const res = await http.post(
            "/api/auth/create",
            {
                fullName,
                email,
                password,
                dateOfBirth,
                phoneNumber,
                address,
                roleName
            }
        );
        return res;
    } catch (e) {
        console.log("Error at Sign Up in Login Service: ", e);
    }
};

// Function to get user information by ID
export const getUserInformationById = async (token, id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await http.get(
            `/api/users/getUserInformationById/${id}`,
            config
        );
        return res;
    } catch (e) {
        console.log("Error at Get user information: ", e);
    }
};

// Function to recover password by email
export const recoverPasswordByEmail = async (email) => {
    try {
        const res = await http.put(
            "/api/auth/recover-password",
            {
                email,
            }
        );
        return res;
    } catch (e) {
        console.log("Cannot recover password at Login Service: ", e);
    }
};
