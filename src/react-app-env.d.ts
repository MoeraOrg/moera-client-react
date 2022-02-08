/// <reference types="react-scripts" />

type SharedTextType = "html" | "text";

interface AndroidJsInterface {
    locationChanged(url: string, location: string): void;
    connectedToHome(url: string | null, token: string | null, ownerName: string | null): void;
    loadSettingsMeta(): string;
    loadSettings(): string;
    storeSettings(data: string): void;
    share(url: string, title: string): void;
    getSharedText(): string;
    getSharedTextType(): SharedTextType;
    back(): void;
    log(text: string): void;
}

interface Window {
    Android?: AndroidJsInterface;
    closeLightDialog?: (() => void) | null;
    loadedImages?: Set<string>;
}
