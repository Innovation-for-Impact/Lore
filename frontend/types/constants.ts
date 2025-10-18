import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "../types/backend-schema";

const HOST_IP = '10.0.0.211';
export const BACKEND_URL = `http://${HOST_IP}:8000`;

const fetchClient = createFetchClient<paths>({
  baseUrl: BACKEND_URL,
})

export const $api = createClient(fetchClient);
