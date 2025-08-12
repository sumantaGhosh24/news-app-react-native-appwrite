import {FontAwesome5} from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import {router} from "expo-router";
import {useState} from "react";
import {
  Image,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {CustomButton, FormField} from "@/components";
import {useGlobalContext} from "@/context/global-provider";
import {createNews} from "@/lib/appwrite";

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
        thumbnail: result.assets[0] as any,
      });
    } else {
      setTimeout(() => {
        ToastAndroid.showWithGravityAndOffset(
          "Document picked" + JSON.stringify(result, null, 2),
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }, 100);
    }
  };

  const submit = async () => {
    if (form.description === "" || form.title === "" || !form.thumbnail) {
      return ToastAndroid.showWithGravityAndOffset(
        "Please fill in all fields",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    setUploading(true);
    try {
      await createNews({
        ...form,
        userId: user.$id,
      });

      ToastAndroid.showWithGravityAndOffset(
        "News created successfully",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      router.push("/home");
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
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
          custom={true}
        />

        <View className="mb-5 space-y-2">
          <Text className="text-base font-bold">News Thumbnail Image</Text>

          <TouchableOpacity onPress={() => openPicker()}>
            {form.thumbnail ? (
              <Image
                // @ts-ignore
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
          containerStyles="mb-5 bg-blue-500"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
