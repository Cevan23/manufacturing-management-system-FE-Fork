import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfilePage from '../Profile/EditProfilePage';
import ResetPassword from '../Profile/ResetPassword';

// ProfileStack component for direct among pages
// Author: Pham Hien Nhan
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EditProfilePage" component={EditProfilePage} options={{ headerShown: false }} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
