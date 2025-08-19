import {zodResolver} from "@hookform/resolvers/zod";
import {Link, router} from "expo-router";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
  ActivityIndicator,
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
import {getCurrentUser, signIn} from "@/lib/appwrite";

const scheme = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(25, "Password is too long"),
});

type FormData = z.infer<typeof scheme>;

const SignIn = () => {
  const {setUser, setIsLogged} = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(scheme),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSignIn = async (data: FormData) => {
    setLoading(true);

    try {
      await signIn(data.email, data.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      ToastAndroid.showWithGravityAndOffset(
        "User signed in successfully",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      router.replace("/home");
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white p-6 "
    >
      <View className="flex-1 justify-center w-full max-w-md mx-auto">
        <Text className="text-4xl font-bold text-gray-900 mb-2">
          Sign in user
        </Text>
        <Text className="text-lg text-gray-600 mb-8">
          Sign in to get regular news
        </Text>
        <View className="gap-2">
          <Controller
            control={control}
            name="email"
            render={({field: {onChange, value}}) => (
              <View>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Email address"
                  value={value}
                  onChangeText={onChange}
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900"
                />
                {errors.email && (
                  <Text className="text-red-500">{errors.email.message}</Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({field: {onChange, value}}) => (
              <View>
                <TextInput
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900"
                />
                {errors.password && (
                  <Text className="text-red-500">
                    {errors.password.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
        <TouchableOpacity
          onPress={handleSubmit(onSignIn)}
          disabled={loading}
          className={`bg-blue-600 rounded-xl p-4 items-center mt-6 ${loading ? "opacity-50" : ""}`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Don&apos;t have an account? </Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-blue-600 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
