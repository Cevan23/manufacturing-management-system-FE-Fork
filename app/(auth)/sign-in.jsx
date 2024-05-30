import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions , Image } from "react-native";
import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { login,getUserInformationById } from "../../services/LoginServices"; 
import { decodeJwtMiddleware } from '../../middleware/decode';
import CustomAlert from "../../components/CustomAlert";

// Sign-in screen
// Author: Pham Hien Nhan
const SignIn = () => {
  const { setUser, setIsLogged, setUserLogin, setToken, setUserId, setPasswordLogin } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginResponse, setLoginResponse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertMessage1, setAlertMessage1] = useState("");
  const [alertMessage2, setAlertMessage2] = useState("");

  // Handle change email 
  // Author: Pham Hien Nhan
  function handleChangeEmail(email) {
    setEmail(email);
  }

  // Handle change password
  // Author: Pham Hien Nhan
  function handleChangePassword(password) {
    setPassword(password);
  }

  // Handle check login
  // Author: Pham Hien Nhan
  async function handleLogin() {
    if (email === "" || password === "") {
      setModalVisible(true);
      setErrorMessage("Please fill in all fields");
      setAlertMessage1("Close");
      setAlertMessage2("");
      return;
    }
    setSubmitting(true);
    setPasswordLogin(password);

    try {
      // Check login 
      // Author: Pham Van Cao
      const loginResponse = await login(email, password); 
      if (!loginResponse) {
        setModalVisible(true);
        setErrorMessage("Password or email is incorrect");
        setAlertMessage1("Try again");
        setAlertMessage2("Clear");
        setSubmitting(false);
        return;
      }
      setLoginResponse(loginResponse);
      setEmail("");
      setPassword("");
      const authObj = loginResponse.result;
      const token = authObj.token;
      setToken(token);
      
      // Get user information by id 
      // Author: Pham Van Cao
      const userLogin = await getUserInformationById(authObj.token, authObj.id);
      setUser(userLogin);
      setIsLogged(true);

      // Token decryption
      // Author: Pham Van Cao
      const decodedToken = await decodeJwtMiddleware(authObj.token);
      setUserId(decodedToken.userId);
      console.log("Decoded Token: ", decodedToken.userId); 

      // Redirect to home page based on role
      // Author: Nguyen Cao Nhan
      if (decodedToken.role === 'PRODUCT_MANAGER') {
        setSubmitting(false);
        setUserLogin(userLogin.result);
        router.push("/ProductManagerHome");
      } else if (decodedToken.role === 'CHAIRMAN') {
        setSubmitting(false);
        setUserLogin(userLogin.result);
        router.push("/ChairmanHome");
      } else if (decodedToken.role === 'ACCOUNTANT') {
        setSubmitting(false);
        setUserLogin(userLogin.result);
        router.push("/AccountantHome");
      }
    } catch (error) {
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
  }

  // Function to try again sign in
  // Author: Pham Hien Nhan
  const handleTryAgain = () => {
    handleLogin();
    setModalVisible(false); 
  };

  // Function to clear email and password fields
  // Author: Pham Hien Nhan
  const handClear = () => {
    setEmail("");
    setPassword("");
    setModalVisible(false); 
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 200,
          }}
        >
          <Image
            source={images.thumbnail}
            resizeMode="cover"
            style={{ width: Dimensions.get("window").width-500, height: 200}}
          />

          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[120px] h-[74px]"
          />

          <Text className="text-2xl font-semibold text-white mt-2 font-psemibold">
            Welcome to Manufacturio
          </Text>

          <FormField
            title="Email"
            placeholder={"email@gmail.com"}
            value={email}
            handleChangeText={handleChangeEmail}
            otherStyles="mt-3"
            keyboardType="email-address"
            edit={true}
          />

          <FormField
            title="Password"
            placeholder={"●●●●●●●●"}
            value={password}
            handleChangeText={handleChangePassword}
            otherStyles="mt-3"
            edit={true}
          />

          <CustomButton
            title="Sign In"
            handlePress={handleLogin}
            containerStyles="mt-5"
            isLoading={isSubmitting}
            unpressable={false}
          />

          <View className="flex justify-center pt-2 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>

          <View className="flex justify-center pt-2 flex-row gap-2">
            <Link
              href="/recover-password"
              className="text-lg font-psemibold text-secondary"
            >
              Forgot your password?
            </Link>
          </View>
        </View>
      </ScrollView>

      <CustomAlert
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="Error"
        error={errorMessage}
        message1={alertMessage1}
        message2={alertMessage2}
        isSingleButton={email === "" || password === "" || !(loginResponse === null)}
        onPressButton1={handleTryAgain}
        onPressButton2={handClear} 
      />
    </SafeAreaView>
  );
};

export default SignIn;
