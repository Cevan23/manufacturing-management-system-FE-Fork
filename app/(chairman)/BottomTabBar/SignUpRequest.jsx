import React, { useState, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "./stylesSignUp";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ToastMessage, AppLoader } from "../../../components";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { getSignUpRequest, acceptSignUpRequest, deleteUser } from "../../../services/UserServices";
import RNPickerSelect from "react-native-picker-select";

// SignUpRequest page
// Author: Pham Hien Nhan
const SignUpRequest = () => {
  const { userLogin, searchText, setSearchText } = useGlobalContext();
  const navigation = useNavigation();
  const [dataResponse, setDataResponse] = useState([]);
  const successToastRef = useRef(null);
  const errorToastRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [loading, setLoading] = useState(false);

  // Sign-up request Fetch Data reload
  // Author: Pham Hien Nhan
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Get all sign-up request from database
      // Author: Pham Hien Nhan
      const data = await getSignUpRequest(userLogin.id);
      if (data && data.data) {
        setDataResponse(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userLogin.id]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Navigate to SignUpDetail page
  // Author: Pham Hien Nhan
  const handleCardPress = (item) => {
    navigation.navigate("SignUpDetail", { data: item });
  };

  // Handle option role change for accepting sign-up request
  // Author: Pham Hien Nhan
  const handleOptionChange = (index, option) => {
    setSelectedOption((prev) => ({
      ...prev,
      [index]: option,
    }));
  };

  // Remove cards from the list
  // Author: Pham Hien Nhan
  const removeCard = (index) => {
    console.log("This card order: ", index);
    setDataResponse((prevData) => {
      const remainingData = prevData.filter((_, i) => i !== index);
      const updatedData = remainingData.map((item, i) => {
        item.index = i; // Assigning the index property
        return item;
      });
      console.log(
        "Updated card indices:",
        updatedData.map((item) => item.index)
      );
      return updatedData;
    });
  };

  // Handle deny sign-up request
  // Author: Pham Hien Nhan
  const handleDeny = async (index) => {
    try {
      // Handle delete sign-up request from database
      // Author: Pham Hien Nhan
      await deleteUser(dataResponse[index].id);
      if (successToastRef.current) {
        successToastRef.current.show({
          type: "success",
          text: "Deny signup request",
          description: "User has been denied.",
        });
      }
      removeCard(index);
      fetchData();
    } catch (error) {
      console.error(error);
      if (errorToastRef.current) {
        errorToastRef.current.show({
          type: "danger",
          text: "Error",
          description: "Failed to deny user.",
        });
      }
    }
  };

  // Accept sign-up request
  // Author: Pham Hien Nhan
  const handleAccept = async (index, option) => {
    if (!option) {
      if (errorToastRef.current) {
        errorToastRef.current.show({
          type: "danger",
          text: "Error",
          description: "Please select a role before accepting.",
        });
      }
      return;
    }
    try {
      // Handle accept sign-up request from database
      // Author: Pham Hien Nhan
      await acceptSignUpRequest(dataResponse[index].email, option);
      if (successToastRef.current) {
        successToastRef.current.show({
          type: "success",
          text: "Accept signup request",
          description: "User has been accepted.",
        });
      }
      setSelectedOption((prev) => ({
        ...prev,
        [index]: null,
      }));
      removeCard(index);
      fetchData();
    } catch (error) {
      console.error(error);
      if (errorToastRef.current) {
        errorToastRef.current.show({
          type: "danger",
          text: "Error",
          description: "Failed to accept user.",
        });
      }
    }
  };

  // Filter searched data by name
  // Author: Pham Hien Nhan
  const getFilteredData = () => {
    if (searchText.trim() === "") {
      return dataResponse;
    }
    return dataResponse.filter((item) =>
      item.fullName.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  return (
    <SafeAreaView className="bg-primary h-full">
      <View style={styles.container}>
        <ScrollView>
          {filteredData.map((item, index) => (
            <View style={styles.card} key={index}>
              <View style={styles.headerContainer}>
                <Text style={styles.header}>New employee</Text>
                <View style={styles.dropdownContainer}>
                  <RNPickerSelect
                    placeholder={{ label: "Select a role...", value: null }}
                    onValueChange={(option) =>
                      handleOptionChange(index, option)
                    }
                    items={[
                      { label: "Chairman", value: "CHAIRMAN" },
                      { label: "Accountant", value: "ACCOUNTANT" },
                      { label: "Product Manager", value: "PRODUCT_MANAGER" },
                    ]}
                    value={selectedOption[index]}
                  />
                </View>
              </View>

              <TouchableOpacity onPress={() => handleCardPress(item)}>
                <View style={styles.cardContentRow}>
                  <Text style={styles.title}>Fullname: {item.fullName}</Text>
                </View>
                <View style={styles.cardContentRow}>
                  <Text style={styles.title}>Email: {item.email}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.denyButton]}
                  onPress={() => handleDeny(index)}
                >
                  <Text style={styles.buttonText}>Deny</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => handleAccept(index, selectedOption[index])}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      {loading && <AppLoader />}

      <ToastMessage type="success" ref={successToastRef} />
      <ToastMessage type="danger" ref={errorToastRef} />
    </SafeAreaView>
  );
};

export default SignUpRequest;
