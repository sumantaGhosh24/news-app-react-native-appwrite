import {useState} from "react";
import {View, Text, Image, Alert} from "react-native";
import {router} from "expo-router";
import {Entypo, MaterialIcons} from "@expo/vector-icons";

import IconButton from "./IconButton";
import {deleteNews} from "../lib/appwrite";

const NewsCard = ({
  title,
  thumbnail,
  creator,
  avatar,
  profile,
  id,
  thumbnailId,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    if (!id) {
      return Alert.alert("Id not defined");
    }

    setLoading(true);
    try {
      await deleteNews(id, thumbnailId);

      Alert.alert("Success", "News deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex flex-col items-center w-[85%] mx-auto mb-5 border border-secondary p-3 rounded">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{uri: avatar}}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text className="font-bold text-sm capitalize" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs font-medium" numberOfLines={1}>
              {creator}
            </Text>
          </View>
        </View>
        <IconButton
          icon={<Entypo name="eye" size={24} color="white" />}
          handlePress={() => router.push(`/news/details/${id}`)}
          containerStyles="bg-orange-700"
        />
        {profile && (
          <>
            <IconButton
              icon={<MaterialIcons name="delete" size={24} color="white" />}
              handlePress={() => handleDelete(id)}
              isLoading={loading}
              containerStyles="bg-red-700 ml-3"
            />
          </>
        )}
      </View>
      <Image
        source={{uri: thumbnail}}
        alt="thumbnail"
        className="h-[250px] w-full mt-3 rounded"
      />
    </View>
  );
};

export default NewsCard;
