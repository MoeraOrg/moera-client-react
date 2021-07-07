/// <reference types="react-scripts" />

interface AndroidJsInterface {
    locationChanged(url: string, location: string): void;
    connectedToHome(url: string, token: string, ownerName: string): void;
    loadSettingsMeta(): string;
    loadSettings(): string;
    storeSettings(data: string): void;
    share(url: string, title: string): void;
    getSharedText(): string;
    getSharedTextType(): string;
    back(): void;
    log(text: string): void;
}

interface Window {
    Android?: AndroidJsInterface;
}
