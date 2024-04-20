import {View, Text} from "react-native";
import {router} from "expo-router";

import CustomButton from "./CustomButton";
import {FontAwesome6} from "@expo/vector-icons";

const EmptyState = ({title, subtitle}) => {
  return (
    <View className="flex justify-center items-center p-4 w-[80%] mx-auto border border-secondary rounded">
      <FontAwesome6 name="hourglass-empty" size={48} color="black" />

      <Text className="text-sm font-medium my-3">{title}</Text>
      <Text className="text-xl text-center font-semibold">{subtitle}</Text>

      <CustomButton
        title="Create One"
        handlePress={() => router.push("/create")}
        containerStyles="w-full my-5"
      />
    </View>
  );
};

export default EmptyState;
