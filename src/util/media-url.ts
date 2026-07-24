import { PrivateMediaFileInfo } from "api";
import { urlWithParameters } from "util/url";

const ABSOLUTE_URL = /^[a-z][a-z\d+.-]*:/i;

export function resolveMediaUrl(rootPage: string | null, path: string): string {
    return ABSOLUTE_URL.test(path) ? path : `${rootPage ?? ""}/media/${path}`;
}

export function mediaDownloadUrl(rootPage: string | null, media: PrivateMediaFileInfo): string {
    return media.directDownloadPath != null
        ? resolveMediaUrl(rootPage, media.directDownloadPath)
        : urlWithParameters(resolveMediaUrl(rootPage, media.path), {download: true});
}
