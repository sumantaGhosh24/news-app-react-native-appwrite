import {Redirect, Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";

import {Loader} from "@/components";
import {useGlobalContext} from "@/context/global-provider";

const StackLayout = () => {
  const {loading, isLogged} = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Stack>
        <Stack.Screen name="search/[query]" options={{headerShown: false}} />
        <Stack.Screen name="news/details/[id]" options={{headerShown: false}} />
      </Stack>

      <Loader isLoading={loading} />
      <StatusBar style="dark" />
    </>
  );
};

export default StackLayout;
