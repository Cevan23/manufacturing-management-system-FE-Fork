import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";

// Author: Nguyen Cao Nhan
// Create a context to manage global state
const GlobalContext = createContext();

// Custom hook to consume the global context
export const useGlobalContext = () => useContext(GlobalContext);

// Provider component to wrap the application and manage global state
const GlobalProvider = ({ children }) => {
  // State variables to manage different aspects of global state
  const [isLogged, setIsLogged] = useState(false); // Flag to indicate if the user is logged in
  const [user, setUser] = useState(null); // Information about the logged-in user
  const [loading, setLoading] = useState(true); // Flag to indicate if data is being loaded
  const [userLogin, setUserLogin] = useState(null); // User login information
  const [token, setToken] = useState(""); // Authentication token
  const [userId, setUserId] = useState(""); // User ID
  const [passwordLogin, setPasswordLogin] = useState(""); // Password for login
  const [searchText, setSearchText] = useState(""); // Text used for searching

  // Effect to fetch the current user's information when the component mounts
  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          // If user data is returned, set the user as logged in and update user information
          setIsLogged(true);
          setUser(res);
        } else {
          // If no user data is returned, set the user as logged out and clear user information
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error); // Log any errors that occur during user data fetching
      })
      .finally(() => {
        setLoading(false); // Set loading to false when data fetching is complete
      });
  }, []);

  // Provide the global state and setter functions to child components
  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        userLogin,
        setUserLogin,
        token,
        setToken,
        userId,
        setUserId,
        passwordLogin,
        setPasswordLogin,
        searchText,
        setSearchText,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
