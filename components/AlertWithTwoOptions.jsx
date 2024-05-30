import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

// Author: Nguyen Cao Nhan
const AlertWithTwoOptions = ({ visible, onYesPress, onNoPress }) => {
  // Function to handle the "No" button press
  const handleNoPress = () => {
    // If there's an "onNoPress" function passed as a prop, call it
    if (onNoPress) {
      onNoPress();
    }
  };

  // Modal component to display the alert
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleNoPress}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 20, width: '80%' }}>
          <Text style={{ marginBottom: 20, textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Are you sure?</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onYesPress} style={{ backgroundColor: 'rgb(34, 197, 94)', padding: 10, borderRadius: 6, flex: 1, marginRight: 10 }}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNoPress} style={{ backgroundColor: 'rgb(239, 68, 68);', padding: 10, borderRadius: 6, flex: 1 }}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertWithTwoOptions;
