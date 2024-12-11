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

/* MR-SPOILER */

export interface SpoilerElement extends SlateElement {
    type: "spoiler";
    title: string;
}

export const isSpoilerElement = (value: any): value is SpoilerElement =>
    isScriptureElement(value) && value.type === "spoiler";

export const createSpoilerElement = (title: string, children: Scripture): SpoilerElement =>
    ({type: "spoiler", title, children});

/* MR-SPOILER-BLOCK */

export interface SpoilerBlockElement extends SlateElement {
    type: "spoiler-block";
    title: string;
}

export const isSpoilerBlockElement = (value: any): value is SpoilerBlockElement =>
    isScriptureElement(value) && value.type === "spoiler-block";

export const createSpoilerBlockElement = (title: string, children: Scripture): SpoilerBlockElement =>
    ({type: "spoiler-block", title, children});

/* MENTION */

export interface MentionElement extends SlateElement {
    type: "mention";
    nodeName: string;
}

export const isMentionElement = (value: any): value is MentionElement =>
    isScriptureElement(value) && value.type === "mention";

export const createMentionElement = (nodeName: string, children: Scripture): MentionElement =>
    ({type: "mention", nodeName, children});

/* HR */

export interface HorizontalRuleElement extends SlateElement {
    type: "horizontal-rule";
}

export const isHorizontalRuleElement = (value: any): value is HorizontalRuleElement =>
    isScriptureElement(value) && value.type === "horizontal-rule";

export const createHorizontalRuleElement = (): HorizontalRuleElement =>
    ({type: "horizontal-rule", children: [createScriptureText("")]});

/* BLOCKQUOTE */

export interface BlockquoteElement extends SlateElement {
    type: "blockquote";
}

export const isBlockquoteElement = (value: any): value is BlockquoteElement =>
    isScriptureElement(value) && value.type === "blockquote";

export const createBlockquoteElement = (children: Scripture): BlockquoteElement =>
    ({type: "blockquote", children});

/* LI */

export interface ListItemElement extends SlateElement {
    type: "list-item";
    ordered: boolean;
    level: number;
}

export const isListItemElement = (value: any): value is ListItemElement =>
    isScriptureElement(value) && value.type === "list-item";

export const createListItemElement = (ordered: boolean, level: number, children: Scripture): ListItemElement =>
    ({type: "list-item", ordered, level, children});

/* H? */

export interface HeadingElement extends SlateElement {
    type: "heading";
    level: number;
}

export const isHeadingElement = (value: any): value is HeadingElement =>
    isScriptureElement(value) && value.type === "heading";

export const createHeadingElement = (level: number, children: Scripture): HeadingElement =>
    ({type: "heading", level, children});

/* IFRAME */

export interface IframeElement extends SlateElement {
    type: "iframe";
    code: string;
}

export const isIframeElement = (value: any): value is IframeElement =>
    isScriptureElement(value) && value.type === "iframe";

export const createIframeElement = (code: string): IframeElement =>
    ({type: "iframe", code, children: [createScriptureText("")]});

/* DETAILS */

export interface DetailsElement extends SlateElement {
    type: "details";
    summary: string;
}

export const isDetailsElement = (value: any): value is DetailsElement =>
    isScriptureElement(value) && value.type === "details";

export const createDetailsElement = (summary: string, children: Scripture): DetailsElement =>
    ({type: "details", summary, children});

/* PRE */

export interface CodeBlockElement extends SlateElement {
    type: "code-block";
}

export const isCodeBlockElement = (value: any): value is CodeBlockElement =>
    isScriptureElement(value) && value.type === "code-block";

export const createCodeBlockElement = (children: Scripture): CodeBlockElement =>
    ({type: "code-block", children});

/* KATEX */

export interface FormulaElement extends SlateElement {
    type: "formula";
    content: string;
}

export const isFormulaElement = (value: any): value is FormulaElement =>
    isScriptureElement(value) && value.type === "formula";

export const createFormulaElement = (content: string): FormulaElement =>
    ({type: "formula", content, children: [createScriptureText("")]});

/* KATEX-BLOCK */

export interface FormulaBlockElement extends SlateElement {
    type: "formula-block";
    content: string;
}

export const isFormulaBlockElement = (value: any): value is FormulaBlockElement =>
    isScriptureElement(value) && value.type === "formula-block";

export const createFormulaBlockElement = (content: string): FormulaBlockElement =>
    ({type: "formula-block", content, children: [createScriptureText("")]});

/* element */

export type ScriptureElement =
    ParagraphElement
    | LinkElement
    | SpoilerElement
    | SpoilerBlockElement
    | MentionElement
    | HorizontalRuleElement
    | BlockquoteElement
    | ListItemElement
    | HeadingElement
    | IframeElement
    | DetailsElement
    | CodeBlockElement
    | FormulaElement
    | FormulaBlockElement;

export const isScriptureElement = (value: any): value is ScriptureElement =>
    SlateElement.isElement(value) && "type" in value;

/* text */

export interface ScriptureMarks {
    bold?: boolean;
    italic?: boolean;
    strikeout?: boolean;
    code?: boolean;
    supsub?: number;
}

export const equalScriptureMarks = (a: ScriptureMarks, b: ScriptureMarks): boolean =>
    Boolean(a.bold) === Boolean(b.bold)
    && Boolean(a.italic) === Boolean(b.italic)
    && Boolean(a.strikeout) === Boolean(b.strikeout)
    && Boolean(a.code) === Boolean(b.code)
    && (a.supsub ?? 0) === (b.supsub ?? 0);

export type ScriptureText = SlateText & ScriptureMarks;

export const isScriptureText = (value: any): value is ScriptureText =>
    SlateText.isText(value);

export const createScriptureText = (text: string, attributes: Record<string, any> = {}): ScriptureText =>
    ({text, ...attributes});

/* document */

export type ScriptureElementType = ScriptureElement["type"];

export const SCRIPTURE_INLINE_TYPES: ScriptureElementType[] = ["link", "spoiler", "mention", "formula"];

export const SCRIPTURE_VOID_TYPES: ScriptureElementType[] = ["horizontal-rule", "iframe", "formula", "formula-block"];

export type ScriptureDescendant = ScriptureElement | ScriptureText;

// Slate editor JSON format
export type Scripture = ScriptureDescendant[];
