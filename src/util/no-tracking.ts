/*
 * Catalog of rules used for removing tracking parameters from URLs.
 *
 * The catalog is collected from https://docs.clearurls.xyz
 * The minified file is located at https://rules2.clearurls.xyz/data.minify.json
 */
import TRACKING_DATA from "util/no-tracking-data.json";

export default function noTracking(url: string) : string;
export default function noTracking(url: null) : null;
export default function noTracking(url: undefined) : undefined;
export default function noTracking(url: string | null | undefined) : string | null | undefined;
export default function noTracking(url: string | null | undefined) : string | null | undefined {
    if (url == null) {
        return url;
    }
    if (!url.includes("?")) {
        return url;
    }
    try {
        const components = new URL(url);
        for (const provider of Object.values(TRACKING_DATA.providers)) {
            if (!urlMatches(url, provider)) {
                continue;
            }
            executeRules(provider.rules, components.searchParams);
            executeRules(provider.referralMarketing, components.searchParams);
            if (components.searchParams.size === 0) {
                return components.toString();
            }
        }
        return components.toString();
    } catch (e) {
        // ignore, return the original URL
    }
    return url;
}

function urlMatches(url: string, provider: NoTrackingProvider): boolean {
    if (provider.completeProvider) {
        return false;
    }
    if (!url.match(provider.urlPattern)) {
        return false;
    }
    if (provider.exceptions == null) {
        return true;
    }
    return !provider.exceptions.some(ex => url.match(ex));
}

function executeRules(rules: string[] | undefined, params: URLSearchParams): void {
    if (rules == null) {
        return;
    }
    for (const rule of rules) {
        const pattern = new RegExp("^" + rule + "$");
        for (const key of params.keys()) {
            if (key.match(pattern)) {
                params.delete(key);
            }
        }
    }
}
