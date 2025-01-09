import { htmlToEmoji } from "util/html";

export function htmlToMarkdown(html: string): string;
export function htmlToMarkdown(html?: null): null;
export function htmlToMarkdown(html?: string | null): string | null;
export function htmlToMarkdown(html?: string | null): string | null {
    if (html == null) {
        return null;
    }
    return htmlToEmoji(html)
        .replace(/\n*<p(\s[^>]*)?>\n*/gi, "\n\n")
        .replace(/<blockquote>\n+/gi, "<blockquote>\n")
        .replace(/<\/p>/gi, "")
        .replace(/\n*<br\s*\/?>\n*/gi, "\n")
        .replace(/(?:<span>)?<a[^>]*data-nodename[^>]*>(@[^<]+)<\/a>(?:<\/span>)?/gi, "$1")
        .replace(/(?:<span>)?<a[^>]*data-nodename="([^"]*)"[^>]*>([^<]+)<\/a>(?:<\/span>)?/gi, "@$1[$2]")
        .replace(/<a[^>]*href=(['"])([^'"]+)\1[^>]*>\2<\/a>/gi, "$2")
        .replace(/\n\s*\n/g, "\n\n")
        .trim()
}
