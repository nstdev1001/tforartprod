/// <reference types="vite/client" />

import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "l-helix": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          size?: string;
          speed?: string;
          color?: string;
        },
        HTMLElement
      >;
      "l-line-spinner": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          size?: string;
          speed?: string;
          color?: string;
        },
        HTMLElement
      >;
    }
  }
}

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
