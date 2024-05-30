import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, TextInput } from "react-native";
import { getWorkOrderToday } from "../../services/WorkOrderServices";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLoader } from "../../components";
import { Chatbot } from "../../services/ChatbotServices";
import { CustomButton } from "../../components";

// Product Manager Home page
// Author: Pham Van Cao
const ProductManagerHome = () => {
	const { token, userId } = useGlobalContext();
	const navigation = useNavigation();
	const [workOrders, setWorkOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([
		{ label: "Pending", value: "pending" },
		{ label: "Processing", value: "processing" },
		{ label: "Finish", value: "PMcheck" },
	]);

	// Refetch data when focus
	// Author: Pham Van Cao
	useFocusEffect(
		React.useCallback(() => {
			const fetchData = async () => {
				setLoading(true);
				// Get all work orders of today
				// Author: Pham Van Cao
				const data = await getWorkOrderToday(token);
				setWorkOrders(data.result);
				setLoading(false);
			};

			fetchData();
		}, [token, userId])
	);

	// Navigate to Home Detail page
	// Author: Pham Van Cao
	const handleCardPress = (id) => {
		try {
			navigation.navigate("ProductManagerHomeDetail", { id });
		} catch (error) {
			console.error(error);
		}
	};

	const [input, setInput] = useState("");
	const [response, setResponse] = useState(null);

	// Handle input chatbox change
	// Author: Pham Van Cao
	const handleInputChange = (text) => {
		setInput(text);
	};

	// Handle submit chatbox
	// Author: Pham Van Cao
	const handleSubmit = async () => {
		try {
			console.log("input: ", input);
			const chatbotResponse = await Chatbot(input);
			setResponse(chatbotResponse);
		} catch (error) {
			console.error("handle summit error", error);
		}
	};

	return (
		<SafeAreaView style={styles.backgroundColor}>
			<View style={{ padding: 10, maxHeight: 100 * 4 }}>
				<FlatList
					data={workOrders}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<Card style={styles.card} onPress={() => handleCardPress(item.id)}>
							<Card.Title title={"ID: " + item.id} titleStyle={styles.title} />
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
										{items.find((i) => i.value === item.workOrderStatus)
											?.label || item.workOrderStatus}
									</Text>
								</View>
							</Card.Content>
						</Card>
					)}
				/>
			</View>
			{loading ? <AppLoader /> : null}
			<Card
				style={{
					borderColor: "#fff",
					borderWidth: 1,
					minHeight: 200,
					borderRadius: 10,
					padding: 10,
					backgroundColor: "#000",
				}}
			>
				<View>
					<Text style={{ fontWeight: "bold", marginBottom: 5, color: "white" }}>
						Chatbot:{" "}
					</Text>
					<ScrollView
						style={{
							maxHeight: 100,
							marginBottom: 10,
						}}
						contentContainerStyle={{ padding: 10 }}
						nestedScrollEnabled={true}
					>
						{response && (
							<Text
								style={{
									padding: 10,
									backgroundColor: "#000",
									borderRadius: 0,
									borderColor: "#000",
									borderWidth: 0,
									marginBottom: 10,
									color: "white",
								}}
							>
								{response}
							</Text>
						)}
					</ScrollView>
				</View>
				<View
					style={{
						marginBottom: 10,
					}}
				></View>
			</Card>
			<Card
				style={{
					borderColor: "#fff",
					borderWidth: 1,
					maxHeight: 200,
					borderRadius: 10,
					padding: 10,
					backgroundColor: "#000",
					marginTop: 20,
				}}
			>
				<Text style={{ fontWeight: "bold", margin: 0, color: "white" }}>
					You:{" "}
				</Text>
				<View className="flex-row mb-2">
					<ScrollView
						style={{
							maxHeight: 180,
							marginBottom: 3,
						}}
						contentContainerStyle={{ padding: 2 }}
						nestedScrollEnabled={true}
					>
						<TextInput
							style={{
								height: 40,
								backgroundColor: "#fff",
								borderColor: "gray",
								borderWidth: 1,
								borderRadius: 5,
								paddingHorizontal: 10,
								margin: 10,
							}}
							multiline
							value={input}
							onChangeText={handleInputChange}
							placeholder="Enter chat content here..."
							placeholderTextColor="white"
						/>
					</ScrollView>
					<CustomButton
						icon={"arrow-up"}
						iconSize={25}
						containerStyles="p-0 self-end right-4 h-12 w-12 rounded-full bg-slate-500 items-center justify-center ml-5"
						handlePress={() => {
							handleSubmit();
							setInput("");
						}}
					/>
				</View>
			</Card>
		</SafeAreaView>
	);
};

// Styles of Product Manager Home page
// Author: Pham Van Cao
const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
	},
	sidebar: {
		flex: 2,
		backgroundColor: "#f5f5f5",
		padding: 10,
	},
	mainContent: {
		flex: 8,
		backgroundColor: "#fff",
		padding: 10,
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
	card: {
		margin: 8, // Add margin around the Card
		padding: 10, // Add padding inside the Card
		backgroundColor: "#f8f8f8", // Change the background color of the Card
		borderRadius: 10, // Add rounded corners to the Card
	},
});

export default ProductManagerHome;
