import {useEffect} from "react";
import {View, Text, FlatList} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams} from "expo-router";

import {EmptyState, NewsCard, SearchInput} from "../../../components";
import useAppwrite from "../../../lib/useAppwrite";
import {searchNews} from "../../../lib/appwrite";

const Search = () => {
  const {query} = useLocalSearchParams();
  const {data: posts, refetch} = useAppwrite(() => searchNews(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <NewsCard
            title={item.title}
            thumbnail={item.thumbnail}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            id={item.$id}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-medium text-sm">Search Results</Text>
              <Text className="text-2xl font-semibold mt-1">{query}</Text>

              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} refetch={refetch} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No News Found"
            subtitle="No news found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
