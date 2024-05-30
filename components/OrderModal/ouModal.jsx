import React, { useState, useEffect } from "react";
import DD from "../DD";
import DateTimePicker from "@react-native-community/datetimepicker";
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Platform } from "react-native";

const dropdownItems = [
	{ label: "PENDING", value: "PENDING" },
	{ label: "PROCESSING", value: "PROCESSING" },
	{ label: "DONE", value: "DONE" },
];

// Order update modal component
// Author: Nguyen Cao Nhan
const OUModal = ({
	initialDateStart,
	initialDateEnd,
	initialOrderStatus,
	visible,
	onSavePress,
	onClose,
}) => {
	const [orderStatus, setOrderStatus] = useState("");
	const [dateStart, setDateStart] = useState(new Date());
	const [dateEnd, setDateEnd] = useState(new Date());
	const [showEndDatePicker, setShowEndDatePicker] = useState(false);
	const [showStartDatePicker, setShowStartDatePicker] = useState(false);

	useEffect(() => {
		if (visible) {
			setDateStart(initialDateStart ? new Date(initialDateStart) : new Date());
			setOrderStatus(initialOrderStatus.toString());
			setDateEnd(initialDateEnd ? new Date(initialDateEnd) : new Date());
		}
	}, [visible, initialDateStart, initialDateEnd, initialOrderStatus]);

	// Handle end date selection
	const handleEndDateSelect = (event, selectedDate) => {
		const currentDate = selectedDate || dateEnd;
		setShowEndDatePicker(Platform.OS === "ios");
		setDateEnd(currentDate);
	};

	// Handle start date selection
	const handleStartDateSelect = (event, selectedDate) => {
		const currentDate = selectedDate || dateEnd;
		setShowStartDatePicker(Platform.OS === "ios");
		setDateStart(currentDate);
	};

	// Handle save button press
	const handleSave = () => {
		onSavePress(dateStart.toISOString(), dateEnd.toISOString(), orderStatus);
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
					<DD
						title="Order Status"
						value={orderStatus}
						placeholder="Choose order status"
						setValue={setOrderStatus}
						items={dropdownItems}
					/>
					<Text style={styles.label}>Select Start Date:</Text>
					<TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
						<TextInput
							style={styles.input}
							editable={false}
							value={dateStart.toDateString()}
						/>
					</TouchableOpacity>
					{showStartDatePicker && (
						<DateTimePicker
							testID="dateTimePicker"
							value={dateStart}
							mode="date"
							is24Hour={true}
							display="default"
							onChange={handleStartDateSelect}
						/>
					)}
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

// Styles of order update modal component
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

export default OUModal;
