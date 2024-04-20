import {useState} from "react";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import {FontAwesome5} from "@expo/vector-icons";

import {useGlobalContext} from "../../context/GlobalProvider";
import {createNews} from "../../lib/appwrite";
import {CustomButton, FormField} from "../../components";

const Create = () => {
  const {user} = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: null,
  });

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg", "image/jpeg"],
    });

    if (!result.canceled) {
      setForm({
        ...form,
        thumbnail: result.assets[0],
      });
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if ((form.description === "") | (form.title === "") | !form.thumbnail) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await createNews({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "News created successfully");

      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        description: "",
        thumbnail: null,
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView className="px-4 my-10">
        <Text className="text-2xl font-bold mb-5">Create News</Text>

        <FormField
          title="News Title"
          value={form.title}
          placeholder="Enter news title"
          handleChangeText={(e) => setForm({...form, title: e})}
          otherStyles="mb-5"
        />

        <FormField
          title="News Description"
          value={form.description}
          placeholder="Enter news description"
          handleChangeText={(e) => setForm({...form, description: e})}
          otherStyles="mb-5"
          numberOfLines={5}
          multiline={true}
          custom={true}
        />

        <View className="mb-5 space-y-2">
          <Text className="text-base font-bold">News Thumbnail Image</Text>

          <TouchableOpacity onPress={() => openPicker()}>
            {form.thumbnail ? (
              <Image
                source={{uri: form.thumbnail.uri}}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <FontAwesome5 name="cloud-upload-alt" size={24} color="black" />
                <Text className="text-sm font-bold">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Post News"
          handlePress={submit}
          containerStyles="mb-5"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
