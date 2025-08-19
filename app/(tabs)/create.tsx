import {FontAwesome5} from "@expo/vector-icons";
import {zodResolver} from "@hookform/resolvers/zod";
import * as DocumentPicker from "expo-document-picker";
import {router} from "expo-router";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";

import {useGlobalContext} from "@/context/global-provider";
import {createNews} from "@/lib/appwrite";

const scheme = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title not longer than 100 characters long"),
  description: z
    .string()
    .min(10, "Description must bet at least 10 characters long")
    .max(250, "Description not longer than 250 characters long"),
});

type FormData = z.infer<typeof scheme>;

const Create = () => {
  const {user} = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(scheme),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange",
  });

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg", "image/jpeg"],
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0] as any);
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

  const onCreateNews = async (data: FormData) => {
    setLoading(true);

    try {
      await createNews({
        ...data,
        thumbnail,
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
      reset();
      setThumbnail(null);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white p-6"
    >
      <View className="flex-1 justify-center w-full max-w-md mx-auto">
        <Text className="text-4xl font-bold text-gray-900 mb-2">
          Create News
        </Text>
        <View className="gap-2">
          <View className="mb-5 space-y-2">
            <Text className="text-base font-bold">News Thumbnail Image</Text>
            <TouchableOpacity onPress={() => openPicker()}>
              {thumbnail ? (
                <Image
                  // @ts-ignore
                  source={{uri: thumbnail.uri}}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-16 px-4 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                  <FontAwesome5
                    name="cloud-upload-alt"
                    size={24}
                    color="black"
                  />
                  <Text className="text-sm font-bold">Choose a file</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <Controller
            control={control}
            name="title"
            render={({field: {onChange, value}}) => (
              <View>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Title"
                  value={value}
                  onChangeText={onChange}
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900"
                />
                {errors.title && (
                  <Text className="text-red-500">{errors.title.message}</Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({field: {onChange, value}}) => (
              <View>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Description"
                  value={value}
                  onChangeText={onChange}
                  multiline={true}
                  numberOfLines={10}
                  textAlignVertical="top"
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900"
                />
                {errors.description && (
                  <Text className="text-red-500">
                    {errors.description.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
        <TouchableOpacity
          onPress={handleSubmit(onCreateNews)}
          disabled={loading}
          className={`bg-blue-600 rounded-xl p-4 items-center mt-6 ${loading ? "opacity-50" : ""}`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Create News
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Create;
