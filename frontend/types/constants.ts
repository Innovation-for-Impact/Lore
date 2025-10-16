import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "../types/backend-schema";

export const BACKEND_URL = "http://localhost:8000";

const fetchClient = createFetchClient<paths>({
  baseUrl: BACKEND_URL,
})

export const $api = createClient(fetchClient);
