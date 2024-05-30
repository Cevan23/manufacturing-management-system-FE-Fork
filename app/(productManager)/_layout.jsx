import "react-native-gesture-handler";
import { Text, View, Image, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import { SimpleLineIcons, MaterialIcons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import ProfilePage from "./Profile/ProfilePage";
import ProductManagerHome from "./ProductManagerHome";
import ProductManagerHomeDetail from "./ProductManagerHomeDetail";
import ProductionSchedule from "./ProductionSchedule";
import ProductionScheduleDetail from "./MPS/MPSDetail";
import MPSCreateForm from "./MPS/MPSCreateForm";
import WorkOrder from "./WorkOrder";
import WorkOrderDetail from "./WO/WorkOrderDetail";
import CreateWorkOrder from "./WO/CreateWO";
import PMBOM from "./PMBOM";
import BOMDetail from "./BOM/BOMDetail";
import CreateBOM from "./BOM/CreateBOM";
import SignIn from "../(auth)/sign-in";
import { useGlobalContext } from "../../context/GlobalProvider";
import { AuthContext } from "../../store/AuthContext";

// Drawer navigation for Product Manager
// Author: Pham Van Cao
const Drawer = createDrawerNavigator();

// Stack navigation for Product Manager
// Author: Pham Van Cao
const Stack = createStackNavigator();

// Home stack page directions
// Author: Pham Van Cao
const ProductManagerStack = () => (
	<Stack.Navigator initialRouteName="ProductManager" screenOptions={{ headerShown: false }} >
		<Stack.Screen name="ProductManager" component={ProductManagerHome} />
		<Stack.Screen name="ProductManagerHomeDetail" component={ProductManagerHomeDetail}/>
	</Stack.Navigator>
);

// Production Schedule stack page directions
// Author: Pham Van Cao
const MPSStack = () => (
	<Stack.Navigator initialRouteName="ProductionSchedule" screenOptions={{ headerShown: false }} >
		<Stack.Screen name="ProductionScheduleHome" component={ProductionSchedule} />
		<Stack.Screen name="ProductionScheduleDetail" component={ProductionScheduleDetail} />
		<Stack.Screen name="MPSCreateForm" component={MPSCreateForm} />
	</Stack.Navigator>
);

// Work Order of PM stack page directions
// Author: Pham Van Cao
const WorkOrderStack = () => (
	<Stack.Navigator initialRouteName="WorkOrder" screenOptions={{ headerShown: false }} >
		<Stack.Screen name="WorkOrderHome" component={WorkOrder} />
		<Stack.Screen name="CreateWorkOrder" component={CreateWorkOrder} />
		<Stack.Screen name="WorkOrderDetail" component={WorkOrderDetail} />
	</Stack.Navigator>
);

// Bill of materials stack page directions
// Author: Pham Van Cao
const PMBOMStack = () => (
	<Stack.Navigator initialRouteName="PMBOM" screenOptions={{ headerShown: false }}>
		<Stack.Screen name="PMBOM" component={PMBOM} />
		<Stack.Screen name="BOMDetail" component={BOMDetail} />
		<Stack.Screen name="CreateBOM" component={CreateBOM} />
	</Stack.Navigator>
);

// Product Manager layout
// Author: Pham Van Cao
const ProductManagerLayout = () => {
	const { setUser, setIsLogged, userLogin, searchText, setSearchText } = useGlobalContext();
	const authCtx = useContext(AuthContext);

	const [searchMode, setSearchMode] = useState(false);

	// Handle logout
	// Author: Nguyen Cao Nhan
	const handleLogout = () => {
		// Clear user data and token
		setUser(null);
		setIsLogged(false);
		authCtx.logout();
	};

	// Handle cancel search
	// Author: Pham Hien Nhan
	const handleCancelSearch = () => {
		setSearchMode(false);
		setSearchText("");
	};

	// Handle open search box
	// Author: Pham Hien Nhan
	const handleSearchIconClick = () => {
		setSearchMode(!searchMode);
		if (!searchMode) {
			setSearchText("");
		}
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
								Role: Product Manager
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
				name="ProductManagerHome"
				options={{
					drawerLabel: "Home",
					title: "Product Manager Home",
					headerShadowVisible: false,
					drawerIcon: () => (
						<SimpleLineIcons name="home" size={20} color={"#ff9c01"} />
					),
				}}
				component={ProductManagerStack}
			/>
			<Drawer.Screen
				name="ProductionSchedule"
				component={MPSStack}
				headerShadowVisible={false}
				options={{
					drawerLabel: "Schedule",
					title: searchMode ? null : "Production Schedule",
					headerShadowVisible: false,
					drawerIcon: () => (
						<MaterialCommunityIcons
							name="calendar-clock"
							size={20}
							color={"#ff9c01"}
						/>
					),
					headerRight: () =>
						searchMode ? (
							<View style={styles.searchContainer}>
								<TextInput
									style={styles.searchText}
									placeholder="Search products..."
									value={searchText}
									onChangeText={setSearchText}
								/>
								<TouchableOpacity onPress={handleCancelSearch}>
									<Text style={styles.cancelText}>Cancel</Text>
								</TouchableOpacity>
							</View>
						) : (
							<TouchableOpacity onPress={handleSearchIconClick}>
								<MaterialIcons
									name="search"
									size={30}
									color="#000"
									style={styles.searchIcon}
								/>
							</TouchableOpacity>
						),
				}}
			/>
			<Drawer.Screen
				name="WorkOrder"
				options={{
					drawerLabel: "Work Order",
					title: "Work Order",
					headerShadowVisible: false,
					drawerIcon: () => (
						<MaterialIcons name="work" size={20} color={"#ff9c01"} />
					),
				}}
				component={WorkOrderStack}
			/>
			<Drawer.Screen
				name="BOM"
				component={PMBOMStack}
				headerShadowVisible={false}
				options={{
					drawerLabel: "Bill of material",
					title: searchMode ? null : "Bill of material",
					headerRight: () =>
						searchMode ? (
							<View style={styles.searchContainer}>
								<TextInput
									style={styles.searchText}
									placeholder="Search BOMs..."
									value={searchText}
									onChangeText={setSearchText}
								/>
								<TouchableOpacity onPress={handleCancelSearch}>
									<Text style={styles.cancelText}>Cancel</Text>
								</TouchableOpacity>
							</View>
						) : (
							<TouchableOpacity onPress={handleSearchIconClick}>
								<MaterialIcons
									name="search"
									size={30}
									color="#000"
									style={styles.searchIcon}
								/>
							</TouchableOpacity>
						),
					drawerIcon: () => (
						<FontAwesome name="list-alt" size={20} color={"#ff9c01"} />
					),
				}}
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

// Handle styles for Product Manager layout
// Author: Pham Van Cao
const styles = StyleSheet.create({
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	searchText: {
		height: 40,
		width: 270, // Adjust the width as needed
		borderColor: "#000",
		borderWidth: 1,
		marginRight: 8,
		paddingHorizontal: 8,
		borderRadius: 8,
	},
	cancelText: {
		color: "#ff9c01",
		fontSize: 16,
		fontWeight: "bold",
		marginRight: 10,
	},
	searchIcon: {
		marginRight: 16,
	},
});

export default ProductManagerLayout;
