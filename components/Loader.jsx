import { View, ActivityIndicator, Dimensions, Platform } from "react-native";

// Author: Pham Van Cao
const Loader = ({ isLoading }) => {
   // Determine the operating system (iOS or Android)
  const osName = Platform.OS;
  // Get the height of the screen
  const screenHeight = Dimensions.get("screen").height;

   // If isLoading is false, return null (don't render anything)
  if (!isLoading) return null;

  return (
    <View
      className="absolute flex justify-center items-center w-full h-full bg-primary/60 z-10"
      style={{
        height: screenHeight,
      }}
    >
      <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size={osName === "ios" ? "large" : 50}
      />
    </View>
  );
};

export default Loader;
