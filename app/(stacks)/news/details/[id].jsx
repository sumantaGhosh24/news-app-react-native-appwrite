import {useState} from "react";
import {Text, View, Image, ScrollView, RefreshControl} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams} from "expo-router";

import useAppwrite from "../../../../lib/useAppwrite";
import {getNews} from "../../../../lib/appwrite";

const DetailNews = () => {
  const {id} = useLocalSearchParams();
  const {data: post, refetch} = useAppwrite(() => getNews(id));

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
        className="w-[95%] mx-auto my-10 space-y-3"
      >
        <Text className="text-2xl font-bold capitalize">{post.title}</Text>
        <Image
          source={{uri: post.thumbnail}}
          alt={post.thumbnailId}
          className="h-[250px] rounded"
        />
        <Text className="text-sm font-medium capitalize">
          {post.description}
        </Text>
        <View className="flex flex-row items-center border border-secondary p-3 rounded">
          <Image
            source={{uri: post?.creator?.avatar}}
            alt={post?.creator?.accountId}
            className="h-12 w-12 rounded mr-5"
          />
          <View className="space-y-1">
            <Text className="font-bold">{post?.creator?.name}</Text>
            <Text className="font-bold">{post?.creator?.username}</Text>
            <Text className="font-bold">{post?.creator?.email}</Text>
          </View>
        </View>
        <Text>
          Created at: {new Date(post.$createdAt).toLocaleDateString()}
        </Text>
        <Text>
          Updated at: {new Date(post.$updatedAt).toLocaleDateString()}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailNews;
