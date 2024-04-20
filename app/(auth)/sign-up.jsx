import {useState} from "react";
import {View, Text, ScrollView, Dimensions, Alert, Image} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link, router} from "expo-router";

import {useGlobalContext} from "../../context/GlobalProvider";
import {createUser} from "../../lib/appwrite";
import {CustomButton, FormField} from "../../components";

const SignUp = () => {
  const {setUser, setIsLogged} = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (
      form.username === "" ||
      form.email === "" ||
      form.password === "" ||
      form.name === ""
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createUser(
        form.email,
        form.password,
        form.username,
        form.name
      );
      setUser(result);
      setIsLogged(true);

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
            className="w-20 h-20"
            resizeMode="contain"
          />

          <Text className="text-2xl font-bold my-5">Sign up to get News</Text>

          <FormField
            title="Name"
            value={form.name}
            handleChangeText={(e) => setForm({...form, name: e})}
            otherStyles="mt-5"
            placeholder="Enter your name"
          />

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({...form, username: e})}
            otherStyles="mt-5"
            placeholder="Enter your username"
          />

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
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-5"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2 mb-5">
            <Text className="text-lg">Have an account already?</Text>
            <Link
              href="/sign-in"
              className="text-lg font-semibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
