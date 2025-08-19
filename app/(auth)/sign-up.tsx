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
import {createUser} from "@/lib/appwrite";

const schema = z
  .object({
    name: z
      .string()
      .min(1, "Name must be 3 characters long")
      .max(25, "Name not lot longer than 25 characters long"),
    username: z
      .string()
      .min(1, "Username must be 3 characters long")
      .max(25, "Username not lot longer than 25 characters long"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(25, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const SignUp = () => {
  const {setUser, setIsLogged} = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSignUp = async (data: FormData) => {
    setLoading(true);

    try {
      const result = await createUser(
        data.email,
        data.password,
        data.username,
        data.name
      );
      setUser(result);
      setIsLogged(true);

      ToastAndroid.showWithGravityAndOffset(
        "User register successfully",
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
      className="flex-1 bg-white p-6"
    >
      <View className="flex-1 justify-center w-full max-w-md mx-auto">
        <Text className="text-4xl font-bold text-gray-900 mb-2">
          Sign up user
        </Text>
        <Text className="text-lg text-gray-600 mb-8">
          Sign up to create and view news
        </Text>
        <View className="gap-2">
          <Controller
            control={control}
            name="name"
            render={({field: {onChange, value}}) => (
              <View>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Name"
                  value={value}
                  onChangeText={onChange}
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900"
                />
                {errors.name && (
                  <Text className="text-red-500">{errors.name.message}</Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="username"
            render={({field: {onChange, value}}) => (
              <View>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Username"
                  value={value}
                  onChangeText={onChange}
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900"
                />
                {errors.username && (
                  <Text className="text-red-500">
                    {errors.username.message}
                  </Text>
                )}
              </View>
            )}
          />
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
          <Controller
            control={control}
            name="confirmPassword"
            render={({field: {onChange, value}}) => (
              <View>
                <TextInput
                  placeholder="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900"
                />
                {errors.confirmPassword && (
                  <Text className="text-red-500">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
        <TouchableOpacity
          onPress={handleSubmit(onSignUp)}
          disabled={loading}
          className={`bg-blue-600 rounded-xl p-4 items-center mt-6 ${loading ? "opacity-50" : ""}`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Create Account
            </Text>
          )}
        </TouchableOpacity>
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Already have an account? </Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
