import {Stack} from "expo-router";
import "react-native-url-polyfill/auto";

import "../global.css";

import GlobalProvider from "@/context/global-provider";

const RootLayout = () => {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="(auth)" options={{headerShown: false}} />
        <Stack.Screen name="(stacks)" options={{headerShown: false}} />
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
