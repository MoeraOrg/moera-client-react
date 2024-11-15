import { Element as SlateElement, Text as SlateText } from 'slate';

/* P */

export interface ParagraphElement extends SlateElement {
    type: "paragraph";
}

export const isParagraphElement = (value: any): value is ParagraphElement =>
    isScriptureElement(value) && value.type === "paragraph";

export const createParagraphElement = (children: Scripture): ParagraphElement =>
    ({type: "paragraph", children});

/* A */

export interface LinkElement extends SlateElement {
    type: "link";
    href: string;
}

export const isLinkElement = (value: any): value is LinkElement =>
    isScriptureElement(value) && value.type === "link";

export const createLinkElement = (href: string, children: Scripture): LinkElement =>
    ({type: "link", href, children});

/* element */

export type ScriptureElement = ParagraphElement | LinkElement;

export function isScriptureElement(value: any): value is ScriptureElement {
    return SlateElement.isElement(value) && "type" in value;
}

/* text */

export type ScriptureText = SlateText;

export const createScriptureText = (text: string, attributes: Record<string, any> = {}): ScriptureText =>
    ({text, ...attributes});

/* document */

export type ScriptureDescendant = ScriptureElement | ScriptureText;

// Slate editor JSON format
export type Scripture = ScriptureDescendant[];
