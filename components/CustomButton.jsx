import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Custom button for handles press event
// Author: Pham Hien Nhan
const CustomButton = ({
  title,
  handlePress,
  icon,
  iconSize,
  containerStyles,
  textStyles,
  isLoading,
  unpressable,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{marginBottom: 10}}
      className={`w-full h-16 px-4 bg-secondary rounded-xl flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={unpressable}
    >
      {title && (
        <Text className={`text-white font-psemibold text-lg ${textStyles}`}>
          {title}
        </Text>
      )}

      {icon && (
        <MaterialCommunityIcons name={icon} size={iconSize} color="white" />
      )}
      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
