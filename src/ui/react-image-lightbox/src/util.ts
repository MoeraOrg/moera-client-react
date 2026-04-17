type ReplaceStrings = Record<string, string>;

/**
 * Placeholder for future translate functionality
 */
export function translate(str: string | null | undefined, replaceStrings: ReplaceStrings | null = null): string {
    if (!str) {
        return "";
    }

    let translated = str;
    if (replaceStrings) {
        Object.keys(replaceStrings).forEach(placeholder => {
            translated = translated.replace(placeholder, replaceStrings[placeholder]);
        });
    }

    return translated;
}

export function getWindowWidth(): number {
    return typeof globalThis.window !== "undefined" ? globalThis.window.innerWidth : 0;
}

export function getWindowHeight(): number {
    return typeof globalThis.window !== "undefined" ? globalThis.window.innerHeight : 0;
}

const isCrossOriginFrame = (): boolean => {
    try {
        return globalThis.window.location.hostname !== globalThis.window.parent.location.hostname;
    } catch {
        return true;
    }
};

// Get the highest window context that isn't cross-origin
// (When in an iframe)
export function getHighestSafeWindowContext(self?: Window): Window {
    if (typeof globalThis.window === "undefined") {
        throw new Error("Window context is not available.");
    }

    const currentWindow = self ?? globalThis.window.self;

    // If we reached the top level, return self
    if (currentWindow === globalThis.window.top) {
        return currentWindow;
    }

    // If parent is the same origin, we can move up one context
    // Reference: https://stackoverflow.com/a/21965342/1601953
    if (!isCrossOriginFrame()) {
        return getHighestSafeWindowContext(currentWindow.parent);
    }

    // If a different origin, we consider the current level
    // as the top reachable one
    return currentWindow;
}
