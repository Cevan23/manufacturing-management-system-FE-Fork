import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CustomButton, FormField, ToastMessage } from '../../../components';
import DropDownField from '../../../components/DropDownField';
import { useNavigation } from '@react-navigation/native';
import { createUser } from "../../../services/UserServices";

// EmployeeCreate page
// Author: Pham Hien Nhan
const EmployeeCreate = () => {
  const navigation = useNavigation();
  const [edit, setEdit] = useState(false);
  const [disableEdit, setDisableEditing] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const successToastRef = useRef(null);
  const errorToastRef = useRef(null);

  const [roleName, setRoleName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456"); // Added password field
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const dropdownItems = [
    { label: 'Chairman', value: 'CHAIRMAN' },
    { label: 'Accountant', value: 'ACCOUNTANT' },
    { label: 'Product Manager', value: 'PRODUCT_MANAGER' },
  ];

  // Allow user to edit the information
  // Author: Pham Hien Nhan
  function handleEdit() {
    setEdit(!edit);
    setDisableEditing(!disableEdit); 
  }

  // Create new user account
  // Author: Pham Hien Nhan
  async function handleCreateUser() {
    if (fullName === "" || email === "" || password === "" || dateOfBirth === "" || 
      phoneNumber === "" || address === "" || roleName === "") {
      if (errorToastRef.current) {
        errorToastRef.current.show({
          type: 'danger',
          text: 'Empty field(s)',
          description: 'Please fill in all fields.'
        });
      }
      setSubmitting(false);
      return;
    }

    setSubmitting(true);

    try {
      // Create new user account with default password 123456.
      // Author: Pham Hien Nhan
      await createUser(
        fullName,
        email,
        password,
        dateOfBirth,
        phoneNumber,
        address,
        roleName
      );

      setEdit(!edit);
      setDisableEditing(!disableEdit);
 
      if (successToastRef.current) {
        successToastRef.current.show({
          type: 'success',
          text: `Create new account ${fullName} successfully`,
          description: "The password is 123456. Please change it after logging in."
        });
      }
      // Delay navigation by 3.5 seconds
    setTimeout(() => {
      navigation.goBack();
    }, 3500);

    } catch (error) {
      if (errorToastRef.current) {
        errorToastRef.current.show({
          type: 'danger',
          text: 'Error',
          description: 'There was an error creating the profile.'
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.headerContainer}>
            <View style={styles.headingContainer}>
              <Text style={styles.first_heading}>New Employee</Text>
            </View>

            <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.editIcon} onPress={handleEdit}>
              <Icon name="edit" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <FormField
            title="Full name"
            placeholder="Full name"
            otherStyles="mt-5"
            edit={edit} // Always editable for creation
            handleChangeText={(text) => setFullName(text)}
          />

          <DropDownField
            title="Role"
            value={roleName}
            placeholder="Choose a role"
            setValue={setRoleName}
            items={dropdownItems}
            edit={edit} // Always editable for creation
          />

          <FormField
            title="Email"
            placeholder="example@gmail.com"
            otherStyles="mt-5"
            keyboardType="email-address"
            edit={edit} // Always editable for creation
            handleChangeText={(text) => setEmail(text)}
          />
          
          <FormField
            title="Date of Birth"
            value={dateOfBirth}
            placeholder="YYYY-MM-DD"
            otherStyles="mt-5"
            edit={edit}
            handleChangeText={(text) => setDateOfBirth(text)}
          />

          <FormField
            title="Phone number"
            placeholder="000-000-0000"
            otherStyles="mt-5"
            edit={edit}
            handleChangeText={(text) => setPhoneNumber(text)}
          />

          <FormField
            title="Address"
            placeholder="123 Test St"
            otherStyles="mt-5"
            edit={edit} // Always editable for creation
            handleChangeText={(text) => setAddress(text)}
          />
        </ScrollView>
      </View>
      <CustomButton
        title="SAVE"
        handlePress={handleCreateUser}
        containerStyles="absolute bottom-24 self-center w-20"
        isLoading={isSubmitting}
        unpressable={disableEdit}
      />

      <ToastMessage
        type={"success"}
        ref={successToastRef}></ToastMessage>
    
      <ToastMessage
        type="danger"
        ref={errorToastRef}/>
    </SafeAreaView>
  );
};

// Styles of EmployeeCreate page
// Author: Pham Hien Nhan
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#161622',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 180
  },
  headerContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 5,
  },
  headingContainer: {
    alignItems: 'center',
  },
  first_heading: {
    fontSize: 21,
    color: '#ff9c01',
    fontWeight: 'bold',
    marginTop: 10, 
  },
  backIcon: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  }
});

export default EmployeeCreate;
