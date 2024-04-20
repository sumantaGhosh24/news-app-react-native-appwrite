import {StatusBar} from "expo-status-bar";
import {Redirect, Tabs, Stack} from "expo-router";

import {Loader} from "../../components";
import {useGlobalContext} from "../../context/GlobalProvider";

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
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default StackLayout;
