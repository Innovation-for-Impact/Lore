import * as SecureStore from "expo-secure-store";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { DeviceEventEmitter } from "react-native";
import type { paths } from "../types/backend-schema";
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

const fetchClient = createFetchClient<paths>({
  baseUrl: BACKEND_URL,
  credentials: "omit"
})
fetchClient.use(
  {
    async onRequest({ request }) {
      const accessToken = await getAccessToken();
      if (accessToken) {
        request.headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return request;
    },
    async onResponse({ request, response }) {
      const isRefreshPath = request.url.includes("/api/v1/auth/token/refresh");

      if (response.status === 401 && !isRefreshPath) {
        try {
          const [accessToken, refreshToken] = await Promise.all([getAccessToken(), getRefreshToken()]);
          if (!accessToken || !refreshToken) {
            return response;
          }
          const { data, error } = await fetchClient.POST("/api/v1/auth/token/refresh/", {
            body: {
              access: accessToken,
              refresh: refreshToken
            }
          })
          if (error) {
            throw new Error("Refresh failed, clearing tokens")
          }

          await setTokens(data.access, data.refresh);
          request.headers.set("Authorization", `Bearer ${data.access}`)
          return fetch(request)
        } catch (e) {
          if (e instanceof Error) {
            setTokens(null, null);
            DeviceEventEmitter.emit("REFRESH_FAILED");
          }
        }
      }
      return response;
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
