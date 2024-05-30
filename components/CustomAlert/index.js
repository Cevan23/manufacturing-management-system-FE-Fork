import React from 'react';
import { View, Text, Modal, Image, TouchableOpacity } from 'react-native';
import { styles, images } from './styles';

// Show alert boxes with one or two option(s)
// Author: Pham Hien Nhan
const CustomAlert = ({ 
  modalVisible, 
  setModalVisible, 
  title, 
  error, 
  message1, 
  message2, 
  isSingleButton, 
  onPressButton1, 
  onPressButton2 
}) => {
  return (
    <Modal 
        animationType="fade" 
        transparent={true} 
        visible={modalVisible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Image source={images.logo} style={styles.logo}/>
          
          <Text style={styles.text}>{title}</Text>
          <Text style={styles.text}>{error}</Text>

          {/* Alert with single button */}
          {isSingleButton && (
            <View style={styles.singleButtonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(!modalVisible)} 
              >
                <Text style={styles.text}>{message1}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Alert with double button */}
          {!isSingleButton && (
            <View style={styles.doubleButtonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={onPressButton1}
              >
                <Text style={styles.text}>{message1}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={onPressButton2} 
              >
                <Text style={styles.text}>{message2}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
