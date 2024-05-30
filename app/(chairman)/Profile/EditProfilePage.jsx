import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { images } from '../../../constants';
import styles from './stylesProfile';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { CustomButton, FormField, ToastMessage } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import { updateUser } from "../../../services/UserServices";

const EditProfilePage = () => {
  const { setUser, setIsLogged, userLogin } = useGlobalContext();
  const [edit, setEdit] = useState(false);
  const [disableEdit, setDisableEditing] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const successToastRef = useRef(null);
  const errorToastRef = useRef(null);

  const [username, setUserName] = useState(userLogin.fullName);
  const [fullName, setFullName] = useState(userLogin.fullName);
  const [email, setEmail] = useState(userLogin.email);
  const [dateOfBirth, setDateOfBirth] = useState(userLogin.dateOfBirth);
  const [phoneNumber, setPhoneNumber] = useState(userLogin.phoneNumber);
  const [address, setAddress] = useState(userLogin.address);

  // Remove time -> 'YYYY-MM-DD'
  // Author: Pham Hien Nhan
  const dateOfBirthFormatted = new Date(dateOfBirth).toLocaleDateString('en-CA'); 

  // Allow editing of user information
  // Author: Pham Hien Nhan
  function handleEdit() {
    setEdit(!edit);
    setDisableEditing(!disableEdit); 
  }

  // Allow navigation to ResetPassword page
  // Author: Pham Hien Nhan
  const navigation = useNavigation();

  // Handle reset password
  // Author: Pham Hien Nhan
  const handleResetPassword = () => {
    navigation.navigate('ResetPassword');
  };

  // Handle update user information
  // Author: Pham Hien Nhan
  async function handleUpdateInfo() {
    setSubmitting(true);
    const updatedUser = await updateUser(
      userLogin.id,
      fullName,
      email,
      dateOfBirth,
      phoneNumber,
      address
    );
    setUser(updatedUser);
    setEdit(!edit);
    setDisableEditing(!disableEdit);
    setUserName(fullName);

    if (successToastRef.current) {
      successToastRef.current.show({
        type: 'success',
        text: 'Update Profile',
        description: 'Your profile has been updated.'
      });
    }

    setSubmitting(false);
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4" style={styles.container}>
          <View style={styles.headerContainer}>
            <Image source={images.accountant} resizeMode="cover" style={styles.avatar} />

            <View style={styles.headingContainer}>
              <Text style={styles.first_heading}>{username}</Text>
              <Text style={styles.first_heading}>Role: Chairman</Text>
            </View>

            <TouchableOpacity style={styles.editIcon} onPress={handleEdit}>
              <Icon name="edit" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.passwordResetIcon} onPress={handleResetPassword}>
              <Icon name="lock" size={30} color="white" />
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
      <ToastMessage type={"success"} ref={successToastRef}></ToastMessage>
    
      <ToastMessage type="danger" ref={errorToastRef}/>
    </SafeAreaView>
  );
};

export default EditProfilePage;
