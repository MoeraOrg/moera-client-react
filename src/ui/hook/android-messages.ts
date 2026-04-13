import { useCallback, useEffect } from 'react';

import * as Browser from "ui/browser";

export type OnAndroidMessage = (message: AndroidMessage) => void;

export function useAndroidMessages(callback: OnAndroidMessage) {
    const messageReceived = useCallback((event: MessageEvent) => {
        const data = event.data;
        if (data === null || typeof data !== "string") {
            return;
        }
        const message = JSON.parse(data) as AndroidMessage;

        // Only accept messages that we know are ours
        if (message.source !== "moera-android") {
            return;
        }

        callback(message);
    }, [callback]);

    useEffect(() => {
        if (!Browser.isAndroidApp()) {
            return;
        }

        window.addEventListener("message", messageReceived);
        return () => window.removeEventListener("message", messageReceived);
    }, [messageReceived]);
}
