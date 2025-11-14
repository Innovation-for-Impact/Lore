import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "../types/backend-schema";
import * as SecureStore from "expo-secure-store";

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

export async function setTokens(access: string, refresh: string) {
  await SecureStore.setItemAsync("access_token", access);
  await SecureStore.setItemAsync("refresh_token", refresh);
}

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const authFetch: typeof fetch = async(input, init = {}) => {
  const access = await getAccessToken();

  const urlStr = input instanceof Request ? input.url : input;
  const isAuthEndpoint = urlStr.includes('/auth/');

  if (input instanceof Request && !isAuthEndpoint) {
    input.headers.map['authorization'] = `Bearer ${access}`;
  }

  console.log(input);
  let response = await fetch(input, init);

  if (response.status != 401) {
    return response;
  }
  console.log("Attempting refresh...");
  if (isRefreshing && refreshPromise) {
    await refreshPromise;
  }
  else {
    isRefreshing = true;
    refreshPromise = (async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token");

      const refreshResponse = await fetch(`${BACKEND_URL}/api/v1/auth/token/refresh/`, {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ refresh: refreshToken })
      })
      console.log(refreshResponse);
      if (!refreshResponse.ok) {
        console.log("Refresh failed");
        isRefreshing = false;
        refreshPromise = null;
        throw new Error("Refresh failed");
      }
      const data = await refreshResponse.json();
      await setTokens(data.access, data.refresh);
      console.log("Token refreshed");
      isRefreshing = false;
      refreshPromise = null;
    })()
    await refreshPromise;
  }

  const newAccess = await getAccessToken();
  if (input instanceof Request) {
    input.headers.map['authorization'] = `Bearer ${newAccess}`;
  }
  return fetch(input, init);
}

const fetchClient = createFetchClient<paths>({
  baseUrl: BACKEND_URL,
  // fetch: authFetch
})

export const $api = createClient(fetchClient);
