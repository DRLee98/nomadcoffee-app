import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { offsetLimitPagination } from "@apollo/client/utilities";
import { seeCoffeeShopsQuery_seeCoffeeShops } from "./__generated__/seeCoffeeShopsQuery";

export const TOKEN = "token";
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

const authLink = setContext((_, { headers }) => {
  const token = tokenVar();
  return {
    headers: {
      ...headers,
      ...(token !== "" && { token }),
    },
  };
});

const uploadHttpLink = createUploadLink({
  uri: "https://nomad-coffee-backend-0126.herokuapp.com/graphql",
  // uri: "http://localhost:4000/graphql",
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`GraphQL Error`, graphQLErrors);
  }
  if (networkError) {
    console.log("Network Error", networkError);
  }
});

const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeCoffeeShops: {
          keyArgs: false,
          merge(existing = [], incoming = []) {
            console.log(existing, incoming);
            if (Array.isArray(existing) && Array.isArray(incoming)) {
              return [...existing, ...incoming];
            }
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: httpLinks,
  cache,
});
