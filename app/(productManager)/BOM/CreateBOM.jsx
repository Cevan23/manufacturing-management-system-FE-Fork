import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../../../components/IconButton";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Picker } from "@react-native-picker/picker";
import { Card, Title, Paragraph, List, DataTable } from "react-native-paper";
import BOMDetail from "./BOMDetail";
import { createBOM } from "../../../services/BOMServices";
import FormField from "../../../components/FormField";
import AppLoader from "../../../components/AppLoader";
import ToastMessage from "../../../components/ToastMessage";

// Create BOM page
// Author: Pham Van Cao
function CreateBOM({ route }) {
	const navigation = useNavigation();
	const { token, userId } = useGlobalContext();
	const [bomDetail, setBomDetail] = useState({
		productManagerId: null,
		BOMName: "",
		BOMStatus: "PENDING",
		timeProduction: null,
		unit: "g",
		totalPrice: null,
		sellPrice: null,
		dateCreation: new Date().toISOString().split('T')[0],
		bomDetails: [],
	});
	const [materials, setMaterials] = useState([]);
	const [newMaterialName, setNewMaterialName] = useState("");
	const [newMaterialUnit, setNewMaterialUnit] = useState("");
	const [newMaterialPrice, setNewMaterialPrice] = useState("");
	const [newMaterialQuantity, setNewMaterialQuantity] = useState("");
	const [tempDeletedMaterials, setTempDeletedMaterials] = useState([]);
	const [loading, setLoading] = useState(false);
	const successToastRef = useRef(null);
	const errorToastRef = useRef(null);

	// Set the default unit to "g" when the component mounts
	useEffect(() => {
		setNewMaterialUnit("g");
	}, []);

	// Create the request body for the createBOM API
	// Author: Pham Van Cao
	const createRequestBody = (bomDetail) => {
		const requestBody = {
			productManagerId: userId,
			BOMName: bomDetail.BOMName,
			BOMStatus: bomDetail.BOMStatus,
			timeProduction: parseFloat(bomDetail.timeProduction),
			unit: bomDetail.unit,
			totalPrice: parseFloat(bomDetail.totalPrice),
			sellPrice: parseFloat(bomDetail.sellPrice),
			bomDetails: bomDetail.bomDetails.map((detail) => ({
				BOMId: detail.BOMId || 0, // default value if null
				material: {
					materialName: detail.material.materialName,
					materialUnit: detail.material.materialUnit,
					materialPrice: parseFloat(detail.material.materialPrice),
					materialVolume: parseFloat(detail.material.materialVolume) || 0,
				},
				quantity: parseInt(detail.quantity, 10),
				totalUnitPrice: parseFloat(detail.totalUnitPrice) || 0, // default value if null
			})),
		};

		return requestBody;
	};

	// Handle deleting a material from the BOM
	// Author: Pham Van Cao
	const handleDeleteMaterial = (index) => {
		Alert.alert(
			"Delete Material",
			"Are you sure you want to delete this material?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "OK",
					onPress: () => {
						// Remove the material from the bomDetail.bomDetails array
						setBomDetail((prevState) => ({...prevState, bomDetails: prevState.bomDetails.filter((i) => i !== index
							),}));
					},
				},
			]
		);
	};

	// Handle input change for the BOM details
	// Author: Pham Van Cao
	const handleInputChange = (name, value) => {
		setBomDetail((prevState) => ({ ...prevState, [name]: value }));
		console.log("BOMUpdate: ", BOMDetail);
	};

	// Handle saving the BOM
	// Author: Pham Van Cao
	const handleSave = async () => {
		try {
			setLoading(true);
			// Create the request body
			// Author: Pham Van Cao
			const requestBody = createRequestBody(bomDetail);
			console.log("requestBody:", requestBody);

			// Create the new BOM
			// Author: Pham Van Cao
			const res = await createBOM(token, requestBody);
			if (res.result === null) {
				if (successToastRef.current) {
					successToastRef.current.show({
						type: "success",
						text: "Success",
						description: "BOM saved successfully!",
					});
				}
			} else {
				throw new Error("Failed to save BOM!");
			}
		} catch (error) {
			if (errorToastRef.current) {
				errorToastRef.current.show({
					type: "danger",
					text: "Error",
					description: error.message,
				});
			}
		} finally {
			setLoading(false);
		}

		setTempDeletedMaterials([]);
	};

	// Handle adding a new material to the BOM
	// Author: Pham Van Cao
	const handleAddMaterial = () => {
		console.log("newMaterialName:", newMaterialName);
		console.log("newMaterialPrice:", newMaterialPrice);
		console.log("newMaterialQuantity:", newMaterialQuantity);

		if (!newMaterialName || !newMaterialPrice || !newMaterialQuantity) {
			errorToastRef.current.show({
				type: "danger",
				text: "Error",
				description: "All fields must be filled out to add a new material.",
			});
			return;
		}

		const newMaterial = {
			materialId: Date.now(),
			BOMId: null, // You can replace this with the appropriate value
			material: {
				materialName: newMaterialName,
				materialUnit: newMaterialUnit,
				materialPrice: newMaterialPrice,
				materialVolume: 0,
			},
			quantity: newMaterialQuantity, // You can replace this with the appropriate value
			totalUnitPrice: newMaterialPrice * newMaterialQuantity,
		};

		// setMaterials([...materials, newMaterial]);
		setBomDetail((prevState) => ({
			...prevState,
			bomDetails: [...prevState.bomDetails, newMaterial],
			totalPrice: prevState.totalPrice ? prevState.totalPrice + newMaterial.totalUnitPrice : newMaterial.totalUnitPrice,
		}));

		console.log("materials: ", materials);
		// Clear the input fields
		setNewMaterialName("");
		setNewMaterialPrice("");
		setNewMaterialQuantity("");
	};

	return (
		<View className="bg-primary h-full" style={{ flex: 1 }}>
			<View>
				<FlatList
					style={{ marginBottom: 60 }}
					ListHeaderComponent={
						<>
							<Card style={styles.cardFirstContainer}>
								<Card.Title
									title={"Product Manager"}
									titleStyle={styles.cardFirstTitle}
								/>
								<Card.Content>
									<FormField
										title="BOM Name"
										placeholder={bomDetail.BOMName ? bomDetail.BOMName : ""}
										value={bomDetail.BOMName}
										handleChangeText={(text) =>
											setBomDetail((prevState) => ({
												...prevState,
												BOMName: text,
											}))
										}
										otherStyles="mt-2"
										edit={true}
									/>
								</Card.Content>
							</Card>

							<Card style={styles.cardSecondContainer}>
								<Card.Content>
									<FormField
										title="Time production"
										placeholder={
											bomDetail.timeProduction
												? bomDetail.timeProduction.toString()
												: ""
										}
										value={
											bomDetail.timeProduction
												? bomDetail.timeProduction.toString()
												: ""
										}
										handleChangeText={(value) =>
											handleInputChange("timeProduction", value)
										}
										otherStyles="mt-2"
										edit={true}
									/>

									<FormField
										title="Total price"
										placeholder={
											bomDetail.totalPrice
												? bomDetail.totalPrice.toString()
												: ""
										}
										value={
											bomDetail.totalPrice
												? bomDetail.totalPrice.toString()
												: ""
										}
										handleChangeText={(value) =>
											handleInputChange("totalPrice", value)
										}
										otherStyles="mt-2"
										edit={true}
									/>

									<FormField
										title="Sell price"
										placeholder={
											bomDetail.sellPrice ? bomDetail.sellPrice.toString() : ""
										}
										value={
											bomDetail.sellPrice ? bomDetail.sellPrice.toString() : ""
										}
										handleChangeText={(value) =>
											handleInputChange("sellPrice", value)
										}
										otherStyles="mt-2"
										edit={true}
									/>

									<FormField
										title="Date creation"
										placeholder={bomDetail.dateCreation ? bomDetail.dateCreation.toString()
												: ""
										}
										value={
											bomDetail.dateCreation
												? bomDetail.dateCreation.toString()
												: ""
										}
										otherStyles="mt-2"
										edit={false}
									/>
								</Card.Content>
							</Card>

							<Card style={styles.cardSecondContainer}>
								<Card.Content>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											flex: 1,
										}}
									>
										<Title>Unit:</Title>
										<Picker
											selectedValue={bomDetail.unit}
											onValueChange={(itemValue) =>
												setBomDetail((prevState) => ({
													...prevState,
													unit: itemValue,
												}))
											}
											style={{ flex: 1 }}
										>
											<Picker.Item label="g" value="g" />
											<Picker.Item label="kg" value="kg" />
											<Picker.Item label="amount" value="amount" />
											<Picker.Item label="meter" value="meter" />
											<Picker.Item label="liter" value="liter" />
										</Picker>
									</View>

									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											flex: 1,
										}}
									>
										<Title>Status:</Title>
										<Picker
											selectedValue={bomDetail.BOMStatus}
											onValueChange={(itemValue) =>
												setBomDetail((prevState) => ({
													...prevState,
													BOMStatus: itemValue,
												}))
											}
											style={{ flex: 1 }}
										>
											<Picker.Item label="Pending" value="PENDING" />
											<Picker.Item label="Check Price" value="CHECK_PRICE" />
											<Picker.Item label="Finish" value="FINISH" />
										</Picker>
									</View>
								</Card.Content>
							</Card>

							<Card style={styles.cardFourthContainer}>
								<Card.Content>
									<DataTable>
										<DataTable.Header>
											<DataTable.Title>
												<View style={{ flex: 2 }}>
													<Text>Material</Text>
												</View>
											</DataTable.Title>
											<DataTable.Title>
												<View style={{ flex: 4 }}>
													<Text>Unit</Text>
												</View>
											</DataTable.Title>
											<DataTable.Title>
												<View style={{ flex: 3 }}>
													<Text>Price</Text>
												</View>
											</DataTable.Title>
											<DataTable.Title>
												<View style={{ flex: 2 }}>
													<Text>Quantity</Text>
												</View>
											</DataTable.Title>
										</DataTable.Header>

										{Array.isArray(bomDetail.bomDetails) &&
											bomDetail.bomDetails.length > 0 &&
											bomDetail.bomDetails.map((item, index) => (
												<DataTable.Row key={index}>
													<DataTable.Cell>
														<View style={{ flex: 2 }}>
															<Text>{item.material.materialName}</Text>
														</View>
													</DataTable.Cell>
													<DataTable.Cell>
														<View style={{ flex: 4 }}>
															<Text>{item.material.materialUnit}</Text>
														</View>
													</DataTable.Cell>
													<DataTable.Cell>
														<View style={{ flex: 3 }}>
															<Text>{item.material.materialPrice}</Text>
														</View>
													</DataTable.Cell>
													<DataTable.Cell>
														<View style={{ flex: 2 }}>
															<Text>{item.quantity}</Text>
														</View>
													</DataTable.Cell>
													<DataTable.Cell>
														<View style={{ flex: 0.1 }}>
															<IconButton
																iconName="trash"
																onPress={() => handleDeleteMaterial(index)}
															/>
														</View>
													</DataTable.Cell>
												</DataTable.Row>
											))}

										<DataTable.Row>
											<DataTable.Cell>
												<View style={{ flex: 2 }}>
													<TextInput
														placeholder="Material"
														value={newMaterialName}
														onChangeText={setNewMaterialName}
													/>
												</View>
											</DataTable.Cell>
											<DataTable.Cell style={{ flex: 2 }}>
												<View style={{ flex: 1 }}>
													<Picker
														selectedValue={newMaterialUnit}
														onValueChange={setNewMaterialUnit}
														style={{ flex: 1 }}
													>
														<Picker.Item label="g" value="g" />
														<Picker.Item label="kg" value="kg" />
														<Picker.Item label="amount" value="amount" />
														<Picker.Item label="meter" value="meter" />
														<Picker.Item label="liter" value="liter" />
													</Picker>
												</View>
											</DataTable.Cell>
											<DataTable.Cell>
												<View style={{ flex: 3 }}>
													<TextInput
														placeholder="Price"
														value={newMaterialPrice}
														onChangeText={setNewMaterialPrice}
													/>
												</View>
											</DataTable.Cell>
											<DataTable.Cell>
												<View style={{ flex: 2 }}>
													<TextInput
														placeholder="Quantity"
														value={newMaterialQuantity}
														onChangeText={setNewMaterialQuantity}
													/>
												</View>
											</DataTable.Cell>
											<DataTable.Cell>
												<View style={{ flex: 0.1 }}>
													<IconButton
														iconName="plus"
														onPress={handleAddMaterial}
													/>
												</View>
											</DataTable.Cell>
										</DataTable.Row>
									</DataTable>
								</Card.Content>
							</Card>
						</>
					}
				/>
			</View>
			<View style={styles.buttonContainer}>
				<IconButton
					onPress={() => navigation.navigate("PMBOM")}
					iconName="arrow-left"
				/>
				<IconButton onPress={handleSave} iconName="save" />
			</View>
			{loading ? <AppLoader /> : null}
			<ToastMessage type={"success"} ref={successToastRef}></ToastMessage>

			<ToastMessage type="danger" ref={errorToastRef} />
		</View>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		position: "absolute",
		bottom: 15,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	cardFirstContainer: {
		padding: 5,
		margin: 10,
		backgroundColor: "#fff",
	},
	cardFirstTitle: {
		color: "#FFA500", // Orange color
		fontSize: 20, // Font size
		fontWeight: "bold", // Bold font
	},
	cardFirstInfo: {
		fontSize: 16,
		marginBottom: 5,
	},
	cardSecondContainer: {
		margin: 10,
		backgroundColor: "#fff",
	},
	cardFourthContainer: {
		flex: 1,
		margin: 10,
		backgroundColor: "#fff",
	},
});

export default CreateBOM;
