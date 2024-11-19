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

export const isScriptureElement = (value: any): value is ScriptureElement =>
    SlateElement.isElement(value) && "type" in value;

/* text */

export interface ScriptureMarks {
    bold?: boolean;
    italic?: boolean;
    strikeout?: boolean;
}

export const equalScriptureMarks = (a: ScriptureMarks, b: ScriptureMarks): boolean =>
    Boolean(a.bold) === Boolean(b.bold)
    && Boolean(a.italic) === Boolean(b.italic)
    && Boolean(a.strikeout) === Boolean(b.strikeout);

export type ScriptureText = SlateText & ScriptureMarks;

export const isScriptureText = (value: any): value is ScriptureText =>
    SlateText.isText(value);

export const createScriptureText = (text: string, attributes: Record<string, any> = {}): ScriptureText =>
    ({text, ...attributes});

/* document */

export const SCRIPTURE_INLINE_TYPES: string[] = ["link"];

export type ScriptureDescendant = ScriptureElement | ScriptureText;

// Slate editor JSON format
export type Scripture = ScriptureDescendant[];
