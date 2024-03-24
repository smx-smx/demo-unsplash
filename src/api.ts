import { createApi } from "unsplash-js";

const TOKEN_KEY = "unsplash.apikey";

export function api_setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export type ApiObject = ReturnType<typeof createApi>;

export function api_create(): ApiObject | null {
  const token = window.localStorage.getItem(TOKEN_KEY) ?? "";
  if (token.length < 1) return null;

  return createApi({
    accessKey: token,
  });
}
