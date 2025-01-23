import { linefeedsToHtml } from "util/html";

export function importQuirks(html: null): null;
export function importQuirks(html: string): string;
export function importQuirks(html: string | null): string | null;
export function importQuirks(html: string | null): string | null {
    if (html == null) {
        return null;
    }
    return twitterImportQuirks(html);
}

function twitterImportQuirks(html: string): string {
    if (/<span.*class=.*css-.*r-/.test(html)) {
        return linefeedsToHtml(html);
    }
    return html;
}
