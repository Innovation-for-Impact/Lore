import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "../types/backend-schema";
import * as SecureStore from "expo-secure-store";
import { components } from "../types/backend-schema";

export type User = components["schemas"]["User"];
export type Group = components["schemas"]["Group"];
export type Quote = components["schemas"]["Quote"];

if (process.env.EXPO_PUBLIC_HOST_IP === undefined) {
  throw new Error("Backend IP Not defined in types/constants.ts");
}

export const BACKEND_URL = `http://${process.env.EXPO_PUBLIC_HOST_IP}:8000`;

async function getAccessToken() {
  return await SecureStore.getItemAsync("access_token");
}

async function getRefreshToken() {
  return await SecureStore.getItemAsync("refresh_token");
}

export async function setTokens(access: string | null, refresh: string | null) {
  if (access) {
    await SecureStore.setItemAsync("access_token", access);
  }
  else {
    await SecureStore.deleteItemAsync("access_token")
  }

  if (refresh) {
    await SecureStore.setItemAsync("refresh_token", refresh);
  }
  else {
    await SecureStore.deleteItemAsync("refresh_token")
  }
}

// let isRefreshing = false;
// let refreshPromise: Promise<void> | null = null;
//
// const authFetch: typeof fetch = async(input, init = {}) => {
//
//   const urlStr = input instanceof Request ? input.url : input;
//   const isAuthEndpoint = urlStr.includes('/auth/');
//
//   if (input instanceof Request && !isAuthEndpoint) {
//     const access = await getAccessToken();
//     input.headers.map['authorization'] = `Bearer ${access}`;
//   }
//
//   let response = await fetch(input, init);
//
//   if (response.status != 401) {
//     return response;
//   }
//   console.log("Attempting refresh...");
//   if (isRefreshing && refreshPromise) {
//     await refreshPromise;
//   }
//   else {
//     isRefreshing = true;
//     refreshPromise = (async () => {
//       const refreshToken = await getRefreshToken();
//       if (!refreshToken) throw new Error("No refresh token");
//
//       const refreshResponse = await fetch(`${BACKEND_URL}/api/v1/auth/token/refresh/`, {
//         method: 'POST',
//         headers: { "Content-Type": "application/json"},
//         body: JSON.stringify({ refresh: refreshToken })
//       })
//       console.log(refreshResponse);
//       if (!refreshResponse.ok) {
//         console.log("Refresh failed");
//         isRefreshing = false;
//         refreshPromise = null;
//         throw new Error("Refresh failed");
//       }
//       const data = await refreshResponse.json();
//       await setTokens(data.access, data.refresh);
//       console.log("Token refreshed");
//       isRefreshing = false;
//       refreshPromise = null;
//     })()
//     await refreshPromise;
//   }
//
//   if (input instanceof Request) {
//     const newAccess = await getAccessToken();
//     input.headers.map['authorization'] = `Bearer ${newAccess}`;
//   }
//   return fetch(input, init);
// }

const fetchClient = createFetchClient<paths>({
  baseUrl: BACKEND_URL,
  credentials: "omit"
})
fetchClient.use(
  {
    async onRequest({ request }) {
      const accessToken = await getAccessToken();
      if (accessToken) {
        // console.log(accessToken);
        request.headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return request;
    }
  }
)

export const $api = createClient(fetchClient);

export const infiniteQueryParams = {
  pageParamName: "page",
  getNextPageParam: (lastPage:
    components["schemas"]["PaginatedUserList"] |
    components["schemas"]["PaginatedGroupList"] |
    components["schemas"]["PaginatedQuoteList"] |
    components["schemas"]["PaginatedAchievementList"]
  ) => {
    if (!lastPage.next) return undefined;
    const url = new URL(lastPage.next)
    const page = url.searchParams.get("page");
    return page ? Number(page) : undefined;
  },
  initialPageParam: 1
}
