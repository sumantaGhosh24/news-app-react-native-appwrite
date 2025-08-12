import {Feather} from "@expo/vector-icons";
import {router, usePathname} from "expo-router";
import {useState} from "react";
import {Alert, TextInput, TouchableOpacity, View} from "react-native";

interface SearchInputProps {
  initialQuery?: string;
}

const SearchInput = ({initialQuery}: SearchInputProps) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 flex-1"
        value={query}
        placeholder="Search a video topic"
        placeholderTextColor="#000"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Missing Query",
              "Please input something to search results across database"
            );
          // if (pathname.startsWith("/search")) router.setParams({query});
          else router.push(`/search/${query}`);
        }}
      >
        <Feather name="search" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
