import {Redirect, router} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Image, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {CustomButton, Loader} from "@/components";
import {useGlobalContext} from "@/context/global-provider";

const Welcome = () => {
  const {loading, isLogged} = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="h-full">
      <Loader isLoading={loading} />
      <ScrollView>
        <View className="w-full flex justify-center items-center h-full px-4 mt-10">
          <Image
            source={require("../assets/images/logo.png")}
            className="w-20 h-20 mb-5"
            resizeMode="contain"
          />
          <Image
            source={require("../assets/images/onboarding.jpg")}
            className="max-w-[380px] w-full h-[298px]"
            style={{borderRadius: 10}}
            resizeMode="cover"
          />
          <View className="relative mt-5">
            <Text className="text-3xl font-bold text-center text-black">
              Discover Latest{"\n"}
              And Realtime <Text className="text-secondary">News</Text>
            </Text>
          </View>
          <Text className="text-sm font-semibold text-black mt-7 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati,
            sapiente
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7 mb-10 bg-blue-500"
          />
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default Welcome;
