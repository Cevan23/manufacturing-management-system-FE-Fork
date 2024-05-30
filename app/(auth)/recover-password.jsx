import { useState, useRef } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Image } from "react-native";
import { images } from "../../constants";
import { CustomButton, FormField, ToastMessage } from "../../components";
import { recoverPasswordByEmail } from "../../services/LoginServices";
import CustomAlert from "../../components/CustomAlert";

// Recover password screen
// Author: Pham Hien Nhan
const RecoverPassword = () => {
  const [recoverResponse, setRecoverResponse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [alertMessage1, setAlertMessage1] = useState("");
  const [alertMessage2, setAlertMessage2] = useState("");

  const [isSubmitting, setSubmitting] = useState(false);
  const successToastRef = useRef(null);
  const errorToastRef = useRef(null);

  // Handle recover password via email
  // Author: Pham Hien Nhan
  async function handleRecoverPassword() {
    if (email === "") {
      setModalVisible(true);
      setErrorMessage("Please enter your email");
      setAlertMessage1("Close");
      setAlertMessage2("");
      return;
    }
    setSubmitting(true);

    try {
      // Check email is exist or not in database
      // Author: Pham Hien Nhan
      const recoverResponse = await recoverPasswordByEmail(email);
      if (!recoverResponse) {
        setModalVisible(true);
        setErrorMessage("Email is incorrect");
        setAlertMessage1("Try again");
        setAlertMessage2("Clear");
        setSubmitting(false);
        return;
      }

      if (successToastRef.current) {
        successToastRef.current.show({
          type: 'success',
          text: 'Recovery Password',
          description: 'Please check your email for the new recovery password.'
        });
      }

      setRecoverResponse(recoverResponse);
      setSubmitting(false);
    } 
    catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      setSubmitting(false);
    }
  };

  // Function to try again
  // Author: Pham Hien Nhan
  const handleTryAgain = () => {
    handleRecoverPassword();
    setModalVisible(false); 
  };

  // Function to clear email and password fields
  // Author: Pham Hien Nhan
  const handClear = () => {
    setEmail("");
    setModalVisible(false); 
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: 0,
          }}
        >
            <Image
                source={images.forgotPassword}
                resizeMode="cover"
                style={{ 
                    width: Dimensions.get("window").width-500, 
                    height: 250,
                }}
            />

            <Image
                source={images.logo}
                resizeMode="contain"
                style={{marginTop:10}}
                className="w-[130px] h-[84px]"
            />

          <Text className="text-2xl font-semibold text-white mt-2 font-psemibold">
            Forgot your password?
          </Text>

          <FormField
            title="Email"
            placeholder={"Please enter your email address"}
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-5"
            keyboardType="email-address"
            edit={true}
          />

          <CustomButton
            title="Recover Password"
            handlePress={handleRecoverPassword}
            containerStyles="mt-5"
            isLoading={isSubmitting}
            unpressable={false}
          />

          <View className="flex justify-center pt-1 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
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
        isSingleButton={email === "" ? true : false}
        onPressButton1={handleTryAgain}
        onPressButton2={handClear}
      />
    </SafeAreaView>
  );
};

export default RecoverPassword;
