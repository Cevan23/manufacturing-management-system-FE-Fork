import { Text, View, StyleSheet, Alert } from "react-native";
import React, { useState, useRef, useCallback } from "react";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useGlobalContext } from "../../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import {
	getAllSaleForecast,
	addSaleForecast,
	deleteSaleForecast,
	updateSaleForecast,
} from "../../services/SaleForecastService";
import { CustomButton, AppLoader, ToastMessage, AlertWithTwoOptions, SFModal, LeftSwipe } from "../../components";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";
import dateUtilsInstance from "../../utils/DateUtils";

// Sale Forecast Page
// Author: Nguyen Cao Nhan
const SaleForecast = () => {
	const { token, userLogin } = useGlobalContext();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const successToastRef = useRef(null);
	const errorToastRef = useRef(null);
	const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
	const [sfModalVisible, setsfModalVisible] = useState(false);
	const [id, setId] = useState(false);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const navigation = useNavigation();

	// Fetch data for sale forecast
	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			// Get all sale forecast
			const res = await getAllSaleForecast(token);
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

	// Navigate to Sale Forecast Detail Page
	const handleNavigate = (id) => {
		navigation.navigate("SaleForecastDetailPage", { itemId: id });
	};

	// Handle swipe item press
	const handleSwipeItemPress = (title, item) => {
		if (title === "Delete") {
			setConfirmationModalVisible(true);
			setId(item.id);
		} else if (title === "Edit") {
			handleEditPress(item);
		}
	};

	// Handle edit press
	const handleEditPress = (item) => {
		setsfModalVisible(true);
		setId(item.id);
		setStartDate(new Date(item.dateStart));
		if (item.dateEnd === null) {
			setEndDate(new Date(item.dateStart));
		} else {
			setEndDate(new Date(item.dateEnd));
		}
	};

	// Create sale forecast
	async function createSaleForecast() {
		try {
			setLoading(true);
			// Add sale forecast into database
			const add_res = await addSaleForecast(token, parseInt(userLogin.id));
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

	// Delete sale forecast
	async function delSaleForecast(id) {
		try {
			setLoading(true);
			// Delete sale forecast from database
			const del_res = await deleteSaleForecast(token, id);
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

	// Update sale forecast
	async function upSaleForecast(dateStart, dateEnd) {
		try {
			setLoading(true);
			// Update sale forecast in database
			const up_res = await updateSaleForecast(token, id, dateStart, dateEnd);
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
			Alert.alert("Error", "Failed to update sale forecast");
		} finally {
			setLoading(false);
		}
	}
	
	return (
		<>
			<SafeAreaView style={styles.backgroundColor}>
				<View style={styles.container}>
					<ScrollView horizontal>
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
													onPress={() => handleNavigate(item.id)}
												>
													<Card.Title
														title={"Sale Forecast.No: " + item.id}
														titleStyle={styles.title}
													/>
													<Card.Content>
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
																{dateUtilsInstance.formatDateString(
																	item.dateEnd
																)}
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
					</ScrollView>
				</View>
				<CustomButton
					icon={"plus"}
					iconSize={28}
					containerStyles="p-0 absolute bottom-32 self-end right-4 h-12 w-12 rounded-full bg-green-500 items-center justify-center"
					handlePress={createSaleForecast}
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
					delSaleForecast(id);
					setConfirmationModalVisible(false);
				}}
				onNoPress={() => setConfirmationModalVisible(false)}
			/>
			<SFModal
				visible={sfModalVisible}
				onClose={() => setsfModalVisible(false)}
				onSavePress={(dateStart, dateEnd) => {
					upSaleForecast(dateStart, dateEnd);
					setsfModalVisible(false);
				}}
				initialStartDate={startDate}
				initialEndDate={endDate}
			/>
		</>
	);
};

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
		width: 390,
	},
});

export default SaleForecast;
