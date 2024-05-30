import { View, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

// SwipeItem component
// Author: Pham Hien Nhan
export const SwipeItem = ({ color, icon, title, onPress }) => {
	return (
		<View
			style={{
				marginVertical: 10,
				width: 60,
			}}
		>
			<TouchableOpacity
				style={{
					height: "100%",
					backgroundColor: `${color}`,
					justifyContent: "center",
					alignItems: "center",
				}}
				onPress={onPress}
			>
				<MaterialCommunityIcons name={icon} size={22} />
				<Text>{title}</Text>
			</TouchableOpacity>
		</View>
	);
};

export const LeftSwipe = ({ onPressItem }) => (
	<>
		<SwipeItem
			color="red"
			title="Delete"
			icon="trash-can"
			onPress={() => onPressItem("Delete")}
		/>
		<SwipeItem
			color="green"
			title="Edit"
			icon="application-edit"
			onPress={() => onPressItem("Edit")}
		/>
	</>
);

export const RightSwipe = ({ onPressItem }) => (
	<>
		<SwipeItem
			color="#FFA500"
			title="Export"
			icon="file-export"
			onPress={() => onPressItem("Export")}
		/>
	</>
);
