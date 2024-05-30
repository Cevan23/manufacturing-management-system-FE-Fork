import { Text, View, StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TabButton } from '../../components'
import Employee from './BottomTabBar/EmployeePage';
import EmployeeDetail from './BottomTabBar/EmployeeDetail';
import EmployeeCreate from './BottomTabBar/EmployeeCreate';
import SignUpRequest from './BottomTabBar/SignUpRequest';
import SignUpDetail from './BottomTabBar/SignUpDetail';

// Stack navigation for Chairman
// Author: Pham Hien Nhan
const Stack = createNativeStackNavigator();

// Sign-up request stack page directions
// Author: Pham Hien Nhan
const SignUpStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SignUpRequest" component={SignUpRequest} options={{ headerShown: false }} />
    <Stack.Screen name="SignUpDetail" component={SignUpDetail} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// Employee stack page directions
// Author: Pham Hien Nhan
const EmployeeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Employee" component={Employee} options={{ headerShown: false }} />
    <Stack.Screen name="EmployeeDetail" component={EmployeeDetail} options={{ headerShown: false }} />
    <Stack.Screen name="EmployeeCreate" component={EmployeeCreate} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// Chairman home page
// Author: Pham Hien Nhan
const ChairmanHome = () => {
  const Tab = createBottomTabNavigator()
  const tabs = [
    {
      id: 1,
      title: 'Employee',
      screen: 'Chat',
      icon: 'human-male-female',
      Component: EmployeeStack
    },
    {
      id: 2,
      title: 'Sign up request',
      screen: 'Likes',
      icon: 'account',
      Component: SignUpStack
    }]

  return (
    <Tab.Navigator initialRouteName={'Employee'} screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar }}>
      {tabs.map((item, index) =>
        <Tab.Screen
          key={item.id}
          name={item.screen}
          component={item.Component}
          options={{
            tabBarShowLabel: false,
            tabBarButton: (props) => <TabButton item={item} {...props} />
          }} />)}
    </Tab.Navigator>
  )
}

// Styles for chairman home page
// Author: Pham Hien Nhan
const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    position: 'absolute',
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ffffff',
    backgroundColor: '#ff9c01',
  }
})

export default ChairmanHome
