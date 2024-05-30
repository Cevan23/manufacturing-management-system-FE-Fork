import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

// Drop down field component
// Author: Pham Hien Nhan
const DropDownField = ({
	title,
	value,
	setValue,
	items,
	placeholder,
	edit,
}) => {
	const [open, setOpen] = useState(false);
	const [disable, setDisable] = useState(true);

	useEffect(() => {
		if (edit === false) {
			setOpen(false);
			setDisable(true);
		} else {
			setDisable(false);
		}
	}, [edit]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			<View style={[styles.dropdownContainer, open && styles.dropdownOpen]}>
				<DropDownPicker
					disabled={disable}
					setDisabled={setDisable}
					open={open}
					setOpen={setOpen}
					value={value}
					items={items}
					setValue={setValue}
					placeholder={placeholder}
					placeholderStyle={styles.placeholderStyle}
					style={styles.picker}
					dropDownContainerStyle={styles.dropDownContainer}
					textStyle={styles.textStyle}
					arrowIconStyle={styles.arrowIconStyle}
					labelStyle={styles.labelStyle}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 18,
	},
	title: {
		textAlign: "left",
		fontSize: 16,
		color: "#fff",
		marginBottom: 8,
	},
	dropdownContainer: {
		width: "100%",
		backgroundColor: "#000",
		borderRadius: 16,
		borderColor: "#2c2c34",
		borderWidth: 2,
		zIndex: 1000, // Ensure the zIndex is high enough
	},
	dropdownOpen: {
		zIndex: 2000, // Increase zIndex when dropdown is open
	},
	placeholderStyle: {
		color: "#7B7B8B",
	},
	picker: {
		width: "100%",
		backgroundColor: "#000",
		borderColor: "#2c2c34",
		height: 64,
		borderRadius: 16,
	},
	dropDownContainer: {
		backgroundColor: "#2c2c34",
		borderColor: "#2c2c34",
		zIndex: 2000,
	},
	textStyle: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 17,
		paddingHorizontal: 5,
	},
	arrowIconStyle: {
		tintColor: "#fff",
	},
	labelStyle: {
		color: "#fff",
	},
});

export default DropDownField;
