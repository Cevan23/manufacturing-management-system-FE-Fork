import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const IconButton = ({ onPress, iconName }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <FontAwesome name={iconName} size={20} color="white" />
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const buttonWidth = width / 4;

const styles = StyleSheet.create({
  button: {
    backgroundColor:"#FFA500" ,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: buttonWidth,
    alignItems: 'center',
    
  },
});

export default IconButton;