import {router, useLocalSearchParams} from "expo-router";
import {useEffect} from "react";
import {FlatList, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {EmptyState, NewsCard, SearchInput} from "@/components";
import {searchNews} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface PostsProps {
  $id: string;
  title: string;
  thumbnail: string;
  thumbnailId: string;
  creator: {
    username: string;
    avatar: string;
  };
}

const Search = () => {
  const {query} = useLocalSearchParams();
  const {data: posts, refetch} = useAppwrite(() => searchNews(query as string));

  const typedPosts = posts as unknown as PostsProps[];

  useEffect(() => {
    refetch();
  }, [query]);

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
            thumbnailId={item.thumbnailId}
            profile={false}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-medium text-sm">Search Results</Text>
              <Text className="text-2xl font-semibold mt-1">{query}</Text>

              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query as string} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No News Found"
            subtitle="No news found for this search query"
            buttonTitle="Create"
            handlePress={() => router.push("/create")}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
