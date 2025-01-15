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

// TODO not correctly supported: spoilers, blockquotes, KaTeX, mentions
export async function markdownToHtml(markdown: string): Promise<string>;
export async function markdownToHtml(markdown?: null): Promise<null>;
export async function markdownToHtml(markdown?: string | null): Promise<string | null>;
export async function markdownToHtml(markdown?: string | null): Promise<string | null> {
    if (markdown == null) {
        return null;
    }

    const [
        { default: MarkdownIt },
        { default: MarkdownItSub },
        { default: MarkdownItSup },
        { full: MarkdownItEmoji },
        { default: MarkdownItDeflist }
    ] = await Promise.all([
        import("markdown-it"),
        // @ts-ignore
        import("markdown-it-sub"),
        // @ts-ignore
        import("markdown-it-sup"),
        import("markdown-it-emoji"),
        // @ts-ignore
        import("markdown-it-deflist"),
    ]);

    const md = new MarkdownIt({
        html: true,
        linkify: true,
    }).use(MarkdownItSub)
        .use(MarkdownItSup)
        .use(MarkdownItEmoji)
        .use(MarkdownItDeflist);
    return md.render(markdown);
}
