import { Element as SlateElement, Text as SlateText } from 'slate';
import { htmlEntities } from "util/html";

export interface ParagraphElement extends SlateElement {
    type: "paragraph";
}

export function isParagraphElement(value: any): value is ParagraphElement {
    return isScriptureElement(value) && value.type === "paragraph";
}

export interface LinkElement extends SlateElement {
    type: "link";
    href: string;
}

export function isLinkElement(value: any): value is LinkElement {
    return isScriptureElement(value) && value.type === "link";
}

export type ScriptureElement = ParagraphElement | LinkElement;

export function isScriptureElement(value: any): value is ScriptureElement {
    return SlateElement.isElement(value) && "type" in value;
}

export type ScriptureText = SlateText;

export type ScriptureDescendant = ScriptureElement | ScriptureText;

// Slate editor JSON format
export type Scripture = ScriptureDescendant[];

export function toScripture(text?: string | Scripture | null | undefined): Scripture {
    if (!text) { // null, undefined, "", []
        return [{
            type: "paragraph",
            children: [{ text: "" }],
        }];
    }
    if (Array.isArray(text)) {
        return text;
    }
    if (!text.startsWith("[")) {
        return [{
            type: "paragraph",
            children: [{ text }],
        }];
    }
    return JSON.parse(text);
}

export function scriptureToHtml(scripture?: Scripture | null | undefined): string {
    if (!scripture) { // null, undefined, "", []
        return "";
    }
    return scripture.map(scriptureToHtmlNode).join("");
}

function scriptureToHtmlNode(descendant: ScriptureDescendant): string {
    if (isScriptureElement(descendant)) {
        switch (descendant.type) {
            case "paragraph":
                return `<p>${scriptureToHtml(descendant.children as Scripture)}</p>`;
        }
    }
    if (SlateText.isText(descendant)) {
        return htmlEntities(descendant.text);
    }
    return "";
}

export function scriptureExtractUrls(scripture: Scripture): string[] {
    return scripture
        .map(node =>
            isLinkElement(node)
                ? node.href
                : (isScriptureElement(node) ? scriptureExtractUrls(node.children as Scripture) : [])
        ).flat();
}
