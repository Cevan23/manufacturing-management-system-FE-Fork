import { StyleSheet } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabButton } from "../../components";
import InventoryMaterial from "./InventoryMaterial";
import InventoryProduct from "./InventoryProduct";
import Inventory from "./Inventory";

// Tab for navigation among inventory Pages
// Author: Pham Hien Nhan
const InventoryPages = () => {
  const Tab = createBottomTabNavigator();
  const tabs = [
    {
      id: 1,
      title: "Inventories",
      screen: "Inventories",
      icon: "alpha-i-box",
      Component: Inventory,
    },
    {
      id: 1,
      title: "Inventory Materials",
      screen: "Chat",
      icon: "material-design",
      Component: InventoryMaterial,
    },
    {
      id: 2,
      title: "Inventory Products",
      screen: "Likes",
      icon: "cart-outline",
      Component: InventoryProduct,
    },
  ];
  return (
    <Tab.Navigator
      initialRouteName={"SaleForecast"}
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {tabs.map((item, index) => (
        <Tab.Screen
          key={item.id}
          name={item.screen}
          component={item.Component}
          options={{
            tabBarShowLabel: false,
            tabBarButton: (props) => <TabButton item={item} {...props} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    position: "absolute",
    bottom: 25,
    marginHorizontal: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#ffffff",
    backgroundColor: "#ff9c01",
  },
});

export default InventoryPages;
