import {useLocalSearchParams} from "expo-router";
import {useState} from "react";
import {Image, RefreshControl, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {getNews} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface PostProps {
  $id: string;
  title: string;
  thumbnail: string;
  thumbnailId: string;
  description: string;
  creator: {
    avatar: string;
    accountId: string;
    name: string;
    username: string;
    email: string;
  };
  $createdAt: any;
  $updatedAt: any;
}

const DetailNews = () => {
  const {id} = useLocalSearchParams();
  const {data: post, refetch} = useAppwrite(() => getNews(id as string));

  const typedPost = post as unknown as PostProps;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="w-[95%] mx-auto my-10"
      >
        <Text className="text-2xl font-bold capitalize">{typedPost.title}</Text>
        <Image
          source={{uri: typedPost.thumbnail}}
          alt={typedPost.thumbnailId}
          className="h-[250px] rounded my-5"
        />
        <Text className="text-lg font-normal capitalize tracking-tight">
          {typedPost.description}
        </Text>
        <View className="flex flex-row items-center border border-secondary p-3 rounded my-5">
          <Image
            source={{uri: typedPost?.creator?.avatar}}
            alt={typedPost?.creator?.accountId}
            className="h-12 w-12 rounded mr-5"
          />
          <View className="space-y-1">
            <Text className="font-bold">{typedPost?.creator?.name}</Text>
            <Text className="font-bold">{typedPost?.creator?.username}</Text>
            <Text className="font-bold">{typedPost?.creator?.email}</Text>
          </View>
        </View>
        <Text>
          Created at: {new Date(typedPost.$createdAt).toLocaleDateString()}
        </Text>
        <Text>
          Updated at: {new Date(typedPost.$updatedAt).toLocaleDateString()}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailNews;
