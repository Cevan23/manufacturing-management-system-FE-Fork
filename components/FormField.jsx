import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal, Dimensions, TouchableWithoutFeedback } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { icons } from '../constants';

// Form input field components
// Author: Pham Hien Nhan
const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  onPress,
  edit,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Format the date string to the correct format
  const formatDateString = (dateString) => {
    const [year, month, day] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  // Handle the date change
  const handleDateChange = (selectedDate) => {
    setShowCalendar(false);
    const formattedDate = formatDateString(selectedDate);
    if (onPress){
      onPress(formattedDate);
    } 
    else{handleChangeText(formattedDate);} 
  };

  // Handle the modal close
  const handleModalClose = () => {
    setShowCalendar(false);
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center relative">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={(title === "Password" || title === "Current password" || title === "New password") && !showPassword}
          editable={edit}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {title === "Current password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {title === "New password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {title === "Date of Birth" && (
          <TouchableOpacity disabled={!edit} onPress={() => setShowCalendar(!showCalendar) }>
            <Image
              source={icons.calendar}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {title === "Start Date" && (
          <TouchableOpacity disabled={!edit} onPress={() => setShowCalendar(!showCalendar)}>
            <Image
              source={icons.calendar}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {title === "End Date" && (
          <TouchableOpacity disabled={!edit} onPress={() => setShowCalendar(!showCalendar)}>
            <Image
              source={icons.calendar}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {/* Show calendar dialog */}
        {showCalendar && (
          <Modal
            transparent={true}
            visible={showCalendar}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={handleModalClose} // This handles the request to close the modal
          >
            <TouchableWithoutFeedback onPress={handleModalClose}>
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
                <View style={{
                  width: 350,
                  height: 90,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <DatePicker
                    mode="calendar"
                    onSelectedChange={handleDateChange}
                    placeHolderTextStyle={{ color: '#d3d3d3' }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
    </View>
  );
};

export default FormField;
