import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Card, Title, DataTable } from "react-native-paper";
import IconButton from "../../../components/IconButton";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { getBOMDetail, updateBOM, deleteBOM } from "../../../services/BOMServices";
import FormField from "../../../components/FormField";
import AlertWithTwoOptions from "../../../components/AlertWithTwoOptions";
import AppLoader from "../../../components/AppLoader";
import ToastMessage from "../../../components/ToastMessage";

// BOM Detail page
// Author: Pham Van Cao
function BOMDetail({ route }) {
	const navigation = useNavigation();
	const { token, userId } = useGlobalContext();
	const { id } = route.params;
	const [bomDetail, setBomDetail] = useState([]);
	const [unit, setUnit] = useState(bomDetail.unit);
	const [status, setStatus] = useState(bomDetail.bomstatus);
	const [materials, setMaterials] = useState(bomDetail.materials || []);
	const [newMaterialName, setNewMaterialName] = useState("");
	const [newMaterialUnit, setNewMaterialUnit] = useState("");
	const [newMaterialPrice, setNewMaterialPrice] = useState("");
	const [newMaterialQuantity, setNewMaterialQuantity] = useState("");
	const [tempDeletedMaterials, setTempDeletedMaterials] = useState([]);
	const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const successToastRef = useRef(null);
	const errorToastRef = useRef(null);

	// Set the default unit to "g"
	useEffect(() => {
		setNewMaterialUnit("g");
	}, []);

	// Fetch BOM detail
	// Author: Pham Van Cao
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Get BOM detail
				// Author: Pham Van Cao
				const data = await getBOMDetail(token, id);
				setBomDetail(data.result);
				setUnit(data.result.unit);
				setStatus(data.result.bomstatus);
				setMaterials(data.result.materials);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [token]);

	// Handle input change
	// Author: Pham Van Cao
	const handleInputChange = (name, value) => {
		setBomDetail((prevState) => ({ ...prevState, [name]: value }));
		console.log("BOMUpdate: ", bomDetail);
	};

	// Handle add material
	// Author: Pham Van Cao
	const handleAddMaterial = () => {
		if (!newMaterialName || !newMaterialPrice || !newMaterialQuantity) {
			errorToastRef.current.show({
				type: "danger",
				text: "Error",
				description: "All fields must be filled out to add a new material!",
			});
			return;
		}

		const newMaterial = {
			materialId: Date.now(),
			materialName: newMaterialName,
			materialUnit: newMaterialUnit,
			materialPrice: newMaterialPrice,
			materialQuantity: newMaterialQuantity,
			totalUnitPrice: newMaterialPrice * newMaterialQuantity,
		};

		setMaterials([...materials, newMaterial]);
		setBomDetail((prevState) => ({
			...prevState,
			materials: [...prevState.materials, newMaterial],
			totalPrice: prevState.totalPrice ? prevState.totalPrice + newMaterial.totalUnitPrice : newMaterial.totalUnitPrice,
		}));

		console.log("materials: ", materials);
		// Clear the input fields
		setNewMaterialName("");
		setNewMaterialUnit("");
		setNewMaterialPrice("");
		setNewMaterialQuantity("");
	};

	// Handle delete material
	// Author: Pham Van Cao
	const handleDeleteMaterial = (materialId) => {
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
						// Add the material to the tempDeletedMaterials state
						setTempDeletedMaterials([...tempDeletedMaterials, materialId]);
						// Remove the material from the materials array
						setMaterials(
							materials.filter((material) => material.materialId !== materialId)
						);

						// Remove the material from the bomDetail.materials array
						setBomDetail((prevState) => ({
							...prevState,
							materials: prevState.materials.filter(
								(material) => material.materialId !== materialId
							),
						}));
					},
				},
			]
		);
	};

	// Create BOM detail request body
	// Author: Pham Van Cao
	const createRequestBody = (bomDetail) => {
		const requestBody = {
			productManagerId: userId,
			BOMName: bomDetail.bomname,
			BOMStatus: status,
			timeProduction: bomDetail.timeProduction,
			unit: bomDetail.unit,
			totalPrice: bomDetail.totalPrice,
			sellPrice: bomDetail.sellPrice,
			bomDetails: bomDetail.materials.map((material) => ({
				material: {
					materialName: material.materialName,
					materialPrice: material.materialPrice,
					materialUnit: material.materialUnit,
					materialVolume: material.materialVolume,
				},
				quantity: material.materialQuantity,
				totalUnitPrice: material.materialPrice * material.materialQuantity,
			})),
		};

		return requestBody;
	};

	// Handle save
	// Author: Pham Van Cao
	const handleSave = async () => {
		try {
			// Create the request body
			// Author: Pham Van Cao
			const requestBody = createRequestBody(bomDetail);
			console.log("Request body: ", requestBody);

			// Update the BOM
			// Author: Pham Van Cao
			const updatedBOM = await updateBOM(token, id, requestBody);
			console.log("Updated BOM: ", updatedBOM);
			if (updatedBOM) {
				if (successToastRef.current) {
					successToastRef.current.show({
						type: "success",
						text: "Success",
						description: "BOM saved successfully!",
					});
				}
				setTimeout(() => {
					navigation.goBack();
				}, 3500);
			} else {
				if (errorToastRef.current) {
					errorToastRef.current.show({
						type: "danger",
						text: "Error",
						description: "Failed to save BOM",
					});
				}
			}
		} catch (error) {
			if (errorToastRef.current) {
				errorToastRef.current.show({
					type: "danger",
					text: "Error",
					description: "Failed to save BOM: ",
				});
			}
		}

		setTempDeletedMaterials([]);
	};

	// Handle delete
	// Author: Pham Van Cao
	const handleDelete = async () => {
		try {
			setLoading(true);
			// Delete the BOM
			const deletedBOM = await deleteBOM(token, id);
			if (successToastRef.current) {
				successToastRef.current.show({
					type: "success",
					text: "Success",
					description: "Delete BOM successfully!",
				});
			}
			setTimeout(() => {
				navigation.goBack();
			}, 3500);
		} catch (error) {
			console.log("Failed to delete BOM: ", error);
		} finally {
			setLoading(false);
		}
	};

	// Render the BOM detail
	// Author: Pham Van Cao
	if (!bomDetail) {
		return <Text>Loading...</Text>;
	}

	return (
		<View className="bg-primary h-full" style={{ flex: 1 }}>
			<View>
				<FlatList
					style={{ marginBottom: 60 }}
					ListHeaderComponent={
						<>
							<Card style={styles.cardFirstContainer}>
								<Card.Title
									title={"ID: " + bomDetail.id}
									titleStyle={styles.cardFirstTitle}
								/>
								<Card.Content>
									<Text style={styles.cardFirstInfo}>
										Role: Product Manager
									</Text>
									<Text style={styles.cardFirstInfo}>
										Full name: {bomDetail.productManager?.fullName}
									</Text>
									<Text style={styles.cardFirstInfo}>
										BOM Name: {bomDetail.bomname}
									</Text>
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
										placeholder={
											bomDetail.dateCreation
												? bomDetail.dateCreation.toString()
												: ""
										}
										value={
											bomDetail.dateCreation
												? bomDetail.dateCreation.toString()
												: ""
										}
										handleChangeText={(value) =>
											handleInputChange("dateCreation", value)
										}
										otherStyles="mt-2"
										edit={true}
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
											selectedValue={unit}
											onValueChange={(itemValue) => setUnit(itemValue)}
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
											selectedValue={status}
											onValueChange={(itemValue) => setStatus(itemValue)}
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
											<DataTable.Title style={{ flex: 2 }}>
												Material
											</DataTable.Title>
											<DataTable.Title style={{ flex: 1 }}>
												Unit
											</DataTable.Title>
											<DataTable.Title style={{ flex: 1 }}>
												Price
											</DataTable.Title>
											<DataTable.Title style={{ flex: 1 }}>
												Quantity
											</DataTable.Title>
											<DataTable.Title style={{ flex: 0.5 }}></DataTable.Title>
										</DataTable.Header>

										{Array.isArray(bomDetail.materials) &&
											bomDetail.materials.map((item, index) => (
												<DataTable.Row key={index}>
													<DataTable.Cell style={{ flex: 2 }}>
														{item.materialName}
													</DataTable.Cell>
													<DataTable.Cell style={{ flex: 1 }}>
														{item.materialUnit}
													</DataTable.Cell>
													<DataTable.Cell style={{ flex: 1 }}>
														{item.materialPrice}
													</DataTable.Cell>
													<DataTable.Cell style={{ flex: 1 }}>
														{item.materialQuantity}
													</DataTable.Cell>
													<DataTable.Cell style={{ flex: 0.5 }}>
														<IconButton
															iconName="trash"
															onPress={() =>
																handleDeleteMaterial(item.materialId)
															}
														/>
													</DataTable.Cell>
												</DataTable.Row>
											))}

										<DataTable.Row>
											<DataTable.Cell style={{ flex: 2 }}>
												<TextInput
													placeholder="Material"
													value={newMaterialName}
													onChangeText={setNewMaterialName}
												/>
											</DataTable.Cell>
											<DataTable.Cell style={{ flex: 1 }}>
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
											</DataTable.Cell>
											<DataTable.Cell style={{ flex: 1 }}>
												<TextInput
													placeholder="Price"
													value={newMaterialPrice}
													onChangeText={setNewMaterialPrice}
												/>
											</DataTable.Cell>
											<DataTable.Cell style={{ flex: 1 }}>
												<TextInput
													placeholder="Quantity"
													value={newMaterialQuantity}
													onChangeText={setNewMaterialQuantity}
												/>
											</DataTable.Cell>
											<DataTable.Cell style={{ flex: 0.5 }}>
												<IconButton
													iconName="plus"
													onPress={handleAddMaterial}
												/>
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
				<IconButton
					onPress={() => {
						setConfirmationModalVisible(true);
					}}
					iconName="trash"
				/>
			</View>
			<AlertWithTwoOptions
				visible={confirmationModalVisible}
				message="Are you sure?"
				onYesPress={() => {
					handleDelete();
					setConfirmationModalVisible(false);
				}}
				onNoPress={() => setConfirmationModalVisible(false)}
			/>
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

export default BOMDetail;
