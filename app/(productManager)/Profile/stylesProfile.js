import { StyleSheet } from 'react-native';

// Style for Profile Screens
// Author: Pham Hien Nhan
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#ff9c01',
  },
  headingContainer: {
    flex: 1,
    marginLeft: 20, 
  },
  first_heading: {
    fontSize: 18,
    color: '#ff9c01',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    top: 15,
    right: 10,
  },
  passwordResetIcon:{
    position: 'absolute',
    top: 55,
    right: 10,
  }
});

export default styles;
