import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import TabsNavi from "./src/navigators/MainTabsNavi";
import { ApolloProvider } from "@apollo/client";
import { client, cache } from "./src/apollo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";
import { ThemeProvider } from "styled-components/native";
import { lightTheme } from "./src/styles";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [loading, setLoading] = useState(true);
  const onFinish = () => setLoading(false);
  const preload = async () => {
    await persistCache({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
    });
    await Font.loadAsync({
      ...Ionicons.font,
    });
  };
  if (loading) {
    return (
      <AppLoading
        startAsync={preload}
        onError={console.warn}
        onFinish={onFinish}
      />
    );
  }
  return (
    <NavigationContainer>
      <ApolloProvider client={client}>
        <ThemeProvider theme={lightTheme}>
          <StatusBar style="auto" />
          <TabsNavi />
        </ThemeProvider>
      </ApolloProvider>
    </NavigationContainer>
  );
}
