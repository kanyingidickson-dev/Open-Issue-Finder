interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN?: string;
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css' {
  const css: string;
  export default css;
}
