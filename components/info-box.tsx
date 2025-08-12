import {Text, View} from "react-native";

interface InfoBoxProps {
  title: string;
  containerStyles?: string;
  titleStyles?: string;
  posts: number;
}

const InfoBox = ({
  title,
  containerStyles,
  titleStyles,
  posts,
}: InfoBoxProps) => {
  return (
    <View className={containerStyles || ""}>
      <Text className={`text-center font-semibold ${titleStyles || ""}`}>
        {title}
      </Text>
      <Text className="text-sm text-center mt-3 font-bold">Posts: {posts}</Text>
    </View>
  );
};

export default InfoBox;
