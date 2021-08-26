import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN = "token";
const DARK_MODE = "dark_mode";

export const isLoggedInVar = makeVar(false);
export const darkModeVar = makeVar(false);
export const tokenVar = makeVar("");

export const login = async (token: string) => {
  await AsyncStorage.setItem(TOKEN, JSON.stringify(token));
  isLoggedInVar(true);
  tokenVar(token);
};

export const logout = async () => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar("");
};

export const toggleDarkMode = async () => {
  if (Boolean(await AsyncStorage.getItem(DARK_MODE))) {
    await AsyncStorage.removeItem(DARK_MODE);
    darkModeVar(false);
  } else {
    await AsyncStorage.setItem(DARK_MODE, "enabled");
    darkModeVar(true);
  }
};

const httpLink = createUploadLink({
  uri: "https://nomad-coffee-backend-0126.herokuapp.com/graphql",
  // uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = tokenVar();
  return {
    headers: {
      ...headers,
      ...(token !== "" && { token }),
    },
  };
});

export const cache = new InMemoryCache();

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
