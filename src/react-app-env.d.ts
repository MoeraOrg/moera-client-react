/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

type SharedTextType = "html" | "text";

type AndroidAppFlavor = "google-play" | "apk";

interface AndroidJsInterface {
    locationChanged(url: string, location: string): void;
    connectedToHome(url: string | null, token: string | null, ownerName: string | null): void;
    loadSettingsMeta(): string;
    loadSettings(): string;
    storeSettings(data: string): void;
    share(url: string, title: string): void;
    getSharedText(): string;
    getSharedTextType(): SharedTextType;
    saveImage(url: string, mimeType: string): void;
    back(): void;
    toast(text: string): void;
    setSwipeRefreshEnabled(enabled: boolean): void;
    isDonationsEnabled(): boolean; // deprecated
    getFlavor(): AndroidAppFlavor;
    getApiVersion(): number;
    changeLanguage(lang: string | null): void;
    log(text: string): void;
}

interface AndroidMessageBack {
    source: string;
    action: "back";
}

interface AndroidMessageCallReturn {
    source: string;
    action: "call-return";
    callId: number;
    value: string | number | null;
}

interface AndroidMessageNetworkChanged {
    source: string;
    action: "network-changed";
}

type AndroidMessage =
    AndroidMessageBack
    | AndroidMessageCallReturn
    | AndroidMessageNetworkChanged;

interface Window {
    Android?: AndroidJsInterface;
    closeLightDialog?: (() => void) | null;
    loadedImages?: Set<string>;
    loadedAvatars?: Map<string, string>;
    overlays: import("ui/overlays/overlays").OverlaysManager;
}
