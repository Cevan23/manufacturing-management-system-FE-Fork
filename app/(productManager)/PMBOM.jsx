import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { getAllBOMs, getBOMsByStatus } from "../../services/BOMServices";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Card } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { CustomButton } from "../../components";

// Bill of Materials page 
// Author: Pham Van Cao
const PMBOM = () => {
	const [loading, setLoading] = useState(true);
	const successToastRef = useRef(null);
	const errorToastRef = useRef(null);
	const navigation = useNavigation();
	const { token, searchText } = useGlobalContext();
	const [boms, setBoms] = useState([]);
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [items, setItems] = useState([
		{ label: "Pending", value: "PENDING" },
		{ label: "Check Price", value: "CHECK_PRICE" },
		{ label: "Finish", value: "FINISH" },
	]);

	// Filter searched data by BOM name
	// Author: Pham Hien Nhan
	const getFilteredData = () => {
		if (searchText.trim() === "") {
			return boms;
		}
		return boms.filter((item) =>
			item.bomname.toLowerCase().includes(searchText.toLowerCase())
		);
	};

	const filteredData = getFilteredData();

	// Refetch data when focus
	// Author: Pham Van Cao
	useFocusEffect(
		React.useCallback(() => {
			setLoading(true);
			const fetchData = async () => {
				// Get all BOMs
				// Author: Pham Van Cao
				const data = await getAllBOMs(token);
				setBoms(data.result);
				setLoading(false);
			};
			fetchData();
		}, [token])
	);

	// Navigate to CreateBOM page
	// Author: Pham Van Cao
	const handleInsert = () => {
		try {
			navigation.navigate("CreateBOM");
		} catch (error) {
			console.error(error);
		}
	};

	// Navigate to BOMDetail page
	// Author: Pham Van Cao
	const handleCardPress = async (id) => {
		console.log(`Card with id ${id} was pressed.`);
		try {
			navigation.navigate("BOMDetail", { id });
		} catch (error) {
			console.error(error);
		}
	};

  return (
    <View className="bg-primary h-full" style={{ flex: 1 }}>
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
        onChangeValue={async (value) => {
          console.log('onChangeValue called with:', value);
          setValue(value);
          try {
            const data = await getBOMsByStatus(token, value);
            if (data) {
              console.log('data:', data.result);
              setBoms(data.result);
            }
          } catch (error) {
            console.error(error);
          }
        }}
      />
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => handleCardPress(item.id)}>
            <Card.Title title={item.bomname} titleStyle={styles.title} />
            <Card.Content style={styles.cardContent}>
              <Text style={styles.text}>Total Price: {item.totalPrice}</Text>
              <Text style={styles.text}>Sell Price: {item.sellPrice}</Text>
              <Text style={styles.text}>Date Creation: {item.dateCreation}</Text>
            </Card.Content>
          </Card>
        )}
      />
      <View>
        <CustomButton
          icon={"plus"}
          iconSize={28}
          containerStyles="p-0 absolute bottom-20 self-end right-4 h-12 w-12 rounded-full bg-green-500 items-center justify-center"
          isLoading={false}
          handlePress={handleInsert}
        />
      </View>
    </View>
  );
};

// Styles of PMBOM page
// Author: Pham Van Cao
const styles = StyleSheet.create({
	dropDownContainer: {
		height: 40,
		width: "37%",
		alignSelf: "flex-end",
		zIndex: 2000,
		marginEnd: 10,
		marginVertical: 5,
	},
	dropDown: {
		backgroundColor: "#FFA500",
	},
	card: {
		margin: 10,
		padding: 10,
	},
	title: {
		color: "#FFA500", // Orange color
		fontSize: 20, // Font size
		fontWeight: "bold", // Bold font
	},
	cardContent: {},
	text: {
		fontSize: 16,
		marginBottom: 5,
	},
});

export default PMBOM;
