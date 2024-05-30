import { useState, useRef } from "react";
import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Image } from "react-native";
import { useGlobalContext } from '../../../context/GlobalProvider';
import { images } from "../../../constants";
import { CustomButton, FormField, ToastMessage } from "../../../components";
import CustomAlert from "../../../components/CustomAlert";
import { useNavigation } from '@react-navigation/native';
import { resetPassword } from "../../../services/UserServices";

const ResetPassword = () => {
  const navigation = useNavigation();
  const { setUser, passwordLogin, userLogin, setPasswordLogin } = useGlobalContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [alertMessage1, setAlertMessage1] = useState("");
  const [alertMessage2, setAlertMessage2] = useState("");

  const [isSubmitting, setSubmitting] = useState(false);
  const successToastRef = useRef(null);
  const errorToastRef = useRef(null);

  // Handle check valid password
  // Author: Pham Hien Nhan
  const submit = async () => {
    if (currentPassword === "" || newPassword === "") {
      setModalVisible(true);
      setErrorMessage("Please fill in all fields");
      setAlertMessage1("Close");
      setAlertMessage2("");
      return;
    }
  
    setSubmitting(true);

    if (!(currentPassword === passwordLogin)){
      setModalVisible(true);
      setErrorMessage("Password is incorrect");
      setAlertMessage1("Try again");
      setAlertMessage2("");
      setCurrentPassword("");
      setNewPassword("");
      setSubmitting(false);
      return;
    }
    else {
      handleResetPassword();
    }
  };

  // Handle allow reset password
  // Author: Pham Hien Nhan
  async function handleResetPassword() {
    const updatedPassword = await resetPassword(
      userLogin.id,
      newPassword
    );
    setUser(updatedPassword);
    setPasswordLogin(newPassword);

    if (successToastRef.current) {
      successToastRef.current.show({
        type: 'success',
        text: 'Reset Password',
        description: 'Your password has been reset.'
      });
    }

    setCurrentPassword("");
    setNewPassword("");
    setSubmitting(false);
    setTimeout(() => {
      navigation.goBack();
    }, 3500);
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4"
          style={{
            minHeight: 0,
          }}
        >
            <Image
                source={images.forgotPassword}
                resizeMode="cover"
                style={{ 
                    width: Dimensions.get("window").width-500, 
                    height: 200,
                }}
            />

            <Image
                source={images.logo}
                resizeMode="contain"
                style={{marginTop:5}}
                className="w-[130px] h-[84px]"
            />

          <Text className="text-2xl font-semibold text-white mt-2 font-psemibold">
            Reset your password
          </Text>

          <FormField
            title="Current password"
            placeholder={"●●●●●●●●"}
            value={currentPassword}
            handleChangeText={setCurrentPassword}
            otherStyles="mt-3"
            edit={true}
          />

          <FormField
            title="New password"
            placeholder={"●●●●●●●●"}
            value={newPassword}
            handleChangeText={setNewPassword}
            otherStyles="mt-3"
            edit={true}
          />

          <CustomButton
            title="Reset Password"
            handlePress={submit}
            containerStyles="mt-3"
            isLoading={isSubmitting}
            unpressable={false}
          />
        </View>
      </ScrollView>

      <ToastMessage type={"success"} ref={successToastRef}></ToastMessage>
    
      <ToastMessage type="danger" ref={errorToastRef}/>

      <CustomAlert
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="Error"
        error={errorMessage}
        message1={alertMessage1}
        message2={alertMessage2}
        isSingleButton={currentPassword === "" || newPassword === ""  ? true : false}
      />
    </SafeAreaView>
  );
};

export default ResetPassword;
