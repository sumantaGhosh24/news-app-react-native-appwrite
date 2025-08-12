import {FontAwesome6} from "@expo/vector-icons";
import {Text, View} from "react-native";

import CustomButton from "./custom-button";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  buttonTitle: string;
  handlePress: () => void;
}

const EmptyState = ({
  title,
  subtitle,
  buttonTitle,
  handlePress,
}: EmptyStateProps) => {
  return (
    <View className="flex justify-center items-center p-4 w-[80%] mx-auto border border-secondary rounded">
      <FontAwesome6 name="hourglass-empty" size={48} color="black" />

      <Text className="text-sm font-medium my-3 capitalize">{title}</Text>
      <Text className="text-xl text-center font-semibold capitalize">
        {subtitle}
      </Text>

      <CustomButton
        title={buttonTitle}
        handlePress={handlePress}
        containerStyles="w-full my-5 bg-blue-700"
      />
    </View>
  );
};

export default EmptyState;
