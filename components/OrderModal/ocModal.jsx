import React, { useState, useEffect } from "react";
import DD from "../DD";
import DateTimePicker from "@react-native-community/datetimepicker";
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Platform } from "react-native";

const dropdownItems = [
	{ label: "PO", value: "PO" },
	{ label: "SO", value: "SO" },
];

// Order creation modal component
// Author: Nguyen Cao Nhan
const OCModal = ({
	initialName,
	initialContact,
	initialKindOrder,
	visible,
	onSavePress,
	onClose,
}) => {
	const [name, setName] = useState("");
	const [contact, setContact] = useState("");
	const [kindOrder, setKindOrder] = useState("");
	const [dateEnd, setDateEnd] = useState(new Date());
	const [showEndDatePicker, setShowEndDatePicker] = useState(false);

	useEffect(() => {
		if (visible) {
			setName(initialName.toString());
			setContact(initialContact.toString());
			setKindOrder(initialKindOrder.toString());
			setDateEnd(new Date());
		}
	}, [visible, initialName, initialContact, initialKindOrder]);

	// Handle end date selection
	const handleEndDateSelect = (event, selectedDate) => {
		const currentDate = selectedDate || dateEnd;
		setShowEndDatePicker(Platform.OS === "ios");
		setDateEnd(currentDate);
	};

	// Handle save button press
	const handleSave = () => {
		onSavePress(dateEnd.toISOString(), name, contact, kindOrder);
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			onRequestClose={onClose}
			transparent={true}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.label}>Name Customer:</Text>
					<TextInput style={styles.input} value={name} onChangeText={setName} />
					<Text style={styles.label}>Contact:</Text>
					<TextInput
						style={styles.input}
						value={contact}
						onChangeText={setContact}
					/>
					<DD
						title="Kind Order"
						value={kindOrder}
						placeholder="Choose kind order"
						setValue={setKindOrder}
						items={dropdownItems}
					/>
					<Text style={styles.label}>Select End Date:</Text>
					<TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
						<TextInput
							style={styles.input}
							editable={false}
							value={dateEnd.toDateString()}
						/>
					</TouchableOpacity>
					{showEndDatePicker && (
						<DateTimePicker
							testID="dateTimePicker"
							value={dateEnd}
							mode="date"
							is24Hour={true}
							display="default"
							onChange={handleEndDateSelect}
						/>
					)}
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							onPress={handleSave}
							style={[styles.button, { backgroundColor: "rgb(34, 197, 94)" }]}
						>
							<Text style={styles.buttonText}>Save</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={onClose}
							style={[styles.button, { backgroundColor: "rgb(239, 68, 68)" }]}
						>
							<Text style={styles.buttonText}>Exit</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

// Styles of order creation modal component
const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "#161622",
		padding: 20,
		width: "80%",
		borderRadius: 10,
	},
	label: {
		color: "#ff9c01",
		marginBottom: 5,
	},
	input: {
		borderWidth: 1,
		borderColor: "#fff",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
		color: "#fff",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
	button: {
		padding: 10,
		borderRadius: 5,
		flex: 1,
		marginHorizontal: 5,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});

export default OCModal;
