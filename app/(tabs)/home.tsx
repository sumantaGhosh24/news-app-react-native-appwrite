import {router} from "expo-router";
import {useState} from "react";
import {FlatList, Image, RefreshControl, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {EmptyState, NewsCard, SearchInput, Trending} from "@/components";
import {getAllNews, getLatestNews} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface PostProps {
  $id: string;
  title: string;
  thumbnail: string;
  thumbnailId: string;
  creator: {
    username: string;
    avatar: string;
  };
}

const Home = () => {
  const {data: posts, refetch} = useAppwrite(getAllNews);
  const {data: latestPosts} = useAppwrite(getLatestNews);

  const typedPosts = posts as unknown as PostProps[];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="h-full">
      <FlatList
        data={typedPosts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <NewsCard
            title={item.title}
            thumbnail={item.thumbnail}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            id={item.$id}
            profile={false}
            thumbnailId={item.thumbnailId}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-5 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-3">
              <View>
                <Text className="font-medium text-sm">Home</Text>
                <Text className="text-2xl font-semibold">Explore News</Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={require("../../assets/images/logo.png")}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View className="w-full flex-1 pt-5 pb-3">
              <Text className="text-lg font-bold mb-3">Latest News</Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No News Found"
            subtitle="No news created yet"
            buttonTitle="Create"
            handlePress={() => router.push("/create")}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
