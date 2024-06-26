import {useState} from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {MaterialIcons} from "@expo/vector-icons";

import {useGlobalContext} from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import {getUserNews, signOut} from "../../lib/appwrite";
import {EmptyState, InfoBox, NewsCard} from "../../components";

const Profile = () => {
  const {user, setUser, setIsLogged} = useGlobalContext();
  const {data: posts, refetch} = useAppwrite(() => getUserNews(user.$id));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

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
            profile={true}
            id={item.$id}
            thumbnailId={item.thumbnailId}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No News Found"
            subtitle="No news found for this profile"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mb-5 px-4 py-2">
            <View className="bg-secondary w-full p-3 rounded mb-5">
              <View className="flex flex-row items-center justify-between w-[90%] mx-auto">
                <Text className="text-2xl font-bold text-white">Profile</Text>
                <TouchableOpacity onPress={logout} className="flex">
                  <MaterialIcons name="logout" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{uri: user?.avatar}}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-3"
              titleStyles="text-lg"
              posts={posts.length || 0}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
