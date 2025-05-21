interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GRAPHQL_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
