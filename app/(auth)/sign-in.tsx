import {Link, router} from "expo-router";
import {useState} from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {CustomButton, FormField} from "@/components";
import {useGlobalContext} from "@/context/global-provider";
import {getCurrentUser, signIn} from "@/lib/appwrite";

const SignIn = () => {
  const {setUser, setIsLogged} = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      ToastAndroid.showWithGravityAndOffset(
        "Please fill in all fields",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
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
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-5"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            resizeMode="contain"
            className="w-20 h-20"
          />
          <Text className="text-2xl font-bold my-5">Log in to News</Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({...form, email: e})}
            otherStyles="mt-5"
            placeholder="Enter your email"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({...form, password: e})}
            otherStyles="mt-5"
            type="password"
            placeholder="Enter your password"
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-5 bg-blue-500"
            isLoading={isSubmitting}
          />
          <View className="flex justify-center pt-5 flex-row gap-2 mb-5">
            <Text className="text-lg">Don&apos;t have an account?</Text>
            <Link
              href="/sign-up"
              className="text-lg font-semibold text-blue-500"
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
