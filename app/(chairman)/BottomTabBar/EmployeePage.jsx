import React, { useState, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { styles } from './stylesEmployee';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CustomButton, ToastMessage, AppLoader } from '../../../components';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { getAllEmployee, deleteUser } from '../../../services/UserServices';

// Employee page
// Author: Pham Hien Nhan
const Employee = () => {
  const { userLogin, searchText, setSearchText } = useGlobalContext();
  const navigation = useNavigation();
  const [dataResponse, setDataResponse] = useState([]);
  const successToastRef = useRef(null);
  const errorToastRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Employee Fetch Data reload
  // Author: Pham Hien Nhan
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Get all employees
      // Author: Pham Hien Nhan
      const data = await getAllEmployee(userLogin.id);
      if (data && data.data) {
        setDataResponse(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userLogin.id]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Navigate to EmployeeDetail page
  // Author: Pham Hien Nhan
  const navigateEmployeeDetail = (item) => {
    navigation.navigate('EmployeeDetail', { data: item });
  };

  // Navigate to EmployeeCreate page
  // Author: Pham Hien Nhan
  const navigateEmployeeCreate = () => {
    navigation.navigate('EmployeeCreate');
  };

  // Remove card view from the list
  // Author: Pham Hien Nhan
  const removeCard = (index) => {
    setDataResponse((prevData) => prevData.filter((_, i) => i !== index));
  };

  // Handle delete user from database
  // Author: Pham Hien Nhan
  const handleDelete = async (index) => {
    try {
      // Delete user base on clicked index
      // Author: Pham Hien Nhan
      await deleteUser(dataResponse[index].id);
      if (successToastRef.current) {
        successToastRef.current.show({
          type: 'success',
          text: 'Delete employee successfully',
          description: 'User ' + dataResponse[index].fullName + ' has been deleted.'
        });
      }
      removeCard(index);
    } catch (err) {
      if (errorToastRef.current) {
        errorToastRef.current.show({
          type: 'danger',
          text: 'Delete failed',
          description: 'Failed to delete user ' + dataResponse[index].fullName
        });
      }
    }
  };

  // Filter searched data by name
  // Author: Pham Hien Nhan
  const getFilteredData = () => {
    if (searchText.trim() === '') {
      return dataResponse;
    }
    return dataResponse.filter(item =>
      item.fullName.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  return (
    <SafeAreaView className="bg-primary h-full">
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          value={searchText}
          onChangeText={setSearchText}
        />
        <ScrollView>
          {filteredData.map((item, index) => (
            <View key={index} style={[styles.card, index === filteredData.length - 1 ? { marginBottom: 20 } : {}]}>
              <View style={styles.headerContainer}>
                <Text style={styles.header}>Role: {item.role.roleName}</Text>
              </View>
              <View style={styles.cardContentRow}>
                <Text style={styles.title}>Fullname: {item.fullName}</Text>
              </View>
              <View style={styles.cardContentRow}>
                <Text style={styles.title}>Email: {item.email}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDelete(index)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={() => navigateEmployeeDetail(item)}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <CustomButton
          icon={"plus"}
          iconSize={28}
          containerStyles="p-0 absolute bottom-32 self-end right-4 h-12 w-12 rounded-full bg-green-500 items-center justify-center"
          isLoading={false}
          handlePress={navigateEmployeeCreate}
        />
      {loading ? <AppLoader /> : null}
      <ToastMessage type={"success"} ref={successToastRef} />
      <ToastMessage type="danger" ref={errorToastRef} />
    </SafeAreaView>
  );
};

export default Employee;
