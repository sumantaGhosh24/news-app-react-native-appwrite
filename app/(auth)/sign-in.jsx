import {useState} from "react";
import {View, Text, ScrollView, Dimensions, Alert, Image} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link, router} from "expo-router";

import {useGlobalContext} from "../../context/GlobalProvider";
import {getCurrentUser, signIn} from "../../lib/appwrite";
import {CustomButton, FormField} from "../../components";

const SignIn = () => {
  const {setUser, setIsLogged} = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
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
            keyboardType="email-address"
            placeholder="Enter your email"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({...form, password: e})}
            otherStyles="mt-5"
            placeholder="Enter your password"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-5"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2 mb-5">
            <Text className="text-lg">Don't have an account?</Text>
            <Link
              href="/sign-up"
              className="text-lg font-semibold text-secondary"
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
