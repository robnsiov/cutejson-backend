const MAX_BODY_SIZE = 1 * 1024 * 1024; // 1MB in bytes
const MAX_BACKOUP_COUNT = 4;
const DEFAULT_JSON_DB = {
  users: [
    {
      age: 22,
      name: "john",
      email: "john@example.com",
      comments: [1, 20],
      address: { country: "USA" },
      admin: false,
    },
    {
      age: 30,
      name: "sara",
      email: "sara@example.com",
      comments: [3],
      address: { country: "UK" },
      admin: true,
    },
  ],
  user_comments: [
    { id: 1, content: "this is a comment from sara" },
    { id: 2, content: "this is another comment from sara" },
    { id: 3, content: "this a comment from john" },
  ],
};
// const BASE_URL = "https://api.cutejson.dev";
const BASE_URL = "http://127.0.0.1:8086";
// const FRONT_BASE_URL = "https://cutejson.dev";
const FRONT_BASE_URL = "http://127.0.0.1:3000";
const GOOGLE_REDIRECT_URL = `${BASE_URL}/auth/google/callback`;
const GITHUB_URL = `https://github.com`;
const GITHUB_API_URL = `https://api.github.com`;
const GOOGLE_URL = `https://accounts.google.com`;
const GOOGLE_APIS = `https://oauth2.googleapis.com`;
const GOOGLE_API = `https://www.googleapis.com`;

export {
  MAX_BODY_SIZE,
  MAX_BACKOUP_COUNT,
  DEFAULT_JSON_DB,
  GOOGLE_REDIRECT_URL,
  GITHUB_URL,
  FRONT_BASE_URL,
  GOOGLE_URL,
  GOOGLE_APIS,
  GOOGLE_API,
  GITHUB_API_URL,
};
