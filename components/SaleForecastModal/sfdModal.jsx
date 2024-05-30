import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

// Sale forecast detail modal component
// Author: Nguyen Cao Nhan
const SFDModal = ({ initialQuantity, initialTotalPrice, initialTotalSalePrice, visible, onSavePress, onClose }) => {
  const [quantity, setQuantity] = useState(initialQuantity.toString());
  const [totalPrice, setTotalPrice] = useState(initialTotalPrice.toString());
  const [totalSalePrice, setTotalSalePrice] = useState(initialTotalSalePrice.toString());

  const handleSave = () => {
    onSavePress(parseInt(quantity), parseFloat(totalPrice), parseFloat(totalSalePrice));
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.label}>Quantity:</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Total Price:</Text>
          <TextInput
            style={styles.input}
            value={totalPrice}
            onChangeText={setTotalPrice}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Total Sale Price:</Text>
          <TextInput
            style={styles.input}
            value={totalSalePrice}
            onChangeText={setTotalSalePrice}
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: 'rgb(34, 197, 94)' }]}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: 'rgb(239, 68, 68)' }]}>
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles of sale forecast detail modal component
// Author: Nguyen Cao Nhan
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#161622',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
  label: {
    color: '#ff9c01',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SFDModal;
