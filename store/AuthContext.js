import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect } from "react";

// Create an AuthContext with default values
// Author: Pham Van Cao
export const AuthContext = createContext({
    token: "",
    isAuthenticated: false,
    authenticate: async (token) => { },
    logout: () => { },
});

// AuthContextProvider component to provide authentication state and functions
const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState("");

    // useEffect to retrieve token from AsyncStorage when the component mounts
    useEffect(() => {
        async function getToken() {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                console.log("Token retrieved: ", storedToken); // Log retrieved token
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                console.log("Couldn't get token from local storage: ", error);
            }
        }

        getToken();
    }, []);

    // Function to authenticate and store the token
    async function authenticate(token) {
        setToken(token);
        try {
            await AsyncStorage.setItem("token", token);
            console.log("Token stored: ", token);
        } catch (error) {
            console.log("Couldn't set token to local storage: ", error);
        }
    }

    // Function to logout and remove the token
    async function logout() {
        setToken("");
        try {
            await AsyncStorage.removeItem("token");
        } catch (error) {
            console.log("Couldn't remove token from local storage: ", error);
        }
    }

    // Value object to be provided by AuthContext
    const value = {
        token: token,
        isAuthenticated: !!token,
        logout,
        authenticate,
    };

    // Provide AuthContext to children components
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
