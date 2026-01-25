interface NoTrackingProvider {
    urlPattern: string;
    completeProvider: boolean;
    rules?: string[];
    rawRules?: string[];
    referralMarketing?: string[];
    exceptions?: string[];
    redirections?: string[];
    forceRedirection?: boolean;
}

interface NoTrackingData {
    providers: Record<string, NoTrackingProvider>;
}

declare module 'util/no-tracking-data.json' {
    const value: NoTrackingData;
    export default value;
}
