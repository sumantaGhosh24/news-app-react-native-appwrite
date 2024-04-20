import {ActivityIndicator, TouchableOpacity} from "react-native";

const IconButton = ({icon, containerStyles, handlePress, isLoading}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`mt-2.5 p-1.5 rounded ${containerStyles || ""} ${
        isLoading ? "opacity-50" : "opacity-100"
      }`}
      disabled={isLoading}
    >
      {icon}
      {isLoading && (
        <ActivityIndicator animating={isLoading} color="#fff" size="small" />
      )}
    </TouchableOpacity>
  );
};

export default IconButton;
