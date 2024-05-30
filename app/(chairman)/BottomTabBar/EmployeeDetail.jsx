import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CustomButton, FormField, ToastMessage } from '../../../components';
import DropDownField from '../../../components/DropDownField'; 
import { useNavigation } from '@react-navigation/native';
import { updateUserByChairman } from "../../../services/UserServices";

// EmployeeDetail page
// Author: Pham Hien Nhan
const EmployeeDetail = ({ route }) => {
  const { data } = route.params;
  const navigation = useNavigation();
  const [edit, setEdit] = useState(false);
  const [disableEdit, setDisableEditing] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const successToastRef = useRef(null);
  const errorToastRef = useRef(null);

  const [id, setId] = useState(data.id);
  const [role, setRole] = useState(data.role.roleName);
  const [fullName, setFullName] = useState(data.fullName);
  const [email, setEmail] = useState(data.email);
  const [dateOfBirth, setDateOfBirth] = useState(data.dateOfBirth);
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber);
  const [address, setAddress] = useState(data.address);

  // Remove time -> 'YYYY-MM-DD'
  // Author: Pham Hien Nhan
  const dateOfBirthFormatted = new Date(dateOfBirth).toLocaleDateString('en-CA');

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

  // Update user information
  // Author: Pham Hien Nhan
  async function handleUpdateInfo() {
    setSubmitting(true);
    const updatedUser = await updateUserByChairman(
      id,
      fullName,
      email,
      dateOfBirth,
      phoneNumber,
      address,
      role
    );
    setEdit(!edit);
    setDisableEditing(!disableEdit);

    if (successToastRef.current) {
      successToastRef.current.show({
        type: 'success',
        text: 'Update Profile',
        description: 'Profile of ' + fullName +' has been updated successfully.'
      });
    }
    setSubmitting(false);
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4" style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.headingContainer}>
              <Text style={styles.first_heading}>Employee Profile</Text>
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
            value={fullName}
            placeholder="Full name"
            otherStyles="mt-3"
            edit={edit}
            handleChangeText={(text) => setFullName(text)}
          />

          <DropDownField
            title="Role"
            value={role}
            setValue={setRole}
            items={dropdownItems}
            placeholder={role}
            edit={edit}
          />

          <FormField
            title="Email"
            value={email}
            placeholder="Email"
            otherStyles="mt-3"
            keyboardType="email-address"
            edit={edit}
            handleChangeText={(text) => setEmail(text)}
          />

          <FormField
            title="Date of Birth"
            value={dateOfBirthFormatted}
            placeholder="YYYY-MM-DD"
            otherStyles="mt-3"
            edit={edit}
            handleChangeText={(text) => setDateOfBirth(text)}
          />

          <FormField
            title="Phone number"
            value={phoneNumber}
            placeholder="Phone number"
            otherStyles="mt-3"
            edit={edit}
            handleChangeText={(text) => setPhoneNumber(text)}
          />

          <FormField
            title="Address"
            value={address}
            placeholder="Address"
            otherStyles="mt-3"
            edit={edit}
            handleChangeText={(text) => setAddress(text)}
          />

          <CustomButton
            title="SAVE"
            handlePress={handleUpdateInfo}
            containerStyles="mt-5"
            isLoading={isSubmitting}
            unpressable={disableEdit}
          />
        </View>
      </ScrollView>

      <ToastMessage
        type={"success"}
        ref={successToastRef}></ToastMessage>
    
      <ToastMessage
        type="danger"
        ref={errorToastRef}/>
    </SafeAreaView>
  );
};

// Styles of EmployeeDetail page
// Author: Pham Hien Nhan
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#161622',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 210
  },
  headerContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
  },
  headingContainer: {
    alignItems: 'center',
  },
  first_heading: {
    fontSize: 18,
    color: '#ff9c01',
    fontWeight: 'bold',
    marginTop: 10, 
  },
  backIcon: {
    position: 'absolute',
    left: 10,
  },
  editIcon: {
    position: 'absolute',
    right: 10,
  }
});

export default EmployeeDetail;
