import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// Sale forecast modal component
// Author: Nguyen Cao Nhan
const SFModal = ({
	initialStartDate,
	initialEndDate,
	onSelectStartDate,
	onSelectEndDate,
	visible,
	onSavePress,
	onClose,
}) => {
	const [startDate, setStartDate] = useState(new Date(initialStartDate));
	const [endDate, setEndDate] = useState(new Date(initialEndDate));
	const [showStartDatePicker, setShowStartDatePicker] = useState(false);
	const [showEndDatePicker, setShowEndDatePicker] = useState(false);

	useEffect(() => {
		setStartDate(new Date(initialStartDate));
		setEndDate(new Date(initialEndDate));
	}, [initialStartDate, initialEndDate]);

	// Handle start date selection
	const handleStartDateSelect = (event, selectedDate) => {
		const currentDate = selectedDate || startDate;
		setShowStartDatePicker(Platform.OS === "ios");
		setStartDate(currentDate);
		onSelectStartDate(currentDate);
	};

	// Handle end date selection
	const handleEndDateSelect = (event, selectedDate) => {
		const currentDate = selectedDate || endDate;
		setShowEndDatePicker(Platform.OS === "ios");
		setEndDate(currentDate);
		onSelectEndDate(currentDate);
	};

	// Handle save button press
	const handleSave = () => {
		onSavePress(startDate, endDate);
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
					<Text className="text-[#ff9c01] font-bold">Select Start Date:</Text>
					<TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
						<TextInput
							style={styles.input}
							editable={false}
							value={startDate.toDateString()}
						/>
					</TouchableOpacity>
					{showStartDatePicker && (
						<DateTimePicker
							testID="dateTimePicker"
							value={startDate}
							mode="date"
							is24Hour={true}
							display="default"
							onChange={handleStartDateSelect}
						/>
					)}
					<Text className="text-[#ff9c01] font-bold">Select End Date:</Text>
					<TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
						<TextInput
							style={styles.input}
							editable={false}
							value={endDate.toDateString()}
						/>
					</TouchableOpacity>
					{showEndDatePicker && (
						<DateTimePicker
							testID="dateTimePicker"
							value={endDate}
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
							<Text className="text-white font-bold text-center">Save</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={onClose}
							style={[styles.button, { backgroundColor: "rgb(239, 68, 68)" }]}
						>
							<Text className="text-white font-bold text-center">Exit</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

// Styles of sale forecast modal component
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
	input: {
		borderBottomWidth: 1,
		padding: 5,
		marginVertical: 10,
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
	},
});

export default SFModal;
