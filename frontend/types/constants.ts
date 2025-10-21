import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "../types/backend-schema";

if (process.env.EXPO_PUBLIC_HOST_IP === undefined) {
  throw new Error("Backend IP Not defined in types/constants.ts");
}

export const BACKEND_URL = `http://${process.env.EXPO_PUBLIC_HOST_IP}:8000`;

const fetchClient = createFetchClient<paths>({
  baseUrl: BACKEND_URL,
})

export const $api = createClient(fetchClient);
