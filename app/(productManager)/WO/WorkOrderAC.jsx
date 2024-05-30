import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import {
	deleteWorkOrder,
	getWorkOrderDetail,
	updateWorkOrder,
} from "../../../services/WorkOrderServices";
import { createWorkOrderDetail } from "../../../services/WorkOrderDetailServices";
import { getAllMPS } from "../../../services/MPSServices";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Card } from "react-native-paper";
import IconButton from "../../../components/IconButton";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { icons } from "../../../constants";
import AppLoader from "../../../components/AppLoader";
import AlertWithTwoOptions from "../../../components/AlertWithTwoOptions";
import ToastMessage from "../../../components/ToastMessage";
import CustomButton from "../../../components/CustomButton";

// Work Order AC page
// Author: Nguyen Cao Nhan
const WorkOrderAC = ({ route }) => {
	const { token, userId } = useGlobalContext();
	const navigation = useNavigation();
	const { id } = route.params;
	const [workOrder, setWorkOrder] = useState([]);
	const [workOrderDetails, setWorkOrderDetails] = useState([]);
	const [mps, setMPS] = useState([]);
	const [loading, setLoading] = useState(true);
	const successToastRef = useRef(null);
	const errorToastRef = useRef(null);
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);
	const [items, setItems] = useState([
		{ label: "Pending", value: "pending" },
		{ label: "Processing", value: "processing" },
		{ label: "Finish", value: "ACcheck" },
	]);
	const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(workOrder.workOrderStatus);

	// Set the value of the dropdown to the work order status
	useEffect(() => {
		setValue(workOrder.workOrderStatus);
	}, [workOrder.workOrderStatus]);

	// Fetch work order details and master production schedules
	// Author: Nguyen Cao Nhan
	useFocusEffect(
		React.useCallback(() => {
			const fetchData = async () => {
				setLoading(true);
				// Get work order details 
				// Author: Nguyen Cao Nhan
				const response = await getWorkOrderDetail(token, id);
				setWorkOrder(response.result.workOrder);
				setWorkOrderDetails(response.result.workOrderDetails);

				// Get all master production schedules
				// Author: Nguyen Cao Nhan
				const mpsResponse = await getAllMPS(token);
				setMPS(mpsResponse.result);
				setLoading(false);
			};
			fetchData();
		}, [token, userId])
	);

	// Handle save work order
	// Author: Nguyen Cao Nhan
	const handleSave = async () => {
		try {
			setLoading(true);
			console.log("workOrder: ", workOrder);
			console.log("workOrderDetails: ", workOrderDetails);
			// Update work order
			// Author: Nguyen Cao Nhan
			const response = await updateWorkOrder(token, workOrder);

			// Create work order details
			// Author: Nguyen Cao Nhan
			const responseDT = await createWorkOrderDetail(token, workOrderDetails);
			console.log("response: ", response);
			console.log("responseDT: ", responseDT);
			if (successToastRef.current) {
				successToastRef.current.show({
					type: "success",
					text: "Success",
					description: "Work Order updated successfully!",
				});
			}
			setTimeout(() => {
                navigation.goBack();
            }, 3500);
		} catch (error) {
			console.error(error);
			if (errorToastRef.current) {
				errorToastRef.current.show({
					type: "danger",
					text: "Error",
					description: "Work Order update failed:!",
				});
			}
		} finally {
			setLoading(false);
		}
	};

	// Handle delete work order
	// Author: Nguyen Cao Nhan
	const handleDelete = async () => {
		try {
			setLoading(true);
			const response = await deleteWorkOrder(token, id);
			console.log("response: ", response);
			if (successToastRef.current) {
				successToastRef.current.show({
					type: "success",
					text: "Success",
					description: "Work Order deleted successfully!",
				});
			}
			setTimeout(() => {
                navigation.goBack();
            }, 3500);
		} catch (error) {
			if (errorToastRef.current) {
				errorToastRef.current.show({
					type: "danger",
					text: "Error",
					description: "Work Order delete failed!",
				});
			}
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: "#161622" }}>
			<View style={{ marginBottom: 10, backgroundColor: "#fff" }}>
				<View style={styles.header}>
					<Text className="flex text-base text-center font-psemibold text-black py-1 pr-14 ml-4">
						Name
					</Text>
					<Text className="flex text-base text-center font-psemibold text-black py-1 pr-8">
						Date Start
					</Text>
					<Text className="text-base text-center font-psemibold text-black py-1 pr-5">
						Date End
					</Text>
					<Text className="text-base text-center font-psemibold text-black p-1">
						Quantity
					</Text>
				</View>
				<ScrollView style={styles.scrollView}>
					{mps.map((item, index) => (
						<TouchableOpacity
							key={index.toString()}
							style={styles.itemContainer}
							onPress={() => {
								setWorkOrderDetails((prevDetails) => {
									const newDetails = [...prevDetails];
									newDetails[newDetails.length - 1].masterProductionScheduleId =
										item.mpsID;
									return newDetails;
								});
							}}
						>
							<View style={styles.row}>
								<Text className="flex font-psemi text-black">
									{item.productName}
								</Text>
								<Text className="flex font-psemi text-black">
									{item.dateStart}
								</Text>
								<Text className="flex font-psemi text-black">
									{item.dateEnd}
								</Text>
								<Text className="flex font-psemi text-black">
									{item.quantity}
								</Text>
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			<View style={{ marginBottom: 230, backgroundColor: "#161622" }}>
				<ScrollView>
					<Card style={styles.card}>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text className="flex font-psemibold text-black mr-4">
								Work Order Status:
							</Text>
							<DropDownPicker
								open={open}
								value={value}
								items={items}
								setOpen={setOpen}
								setValue={setValue}
								setItems={setItems}
								containerStyle={[styles.dropDownContainer, open && { zIndex: 1000 }]}
        						style={styles.dropDown}
        						itemStyle={{ justifyContent: 'flex-start' }}
        						dropDownStyle={styles.dropDown}
								onChangeValue={(value) => {
									console.log("onChangeValue called with:", value);
									setWorkOrder((prevState) => ({
										...prevState,
										workOrderStatus: value,
									}));
								}}
							/>
						</View>

						{showStartPicker && (
							<DateTimePicker
								value={
									workOrder.dateStart
										? new Date(workOrder.dateStart)
										: new Date()
								}
								mode="date"
								display="default"
								onChange={(event, selectedDate) => {
									setShowStartPicker(false);
									if (selectedDate <= new Date(workOrder.dateEnd)) {
										setWorkOrder((prevState) => ({
											...prevState,
											dateStart: selectedDate?.toISOString(),
										}));
									} else {
										alert("Start date cannot be after end date");
									}
								}}
							/>
						)}

						<TouchableOpacity
							style={styles.text}
							onPress={() => setShowStartPicker(true)}
						>
							<View style={{ flexDirection: "row", marginTop: 5 }}>
								<Text className="flex font-psemibold text-black mr-3">
									Start Date:{" "}
								</Text>
								<Text className="flex font-psemi text-black mr-3">
									{workOrder.dateStart
										? new Date(workOrder.dateStart).toLocaleDateString()
										: "Not selected"}
								</Text>
								<Image
									source={icons.calendar}
									className="w-6 h-6"
									resizeMode="contain"
								/>
							</View>
						</TouchableOpacity>

						{showEndPicker && (
							<DateTimePicker
								value={
									workOrder.dateEnd ? new Date(workOrder.dateEnd) : new Date()
								}
								mode="date"
								display="default"
								onChange={(event, selectedDate) => {
									setShowEndPicker(false);
									if (selectedDate >= new Date(workOrder.dateStart)) {
										setWorkOrder((prevState) => ({
											...prevState,
											dateEnd: selectedDate?.toISOString(),
										}));
									} else {
										alert("End date cannot be before start date");
									}
								}}
							/>
						)}

						<TouchableOpacity
							style={styles.text}
							onPress={() => setShowEndPicker(true)}
						>
							<View style={{ flexDirection: "row", marginTop: 5 }}>
								<Text className="flex font-psemibold text-black mr-5">
									End Date:{" "}
								</Text>
								<Text className="flex font-psemi text-black mr-3">
									{workOrder.dateEnd
										? new Date(workOrder.dateEnd).toLocaleDateString()
										: "Not selected"}
								</Text>
								<Image
									source={icons.calendar}
									className="w-6 h-6"
									resizeMode="contain"
								/>
							</View>
						</TouchableOpacity>
					</Card>

					<View>
						{workOrderDetails.map((detail, index) => (
							<Card key={index} style={styles.card}>
								<Text className="flex font-psemibold text-orange-500">
									Detail {index + 1}
								</Text>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Text className="flex font-psemibold text-black mr-24">
										Actual Production:
									</Text>
									<TextInput
										style={{ fontSize: 14 }}
										value={String(detail.actualProduction)}
										onChangeText={(text) => {
											const newDetails = [...workOrderDetails];
											newDetails[index].actualProduction = Number(text);
											setWorkOrderDetails(newDetails);
										}}
									/>
								</View>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Text className="flex font-psemibold text-black mr-14">
										Actual Production Price:
									</Text>
									<TextInput
										style={{ fontSize: 14 }}
										value={String(detail.actualProductionPrice)}
										onChangeText={(text) => {
											const newDetails = [...workOrderDetails];
											newDetails[index].actualProductionPrice = Number(text);
											setWorkOrderDetails(newDetails);
										}}
									/>
								</View>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Text className="flex font-psemibold text-black mr-20">
										Faulty Product Price:
									</Text>
									<TextInput
										style={{ fontSize: 14 }}
										value={String(detail.faultyProductPrice)}
										onChangeText={(text) => {
											const newDetails = [...workOrderDetails];
											newDetails[index].faultyProductPrice = Number(text);
											setWorkOrderDetails(newDetails);
										}}
									/>
								</View>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Text className="flex font-psemibold text-black mr-28">
										Faulty Products:
									</Text>
									<TextInput
										style={{ fontSize: 14 }}
										value={String(detail.faultyProducts)}
										onChangeText={(text) => {
											const newDetails = [...workOrderDetails];
											newDetails[index].faultyProducts = Number(text);
											setWorkOrderDetails(newDetails);
										}}
									/>
								</View>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Text className="flex font-psemibold text-black mr-1">
										Master Production Schedule ID:
									</Text>
									<TextInput
										style={{ fontSize: 14 }}
										value={String(detail.masterProductionScheduleId)}
										onChangeText={(text) => {
											const newDetails = [...workOrderDetails];
											newDetails[index].masterProductionScheduleId =
												Number(text);
											setWorkOrderDetails(newDetails);
										}}
									/>
								</View>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Text className="flex font-psemibold text-black mr-5 ">
										Note:
									</Text>
									<TextInput
										style={{ fontSize: 14 }}
										value={detail.note}
										onChangeText={(text) => {
											const newDetails = [...workOrderDetails];
											newDetails[index].note = text;
											setWorkOrderDetails(newDetails);
										}}
									/>
								</View>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<Text className="flex font-psemibold text-black mr-20">
										Projected Production:
									</Text>
									<TextInput
										style={{ fontSize: 14 }}
										value={String(detail.projectedProduction)}
										onChangeText={(text) => {
											const newDetails = [...workOrderDetails];
											newDetails[index].projectedProduction = Number(text);
											setWorkOrderDetails(newDetails);
										}}
									/>
								</View>
							</Card>
						))}
					</View>
				</ScrollView>
			</View>

			<CustomButton
              	icon={"plus"}
            	iconSize={28}
              	containerStyles="p-0 absolute bottom-28 self-end right-4 h-12 w-12 rounded-full bg-green-500 items-center justify-center"
              	isLoading={false}
              	handlePress={() =>
					setWorkOrderDetails((prevState) => [
						...prevState,
						{
							workOrderId: id,
							masterProductionScheduleId: "",
							note: "",
							projectedProduction: "",
							actualProduction: 0,
							faultyProducts: 0,
							actualProductionPrice: 0,
							faultyProductPrice: 0,
						},])}
            />

			<View style={styles.buttonContainer}>
				<IconButton
					onPress={() => navigation.navigate("WorkOrderPage")}
					iconName="arrow-left"
				/>
				<IconButton
					onPress={() => setConfirmationModalVisible(true)}
					iconName="trash"
				/>
				<IconButton onPress={handleSave} iconName="save" />
			</View>
			{loading ? <AppLoader /> : null}
			<AlertWithTwoOptions
				visible={confirmationModalVisible}
				message="Are you sure?"
				onYesPress={() => {
					setConfirmationModalVisible(false);
					handleDelete();
				}}
				onNoPress={() => setConfirmationModalVisible(false)}
			/>
			<ToastMessage type={"success"} ref={successToastRef}></ToastMessage>

			<ToastMessage type="danger" ref={errorToastRef} />
		</View>
	);
};

const styles = StyleSheet.create({
	dropDownContainer: {
		height: 45, 
		width: "45%",
		zIndex: 2000,
	},
	dropDown: {
		backgroundColor: "#FFA500",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		position: "absolute",
		bottom: 15,
		width: "100%",
	},
	scrollView: {
		padding: 10, // Add padding around the ScrollView
		maxHeight: 100, // Adjust this value as needed
		borderColor: "gray", // Change this to the desired border color
		borderWidth: 1, // Change this to the desired border width
	},
	itemContainer: {
		padding: 10, // Add padding to each item
		height: 50, // Set a fixed height for each item
	},
	mainContent: {
		margin: 10,
	},
	card: {
		margin: 7, // Add margin around the Card
		padding: 10, // Add padding inside the Card
		backgroundColor: "#f8f8f8", // Change the background color of the Card
		borderRadius: 10, // Add rounded corners to the Card
	},
	text: {
		marginBottom: 10,
		marginVertical: 10, // Add margin below each Text element
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	column: {
		flex: 1,
		fontSize: 12, // Adjust your text size here
	},
	backgroundColor: {
		backgroundColor: "#161622",
		flex: 1,
	},
	header: {
		flexDirection: "row",
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#e1e1e1",
		backgroundColor: "#ff9c01",
	},
});

export default WorkOrderAC;
