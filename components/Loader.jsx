import {
  View,
  ActivityIndicator,
  Dimensions,
  Platform,
  Text,
} from "react-native";

const Loader = ({isLoading}) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View
      className="flex justify-center items-center w-full z-10 "
      style={{height: screenHeight}}
    >
      <ActivityIndicator
        animating={isLoading}
        color="#00ADB5"
        size={osName === "ios" ? "large" : 50}
      />
      <Text></Text>
    </View>
  );
};

export default Loader;
