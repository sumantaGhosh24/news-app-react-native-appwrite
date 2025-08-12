import {router} from "expo-router";
import {useState} from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

interface TrendingItemProps {
  activeItem: string;
  item: any;
}

interface TrendingProps {
  posts: any[];
}

const TrendingItem = ({activeItem, item}: TrendingItemProps) => {
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : (zoomOut as any)}
      duration={500}
    >
      <TouchableOpacity
        className="relative flex justify-center items-center"
        activeOpacity={0.7}
        onPress={() => router.push(`/news/details/${item.$id}`)}
      >
        <ImageBackground
          source={{
            uri: item.thumbnail,
          }}
          className="w-52 h-72 rounded-xl overflow-hidden shadow-lg shadow-black/40"
          resizeMode="cover"
        >
          <View className="absolute bottom-0 left-2.5 mb-3 bg-secondary w-[90%] rounded p-3">
            <Text className="capitalize font-bold text-white mb-2">
              {item.title}
            </Text>
            <View className="flex flex-row">
              <Image
                source={{uri: item.creator.avatar}}
                alt="post"
                className="h-10 w-10 rounded mr-3"
              />
              <View>
                <Text className="capitalize font-bold">
                  {item.creator.name}
                </Text>
                <Text>{item.creator.email}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const Trending = ({posts}: TrendingProps) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanged = ({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({item}) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{x: 170, y: 0}}
    />
  );
};

export default Trending;
