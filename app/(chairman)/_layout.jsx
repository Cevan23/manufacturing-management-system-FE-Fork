import React, { useContext, useState } from "react";
import { Text, View, Image, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { SimpleLineIcons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";

import ProfilePage from "./Profile/ProfilePage";
import ChairmanHome from "./ChairmanHome";
import SaleForecastReport from "./SaleForecastReport";
import SignIn from "../(auth)/sign-in";
import { useGlobalContext } from "../../context/GlobalProvider";
import { AuthContext } from "../../store/AuthContext";
import "react-native-gesture-handler";

// Drawer navigation for Chairman
// Author: Pham Hien Nhan
const Drawer = createDrawerNavigator();

// Chairman layout
// Author: Pham Hien Nhan
const ChairmanLayout = () => {
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
								Role: Chairman
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
				name="ChairmanHome"
				options={{
					drawerLabel: "Home",
					title: searchMode ? null : "Chairman Home",
					headerShadowVisible: false,
					headerRight: () =>
						searchMode ? (
							<View style={styles.searchContainer}>
								<TextInput
									style={styles.searchText}
									placeholder="Search employee name..."
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
									name="person-search"
									size={30}
									color="#000"
									style={styles.searchIcon}
								/>
							</TouchableOpacity>
						),
					drawerIcon: () => (
						<SimpleLineIcons name="home" size={20} color={"#ff9c01"} />
					),
				}}
				component={ChairmanHome}
			/>
			<Drawer.Screen
				name="SaleForecast Report"
				options={{
					drawerLabel: "Sale Report",
					title: "Sale Forecast Report",
					headerShadowVisible: false,
					drawerIcon: () => (
						<MaterialIcons name="edit-calendar" size={20} color={"#ff9c01"} />
					),
				}}
				component={SaleForecastReport}
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

// Handle styles for Chairman layout
// Author: Pham Hien Nhan
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

export default ChairmanLayout;
