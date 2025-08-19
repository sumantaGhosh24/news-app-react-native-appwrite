import {Redirect, Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Platform} from "react-native";

import {Loader} from "@/components";
import {useGlobalContext} from "@/context/global-provider";

const AuthLayout = () => {
  const {loading, isLogged} = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
            title: "Login",
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: Platform.OS !== "web",
            title: "Register",
          }}
        />
      </Stack>
      <Loader isLoading={loading} />
      <StatusBar style="dark" />
    </>
  );
};

export default AuthLayout;
