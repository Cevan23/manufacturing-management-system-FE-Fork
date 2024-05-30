import React, { useContext } from "react";
import { Text, View, Image } from "react-native";
import "react-native-gesture-handler";
import { SimpleLineIcons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { images } from "../../constants";

import ProfilePage from "./Profile/ProfilePage";
import AccountantHome from "./AccountantHome";
import Inventory from "./InventoryPage";
import WorkOrderPage from "./WordOrderPage";
import WorkOrderAC from "../(productManager)/WO/WorkOrderAC";
import SignIn from "../(auth)/sign-in";
import { useGlobalContext } from "../../context/GlobalProvider";
import { AuthContext } from "../../store/AuthContext";

// Drawer navigation for Accountant
// Author: Nguyen Cao Nhan
const Drawer = createDrawerNavigator();

// Stack navigation for Accountant
// Author: Nguyen Cao Nhan
const Stack = createNativeStackNavigator();

// Work Order of AC stack page directions
// Author: Nguyen Cao Nhan
const WorkOrderPageStack = () => (
	<Stack.Navigator initialRouteName="WorkOrderPage" screenOptions={{ headerShown: false }} >
		<Stack.Screen name="WorkOrderPage" component={WorkOrderPage} />
		<Stack.Screen name="WorkOrderAC" component={WorkOrderAC} />
	</Stack.Navigator>
);

// Accountant layout
// Author: Nguyen Cao Nhan
const AccountantLayout = () => {
	const { setUser, setIsLogged, userLogin } = useGlobalContext();
	const authCtx = useContext(AuthContext);

	// Handle logout
	// Author: Nguyen Cao Nhan
	const handleLogout = () => {
		// Clear user data and token
		setUser(null);
		setIsLogged(false);
		authCtx.logout();
	};

	return (
		<Drawer.Navigator
			drawerContent={(props) => {
				return (
					<SafeAreaView>
						<View
							style={{
								height: 200,
								width: "100%",
								justifyContent: "center",
								alignItems: "center",
								backgroundColor: "#ff9c01",
							}}
						>
							<Image
								source={images.accountant}
								style={{
									height: 100,
									width: 100,
									borderRadius: 50,
									marginBottom: 12,
								}}
							/>
							<Text className="text-xl text-black font-bold">
								{userLogin.fullName}
							</Text>
							<Text className="text-lg text-black font-bold">
								Role: Accountant
							</Text>
						</View>
						<DrawerItemList {...props} />
					</SafeAreaView>
				);
			}}
			screenOptions={{
				drawerActiveTintColor: "#ff9c01",
				drawerInactiveTintColor: "#ffffff",
				drawerStyle: {
					backgroundColor: "#161622",
					width: 240,
				},
			}}
		>
			<Drawer.Screen
				name="Profile"
				options={{
					drawerLabel: "Profile",
					title: "Profile",
					headerShadowVisible: false,
					drawerIcon: () => (
						<MaterialIcons name="person" size={20} color={"#ff9c01"} />
					),
				}}
				component={ProfilePage}
			/>

			<Drawer.Screen
				name="AccountantHome"
				options={{
					drawerLabel: "Home",
					title: "Accountant Home",
					headerShadowVisible: false,
					drawerIcon: () => (
						<SimpleLineIcons name="home" size={20} color={"#ff9c01"} />
					),
				}}
				component={AccountantHome}
			/>
			<Drawer.Screen
				name="Inventory"
				options={{
					drawerLabel: "Inventory",
					title: "Inventory",
					headerShadowVisible: false,
					drawerIcon: () => (
						<MaterialIcons name="inventory" size={20} color={"#ff9c01"} />
					),
				}}
				component={Inventory}
			/>
			<Drawer.Screen
				name="WorkOrderPage"
				options={{
					drawerLabel: "Work Order",
					title: "Work Order",
					headerShadowVisible: false,
					drawerIcon: () => (
						<MaterialIcons name="work" size={20} color={"#ff9c01"} />
					),
				}}
				component={WorkOrderPageStack}
			/>
			<Drawer.Screen
				name="Log Out"
				component={SignIn}
				listeners={{
					focus: handleLogout,
				}}
				options={{
					headerShown: false,
					drawerIcon: () => (
						<MaterialIcons name="logout" size={20} color={"#ff9c01"} />
					),
				}}
			/>
		</Drawer.Navigator>
	);
};

export default AccountantLayout;
