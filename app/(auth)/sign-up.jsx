import { useState, useRef } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Image } from "react-native";
import { images } from "../../constants";
import { CustomButton, FormField, ToastMessage } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { signUpOrInsertUser } from "../../services/LoginServices";
import CustomAlert from "../../components/CustomAlert";

// Sign-up screen
// Author: Pham Hien Nhan
const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertMessage1, setAlertMessage1] = useState("");
  const [alertMessage2, setAlertMessage2] = useState("");

  const successToastRef = useRef(null);
  const errorToastRef = useRef(null);

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
  });

  // Handle sign-up
  // Author: Pham Hien Nhan
  async function handleSignUp() {
    if (form.fullName === "" || form.email === "" || form.password === ""
        || form.dateOfBirth === "" || form.phoneNumber === "" || form.address === "") {
      setModalVisible(true);
      setErrorMessage("Please fill in all fields");
      setAlertMessage1("Close");
      setAlertMessage2("");
      return;
    }

    setSubmitting(true);

    try {
      // Handle sign-up request check email not existed in database
      // Author: Pham Hien Nhan
      const SignUpRequest = await signUpOrInsertUser(form.fullName, form.email, form.password, form.dateOfBirth, form.phoneNumber, form.address, "");
      if (!SignUpRequest) {
        setModalVisible(true);
        setErrorMessage("Password or email is incorrect");
        setAlertMessage1("Try again");
        setAlertMessage2("Clear");
        setSubmitting(false);
        return;
      }      

      setSubmitting(false);
      if (successToastRef.current) {
        successToastRef.current.show({
          type: 'success',
          text: 'Successfully sent sign-up request',
          description: 'Please wait for the admin to approve your request.'
        });
      }
      handClear();
      setTimeout(() => {
        router.push('/sign-in');
      }, 4000);
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  // Function to try again sign in
  // Author: Pham Hien Nhan
  const handleTryAgain = () => {
    handleSignUp();
    setModalVisible(false); 
  };

  // Function to clear email and password fields
  // Author: Pham Hien Nhan
  const handClear = () => {
    setForm({ ...form, 
      fullName: "", 
      email: "", 
      password: "", 
      dateOfBirth: "",
      phoneNumber: "",
      address: "",});
    setModalVisible(false); 
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height-100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[69px]"
          />

          <Text className="text-2xl font-semibold text-white mt-2 font-psemibold">
            Sign up to Manufacturio
          </Text>

          <FormField
            title="Username"
            placeholder={"Username"}
            value={form.fullName}
            handleChangeText={(e) => setForm({ ...form, fullName: e })}
            otherStyles="mt-3"
            edit={true}
          />

          <FormField
            title="Email"
            placeholder={"email@gmail.com"}
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-3"
            keyboardType="email-address"
            edit={true}
          />

          <FormField
            title="Password"
            placeholder={"●●●●●●●●"}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-3"
            edit={true}
          />

          <FormField
            title="Date of Birth"
            placeholder={"YYYY-MM-DD"}
            value={form.dateOfBirth}
            handleChangeText={(e) => setForm({ ...form, dateOfBirth: e })}
            otherStyles="mt-3"
            edit={true}
          />

          <FormField
            title="Phone Number"
            placeholder={"123-456-7890"}
            value={form.phoneNumber}
            handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
            otherStyles="mt-3"
            edit={true}
          />

          <FormField
            title="Address"
            placeholder={"1 Vo Van Ngan"}
            value={form.address}
            handleChangeText={(e) => setForm({ ...form, address: e })}
            otherStyles="mt-3"
            edit={true}
          />

          <CustomButton
            title="Sign Up"
            handlePress={handleSignUp}
            containerStyles="mt-5"
            isLoading={isSubmitting}
            unpressable={false}
          />

          <View className="flex justify-center flex-row gap-2">
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
        isSingleButton={form.fullName === "" || form.email === "" || form.password === ""
        || form.dateOfBirth === "" || form.phoneNumber === "" || form.address === "" ? true : false
        }
        onPressButton1={handleTryAgain}
        onPressButton2={handClear}
      />
    </SafeAreaView>
  );
};

export default SignUp;
