import { Text, View, StyleSheet, Alert } from "react-native";
import React, { useState, useRef, useCallback } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useGlobalContext } from "../../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import { getAllOrder, addOrder, deleteOrder, updateOrder } from "../../services/OrderService";
import { CustomButton, AppLoader, ToastMessage, AlertWithTwoOptions, OCModal, OUModal, LeftSwipe } from "../../components";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";
import dateUtilsInstance from "../../utils/DateUtils";

// Produce order page
// Author: Nguyen Cao Nhan
const ProduceOrder = () => {
	const { token, userLogin } = useGlobalContext();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const successToastRef = useRef(null);
	const errorToastRef = useRef(null);
	const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
	const [ocModalVisible, setocModalVisible] = useState(false);
	const [ouModalVisible, setouModalVisible] = useState(false);
	const [id, setId] = useState(false);
	const navigation = useNavigation();
	const [formUpdate, setFormUpdate] = useState({
		dateStart: "",
		dateEnd: "",
		orderStatus: "",
	});

	// Fetch produce order data
	// Author: Nguyen Cao Nhan
	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			// Get all orders
			// Author: Nguyen Cao Nhan
			const res = await getAllOrder(token);
			setData(res.result);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	}, [token]);

	useFocusEffect(
		useCallback(() => {
			fetchData();
		}, [fetchData])
	);

	// Handle swipe item press
	// Author: Nguyen Cao Nhan
	const handleSwipeItemPress = (title, item) => {
		if (title === "Delete") {
			setConfirmationModalVisible(true);
			setId(item.id);
		} else if (title === "Edit") {
			console.log("Edit");
			handleEditPress(item);
		}
	};

	// Handle edit press
	// Author: Nguyen Cao Nhan
	const handleEditPress = (item) => {
		if (item.dateEnd === null) {
			setFormUpdate({
				dateStart: item.dateStart,
				dateEnd: item.dateStart,
				orderStatus: item.orderStatus,
			});
		} else {
			setFormUpdate({
				dateStart: item.dateStart,
				dateEnd: item.dateEnd,
				orderStatus: item.orderStatus,
			});
		}
		setouModalVisible(true);
		setId(item.id);
	};

	// Handle navigate
	// Author: Nguyen Cao Nhan
	const handleNavigate = (item) => {
		if (item.kindOrder === "PO")
			navigation.navigate("OrderProductDetailPage", { order: item });
		if (item.kindOrder === "SO")
			navigation.navigate("OrderMaterialDetailPage", { order: item });
	};

	// Create order
	// Author: Nguyen Cao Nhan
	async function createOrder(name, contact, kindOrder, dateEnd) {
		try {
			setLoading(true);
			// Add new order to database
			// Author: Nguyen Cao Nhan
			const add_res = await addOrder(
				token,
				parseInt(userLogin.id),
				name,
				contact,
				dateEnd,
				kindOrder
			);
			if (!add_res) {
				if (errorToastRef.current) {
					errorToastRef.current.show({
						type: "danger",
						text: "Error",
						description: "Fail to add!",
					});
				}
			} else {
				if (successToastRef.current) {
					successToastRef.current.show({
						type: "success",
						text: "Success",
						description: "Add successfully!",
					});
				}
				await fetchData();
			}
		} catch (error) {
			Alert.alert("Error", "Failed to create sale forecast");
		} finally {
			setLoading(false);
		}
	}

	// Delete order
	// Author: Nguyen Cao Nhan
	async function delOrder(id) {
		try {
			setLoading(true);
			// Remove order out of database
			// Author: Nguyen Cao Nhan
			const del_res = await deleteOrder(token, id);
			if (!del_res) {
				if (errorToastRef.current) {
					errorToastRef.current.show({
						type: "danger",
						text: "Error",
						description: "Fail to delete!",
					});
				}
			} else {
				if (successToastRef.current) {
					successToastRef.current.show({
						type: "success",
						text: "Success",
						description: "Delete successfully!",
					});
				}
				await fetchData();
			}
		} catch (error) {
			Alert.alert("Error", "Failed to delete sale forecast");
		} finally {
			setLoading(false);
		}
	}

	// Update order
	// Author: Nguyen Cao Nhan
	async function upOrder(dateStart, dateEnd, orderStatus) {
		try {
			setLoading(true);
			// Update order in database
			// Author: Nguyen Cao Nhan
			const up_res = await updateOrder(
				token,
				id,
				dateStart,
				dateEnd,
				orderStatus
			);
			if (!up_res) {
				if (errorToastRef.current) {
					errorToastRef.current.show({
						type: "danger",
						text: "Error",
						description: "Fail to update!",
					});
				}
			} else {
				if (successToastRef.current) {
					successToastRef.current.show({
						type: "success",
						text: "Success",
						description: "Update successfully!",
					});
				}
				await fetchData();
			}
		} catch (error) {
			Alert.alert("Error", "Failed to update order");
		} finally {
			setLoading(false);
		}
	}
	return (
		<>
			<SafeAreaView style={styles.backgroundColor}>
				<View style={styles.container}>
					<View className="flex">
						{data.length > 0 ? (
							<View style={{ maxHeight: 8 * 84 }}>
								<FlatList
									data={data.slice().sort((a, b) => a.id - b.id)}
									keyExtractor={(item) => item.id.toString()}
									renderItem={({ item }) => (
										<Swipeable
											key={item.id}
											renderLeftActions={() => (
												<LeftSwipe
													onPressItem={(title) =>
														handleSwipeItemPress(title, item)
													}
												/>
											)}
										>
											<Card
												style={styles.card}
												onPress={() => handleNavigate(item)}
											>
												<Card.Title
													title={"Order.No: " + item.id}
													titleStyle={styles.title}
												/>
												<Card.Content>
													<View className="flex-row mb-2">
														<Text className="text-lg font-semibold text-black mr-2">
															Kind Order:
														</Text>
														<Text className="text-lg text-black">
															{item.kindOrder}
														</Text>
													</View>
													<View className="flex-row mb-2">
														<Text className="text-lg font-semibold text-black mr-2">
															Order Status:
														</Text>
														<Text className="text-lg text-black">
															{item.orderStatus}
														</Text>
													</View>
													<View className="flex-row mb-2">
														<Text className="text-lg font-semibold text-black mr-2">
															Total Price:
														</Text>
														<Text className="text-lg text-black">
															{item.totalPrice}
														</Text>
													</View>
													<View className="flex-row mb-2">
														<Text className="text-lg font-semibold text-black mr-2">
															Date Start:
														</Text>
														<Text className="text-lg text-black">
															{dateUtilsInstance.formatDateString(
																item.dateStart
															)}
														</Text>
													</View>
													<View className="flex-row mb-2">
														<Text className="text-lg font-semibold text-black mr-2">
															Date End:
														</Text>
														<Text className="text-lg text-black">
															{dateUtilsInstance.formatDateString(item.dateEnd)}
														</Text>
													</View>
													<View className="flex-row mb-2">
														<Text className="text-lg font-semibold text-black mr-2">
															Customer Name:
														</Text>
														<Text className="text-lg text-black">
															{item.customer.name}
														</Text>
													</View>
													<View className="flex-row mb-2">
														<Text className="text-lg font-semibold text-black mr-2">
															Customer Contact:
														</Text>
														<Text className="text-lg text-black">
															{item.customer.contact}
														</Text>
													</View>
												</Card.Content>
											</Card>
										</Swipeable>
									)}
								/>
							</View>
						) : (
							<Text style={styles.noDataText}>No data available</Text>
						)}
					</View>
				</View>
				<CustomButton
					icon={"plus"}
					iconSize={28}
					containerStyles="p-0 absolute bottom-32 self-end right-4 h-12 w-12 rounded-full bg-green-500 items-center justify-center"
					handlePress={() => {
						setocModalVisible(true);
					}}
					isLoading={false}
				/>
			</SafeAreaView>
			{loading ? <AppLoader /> : null}

			<ToastMessage type={"success"} ref={successToastRef}></ToastMessage>

			<ToastMessage type="danger" ref={errorToastRef} />

			<AlertWithTwoOptions
				visible={confirmationModalVisible}
				message="Are you sure?"
				onYesPress={() => {
					delOrder(id);
					setConfirmationModalVisible(false);
				}}
				onNoPress={() => setConfirmationModalVisible(false)}
			/>
			<OCModal
				visible={ocModalVisible}
				onClose={() => setocModalVisible(false)}
				onSavePress={(dateEnd, name, contact, kindOrder) => {
					createOrder(name, contact, kindOrder, dateEnd);
					setocModalVisible(false);
				}}
				initialName={""}
				initialContact={""}
				initialKindOrder={""}
			/>
			<OUModal
				visible={ouModalVisible}
				onClose={() => setouModalVisible(false)}
				onSavePress={(dateStart, dateEnd, orderStatus) => {
					upOrder(dateStart, dateEnd, orderStatus);
					setouModalVisible(false);
				}}
				initialDateStart={formUpdate.dateStart}
				initialDateEnd={formUpdate.dateEnd}
				initialOrderStatus={formUpdate.orderStatus}
			/>
		</>
	);
};

// Styles for produce order page
const styles = StyleSheet.create({
	backgroundColor: {
		backgroundColor: "#161622",
		flex: 1,
		paddingBottom: 100,
	},
	container: {
		flex: 1,
		backgroundColor: "#161622",
		paddingVertical: 0,
		paddingHorizontal: 0,
	},
	row: {
		flexDirection: "row",
		marginVertical: 0,
		marginHorizontal: 0,
		alignItems: "center",
		elevation: 1,
		borderRadius: 3,
		paddingHorizontal: 0,
		paddingVertical: 10,
		backgroundColor: "#fff",
		borderColor: "#fff",
	},
	noDataText: {
		textAlign: "center",
		marginTop: 20,
		fontSize: 16,
		color: "#aaa",
	},
	title: {
		color: "#FFA500",
		fontSize: 20,
		fontWeight: "bold",
		paddingTop: 10,
	},
	card: {
		margin: 10,
		padding: 10,
		backgroundColor: "#fff",
	},
});

export default ProduceOrder;
