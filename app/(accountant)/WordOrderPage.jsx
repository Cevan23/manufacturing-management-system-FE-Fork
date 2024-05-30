import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { getAllWorkOrders } from "../../services/WorkOrderServices"; 
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Card } from "react-native-paper"; 
import { AppLoader } from "../../components";

// Work Order Page
// Author: Nguyen Cao Nhan
const WorkOrderPage = () => {
	const { token } = useGlobalContext();
	const navigation = useNavigation();
	const [workOrders, setWorkOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useFocusEffect(
		React.useCallback(() => {
			const fetchData = async () => {
				setLoading(true);
				// Get all work orders
				const data = await getAllWorkOrders(token);
				setWorkOrders(data.result);
				setLoading(false);
			};
			fetchData();
		}, [token])
	);

	// Handle card press
	const handleCardPress = (id) => {
		try {
			navigation.navigate("WorkOrderAC", { id });
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<SafeAreaView style={styles.backgroundColor}>
			<View>
				<View style={{ padding: 10 }}>
					<FlatList
						data={workOrders.slice().sort((a, b) => a.id - b.id)}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<Card
								style={styles.card}
								onPress={() => handleCardPress(item.id)}
							>
								<Card.Title
									title={"Work Order.No: " + item.id}
									titleStyle={styles.title}
								/>
								<Card.Content>
									<View className="flex-row mb-2">
										<Text className="text-lg font-semibold text-black mr-2">
											Start Date:
										</Text>
										<Text className="text-lg text-black">{item.dateStart}</Text>
									</View>
									<View className="flex-row mb-2">
										<Text className="text-lg font-semibold text-black mr-2">
											End Date:
										</Text>
										<Text className="text-lg text-black">{item.dateEnd}</Text>
									</View>
									<View className="flex-row mb-2">
										<Text className="text-lg font-semibold text-black mr-2">
											Status:
										</Text>
										<Text className="text-lg text-black">
											{item.workOrderStatus}
										</Text>
									</View>
								</Card.Content>
							</Card>
						)}
					/>
				</View>
			</View>
			{loading ? <AppLoader /> : null}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	card: {
		margin: 10,
		padding: 10,
		backgroundColor: "white",
		elevation: 5,
	},
	cardTitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
	cardContent: {
		fontSize: 16,
	},
	backgroundColor: {
		backgroundColor: "#161622",
		flex: 1,
	},
	title: {
		color: "#FFA500",
		fontSize: 20,
		fontWeight: "bold",
		paddingTop: 10,
	},
});

export default WorkOrderPage;
