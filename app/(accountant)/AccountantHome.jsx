import { StyleSheet } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SaleForecast from "./SaleForecastPage";
import ProduceOrder from "./ProduceOrderPage";
import { TabButton } from "../../components";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SaleForecastDetail from "./SaleForecastDetailPage";
import OrderProductDetail from "./OrderProductDetailPage";
import OrderMaterialDetail from "./OrderMaterialDetailPage";

// Stack navigation for Accountant
// Author: Nguyen Cao Nhan
const Stack = createNativeStackNavigator();

// SaleForecast stack page directions
// Author: Nguyen Cao Nhan
const SaleForecastStack = () => (
	<Stack.Navigator>
		<Stack.Screen name="SaleForecastPage" component={SaleForecast} options={{ headerShown: false }} />
		<Stack.Screen name="SaleForecastDetailPage" component={SaleForecastDetail} options={{ headerShown: false }} />
	</Stack.Navigator>
);

// Order stack page directions
// Author: Nguyen Cao Nhan
const OrderStack = () => (
	<Stack.Navigator>
		<Stack.Screen name="OrderPage" component={ProduceOrder} options={{ headerShown: false }} />
		<Stack.Screen name="OrderProductDetailPage" component={OrderProductDetail} options={{ headerShown: false }} />
		<Stack.Screen name="OrderMaterialDetailPage" component={OrderMaterialDetail} options={{ headerShown: false }} />
	</Stack.Navigator>
);

// Accountant home page
// Author: Nguyen Cao Nhan
const AccountantHome = () => {
	const Tab = createBottomTabNavigator();
	const tabs = [
		{
			id: 1,
			title: "ProduceOrder",
			screen: "Chat",
			icon: "layers-triple-outline",
			Component: OrderStack,
		},
		{
			id: 2,
			title: "SaleForecast",
			screen: "Likes",
			icon: "chart-timeline-variant",
			Component: SaleForecastStack,
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

// Styles for chairman home page
// Author: Nguyen Cao Nhan
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

export default AccountantHome;
