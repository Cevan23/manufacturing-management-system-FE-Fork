import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { creatWorkOrder } from "../../../services/WorkOrderServices";
import { createWorkOrderDetail, sumProjectedProductionByMPS } from "../../../services/WorkOrderDetailServices";
import { getAllMPS } from "../../../services/MPSServices";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Card, Title } from "react-native-paper";
import IconButton from "../../../components/IconButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { icons } from "../../../constants";
import AppLoader from "../../../components/AppLoader";
import ToastMessage from "../../../components/ToastMessage";
import CustomButton from ".../../../components/CustomButton";
import FormField from "../../../components/FormField";
import CustomAlert from "../../../components/CustomAlert";

// Create Work Order page for Product Manager
// Author: Pham Van Cao
const CreateWorkOrder = () => {
	const [loading, setLoading] = useState(true);
	const successToastRef = useRef(null);
	const errorToastRef = useRef(null);
	const { token, userId } = useGlobalContext();
	const navigation = useNavigation();
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);
	const [workOrder, setWorkOrder] = useState({
		productManagerID: userId,
		dateStart: new Date(),
		dateEnd: new Date(),
		workOrderStatus: "pending",
	});
	const [mps, setMPS] = useState([]);
	const [selectedId, setSelectedId] = useState(null);
	const [workOrderDetails, setWorkOrderDetails] = useState([]);
	const [detail, setDetail] = useState({
		workOrderId: null,
		masterProductionScheduleId: null,
		note: "",
		projectedProduction: null,
		actualProduction: null,
		faultyProducts: null,
		actualProductionPrice: null,
		faultyProductPrice: null,
	});
	const [items, setItems] = useState([
		{ label: "Pending", value: "pending" },
		{ label: "Processing", value: "processing" },
		{ label: "Finish", value: "PMcheck" },
	]);
	const initialLabel = items.find(
		(item) => item.value === workOrder.workOrderStatus
	)?.label;

	const [selectedValue, setSelectedValue] = useState(initialLabel);
	const [selectedMps, setSelectedMps] = useState(null);
	const [sumProjectedProduction, setSumProjectedProduction] = useState(0);
	const [modalVisible, setModalVisible] = useState(false);
  	const [errorMessage, setErrorMessage] = useState("");
  	const [alertMessage1, setAlertMessage1] = useState("");
  	const [alertMessage2, setAlertMessage2] = useState("");

	// Fetch all MPS data
	// Author: Pham Van Cao
	useFocusEffect(
		React.useCallback(() => {
			const fetchData = async () => {
				setLoading(true);
				// Fetch all MPS data
				// Author: Pham Van Cao
				const mpsData = await getAllMPS(token);
				setMPS(mpsData.result);
				setLoading(false);
			};

			fetchData();
		}, [token, userId])
	);

	// Handle close modal
	// Author: Pham Hien Nhan
	const handleClose = () => {
		setModalVisible(false); 
	  };

	const handleSave = async () => {
		console.log('mps', mps);
		try {
			setLoading(true);
			const WO = await creatWorkOrder(token, workOrder);
			if (WO && WO.result) {
				const WOID = WO.result;
				console.log("WOID: ", WOID);
				const newWorkOrderDetails = workOrderDetails.map((detail) => ({
					...detail,
					workOrderId: WOID,
				}));

				setWorkOrderDetails(newWorkOrderDetails);
				console.log(newWorkOrderDetails);
				const WODetail = await createWorkOrderDetail(
					token,
					newWorkOrderDetails
				);
				console.log(WODetail);
				if (successToastRef.current) {
					successToastRef.current.show({
						type: "success",
						text: "Success",
						description: "MPS created successfully!",
					});
				}
				const timer = setTimeout(() => {
					navigation.navigate("WorkOrderHome");
				}, 4000);
			} else {
				if (errorToastRef.current) {
					errorToastRef.current.show({
						type: "danger",
						text: "Error",
						description:
							"API call failed, WO or WO.result is null or undefined!",
					});
				}
			}
		} catch (error) {
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
							onPress={ async () => {
								setSelectedMps(item);
								const result = await sumProjectedProductionByMPS(token, item.mpsID);
								setSumProjectedProduction(result.result);
								setWorkOrderDetails((prevDetails) => {
									if (prevDetails.length === 0) {
                                        // If there are no details yet, just return the previous state
                                        return prevDetails;
                                    }
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

			<View style={{ marginBottom: 10, backgroundColor: "#161622", }}>
				<ScrollView>
					<Card containerStyle={styles.card} style={{marginHorizontal:10, padding: 5}}>
						<Card.Title title={"Work Order"} titleStyle={styles.title} />
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
										if (errorToastRef.current) {
											errorToastRef.current.show({
												type: "danger",
												text: "Error",
												description: "Start date cannot be after end date!",
											});
										}
									}
								}}
							/>
						)}

						<TouchableOpacity
							style={styles.text}
							onPress={() => setShowStartPicker(true)}
						>
							<View style={{ flexDirection: "row", margin: 0 }}>
								<Text className="flex font-psemibold text-black mr-3 ml-5">
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
										if (errorToastRef.current) {
											errorToastRef.current.show({
												type: "danger",
												text: "Error",
												description: "End date cannot be before start date!",
											});
										}
									}
								}}
							/>
						)}

						<TouchableOpacity
							style={styles.text}
							onPress={() => setShowEndPicker(true)}
						>
							<View style={{ flexDirection: "row", margin: 0 }}>
								<Text className="flex font-psemibold text-black mr-5 ml-5">
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
						<View style={{ flexDirection: "row"}}>
							<Text className="flex font-psemibold text-black mr-5 ml-5">
								Status:
							</Text>
							<Text className="flex font-psemi text-black ml-5 mr-3">
								{workOrder.workOrderStatus}
							</Text>
						</View>
					</Card>
					<View className="flex flex-1 justify-center items-center">
						<Text style={styles.title}>
						Work Order Detail
						</Text>
					</View>
					
					{workOrderDetails.map((detail, index) => (
						<Card style={styles.card}>
						<View style={{ margin: 5 }}>
							<View key={index} style={{ margin: 0, backgroundColor: "#fff" }}>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Text className="flex font-psemibold text-black mr-20 ml-5">
										MPS ID:
									</Text>
									<Text className="flex font-psemi text-black mr-20">
										{detail.masterProductionScheduleId}
									</Text>
								</View>
								
								<FormField
            						title="Note"
            						placeholder={"Note"}
            						handleChangeText={(text) => {
										const newDetails = [...workOrderDetails];
										newDetails[index].note = text;
										setWorkOrderDetails(newDetails);
									}}
            						otherStyles="mt-3"
            						edit={true}
								/>

								<FormField
            						title={`Projected Production (Already planned in MPS: ${sumProjectedProduction})`}
            						placeholder={"Projected Production"}
            						handleChangeText={(text) => {
										if (selectedMps && parseInt(text) > selectedMps.quantity) {
											alert('Projected Production cannot be greater than MPS Quantity. Please enter a valid value.');
										} else {
											const newDetails = [...workOrderDetails];
											newDetails[index].projectedProduction = text;
											setWorkOrderDetails(newDetails);
										}
									}}
            						otherStyles="mt-3"
            						edit={true}
								/>
							</View>
						</View>
						</Card>
					))}
					<View style={{ height: 200 }} />
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
						workOrderId: "",
						masterProductionScheduleId: "",
						note: "",
						projectedProduction: "",
						actualProduction: 0,
						faultyProducts: 0,
						actualProductionPrice: 0,
						faultyProductPrice: 0,
					},
				])}
            />

			<CustomAlert
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				title="Error"
				error={errorMessage}
				message1={alertMessage1}
				message2={alertMessage2}
				isSingleButton={modalVisible}
				onPressButton1={handleClose}
			/>

			<View style={styles.buttonContainer}>
				<IconButton
					onPress={() => navigation.navigate("WorkOrderHome")}
					iconName="arrow-left"
				/>
				<IconButton onPress={handleSave} iconName="save" />
			</View>
			{loading ? <AppLoader /> : null}
			<ToastMessage type={"success"} ref={successToastRef}></ToastMessage>

			<ToastMessage type="danger" ref={errorToastRef} />
		</View>
	);
};

const styles = StyleSheet.create({
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
		flex: 1,
		margin: 10, // Add margin around the Card
		padding: 10, // Add padding inside the Card
		backgroundColor: "#fff", // Change the background color of the Card
		borderRadius: 10, // Add rounded corners to the Card
	},
	text: {
		marginBottom: 10, // Add margin below each Text element
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	column: {
		flex: 1,
		fontSize: 12, // Adjust your text size here
	},
	header: {
		flexDirection: "row",
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#e1e1e1",
		backgroundColor: "#ff9c01",
	},
	title: {
		color: "#FFA500",
		fontSize: 20,
		fontWeight: "bold",
		margin: 4,
	},
});

export default CreateWorkOrder;
