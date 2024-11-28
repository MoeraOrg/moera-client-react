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

/* UL */

export interface UnorderedListElement extends SlateElement {
    type: "list-unordered";
}

export const isUnorderedListElement = (value: any): value is UnorderedListElement =>
    isScriptureElement(value) && value.type === "list-unordered";

export const createUnorderedListElement = (children: Scripture): UnorderedListElement =>
    ({type: "list-unordered", children});

/* OL */

export interface OrderedListElement extends SlateElement {
    type: "list-ordered";
}

export const isOrderedListElement = (value: any): value is OrderedListElement =>
    isScriptureElement(value) && value.type === "list-ordered";

export const createOrderedListElement = (children: Scripture): OrderedListElement =>
    ({type: "list-ordered", children});

/* LI */

export type ListElement = UnorderedListElement | OrderedListElement;

export interface ListItemElement extends SlateElement {
    type: "list-item";
}

export const isListItemElement = (value: any): value is ListItemElement =>
    isScriptureElement(value) && value.type === "list-item";

export const createListItemElement = (children: Scripture): ListItemElement =>
    ({type: "list-item", children});

/* element */

export type ScriptureElement =
    ParagraphElement
    | LinkElement
    | SpoilerElement
    | SpoilerBlockElement
    | MentionElement
    | HorizontalRuleElement
    | BlockquoteElement
    | UnorderedListElement
    | OrderedListElement
    | ListItemElement;

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

export type ScriptureElementType = ScriptureElement["type"];

export const SCRIPTURE_INLINE_TYPES: ScriptureElementType[] = ["link", "spoiler", "mention"];

export const SCRIPTURE_VOID_TYPES: ScriptureElementType[] = ["horizontal-rule"];

export type ScriptureDescendant = ScriptureElement | ScriptureText;

// Slate editor JSON format
export type Scripture = ScriptureDescendant[];
