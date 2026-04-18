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
