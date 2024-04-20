import {View, Text} from "react-native";

const InfoBox = ({title, containerStyles, titleStyles, posts}) => {
  return (
    <View className={containerStyles || ""}>
      <Text className={`text-center font-semibold ${titleStyles | ""}`}>
        {title}
      </Text>
      <Text className="text-sm text-center mt-3 font-bold">Posts: {posts}</Text>
    </View>
  );
};

export default InfoBox;
