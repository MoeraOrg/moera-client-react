import { Ancestor, BaseEditor, BaseElement, Node as SlateNode, NodeEntry, Transforms } from 'slate';

import { SMILEY_LIKE } from "smileys";
import {
    createBlockquoteElement,
    createHorizontalRuleElement,
    createLinkElement,
    createListItemElement,
    createMentionElement,
    createOrderedListElement,
    createParagraphElement,
    createScriptureText,
    createSpoilerBlockElement,
    createSpoilerElement,
    createUnorderedListElement,
    equalScriptureMarks,
    isLinkElement,
    isScriptureElement,
    isScriptureText,
    Scripture,
    SCRIPTURE_INLINE_TYPES,
    SCRIPTURE_VOID_TYPES,
    ScriptureDescendant,
    ScriptureElementType,
    ScriptureMarks,
    ScriptureText
} from "ui/control/richtexteditor/visual/scripture";
import * as Browser from "ui/browser";
import { htmlEntities, unhtmlEntities } from "util/html";
import { smileyReplacer, TextReplacementFunction } from "util/text";

export function findWrappingElement(
    editor: BaseEditor, type: ScriptureElementType | ScriptureElementType[]
): NodeEntry<Ancestor> | null {
    if (editor.selection == null) {
        return null;
    }
    const ancestors = SlateNode.ancestors(editor, editor.selection.anchor.path, {reverse: true});
    for (const ancestor of ancestors) {
        const [element] = ancestor;
        if (
            isScriptureElement(element)
            && ((Array.isArray(type) && type.includes(element.type)) || element.type === type)
        ) {
            return ancestor;
        }
    }
    return null;
}

export const isSelectionInElement = (
    editor: BaseEditor, type: ScriptureElementType | ScriptureElementType[]
): boolean =>
    findWrappingElement(editor, type) != null;

export function withScripture<T extends BaseEditor>(editor: T): T {
    const {isInline, isVoid} = editor;
    editor.isInline = (element: BaseElement) =>
        (isScriptureElement(element) && SCRIPTURE_INLINE_TYPES.includes(element.type)) || isInline(element);
    editor.isVoid = (element: BaseElement) =>
        (isScriptureElement(element) && SCRIPTURE_VOID_TYPES.includes(element.type)) || isVoid(element);
    return editor;
}

export function toScripture(text?: string | Scripture | null | undefined): Scripture {
    if (!text) { // null, undefined, "", []
        return [createParagraphElement([createScriptureText("")])];
    }
    if (Array.isArray(text)) {
        return text;
    }

    const scripture = domToScripture(new DOMParser().parseFromString(text, "text/html").body);
    if (scripture == null) {
        return [createParagraphElement([createScriptureText("")])];
    }
    if (!Array.isArray(scripture)) {
        return [scripture];
    }
    return scripture;
}

function domToScripture(node: Node, attributes: ScriptureMarks = {}): Scripture | ScriptureDescendant | null {
    if (node.nodeType === Node.TEXT_NODE) {
        return createScriptureText(node.textContent ?? "", attributes);
    } else if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const element: Element = node as Element;
    const markAttributes: ScriptureMarks = {...attributes};

    switch (element.nodeName) {
        case "B":
            markAttributes.bold = true;
            break;
        case "I":
            markAttributes.italic = true;
            break;
        case "S":
        case "STRIKE":
            markAttributes.strikeout = true;
            break;
    }

    const childNodes = Array.from(element.childNodes)
        .map(node => domToScripture(node, markAttributes))
        .filter((node: Scripture | ScriptureDescendant | null): node is Scripture | ScriptureDescendant => node != null)
        .flat();

    const children: Scripture = [];
    let prevInline = true;
    for (const node of childNodes) {
        if (isScriptureText(node) && children.length > 0) {
            const prevNode = children[children.length - 1];
            if (isScriptureText(prevNode) && equalScriptureMarks(prevNode, node)) {
                prevNode.text += node.text;
                continue;
            }
        }
        if (isScriptureElement(node) && SCRIPTURE_INLINE_TYPES.includes(node.type)) {
            if (prevInline) {
                children.push(createScriptureText(""));
            }
            prevInline = true;
        } else {
            prevInline = false;
        }
        children.push(node);
    }
    if (prevInline) {
        children.push(createScriptureText(""));
    }

    switch (element.nodeName) {
        case "BODY":
            return children;
        case "P":
            return createParagraphElement(children);
        case "A":
            const nodeName = element.getAttribute("data-nodename");
            if (nodeName == null) {
                return createLinkElement(unhtmlEntities(element.getAttribute("href") ?? ""), children);
            } else {
                return createMentionElement(unhtmlEntities(nodeName), children);
            }
        case "MR-SPOILER":
            return createSpoilerElement(unhtmlEntities(element.getAttribute("title") ?? ""), children);
        case "MR-SPOILER-BLOCK":
            return createSpoilerBlockElement(unhtmlEntities(element.getAttribute("title") ?? ""), children);
        case "HR":
            return createHorizontalRuleElement();
        case "BR":
            return createScriptureText("\n", attributes);
        case "BLOCKQUOTE":
            return createBlockquoteElement(children);
        case "UL":
            return createUnorderedListElement(children);
        case "OL":
            return createOrderedListElement(children);
        case "LI":
            return createListItemElement(children);
        default:
            return children;
    }
}

export function scriptureToHtml(scripture?: Scripture | null | undefined): string {
    if (!scripture) { // null, undefined, "", []
        return "";
    }

    const context = {output: "", openStack: []};
    scriptureNodesToHtml(scripture, context);

    return context.output;
}

interface ScriptureToHtmlContext {
    output: string;
    openStack: string[];
}

function scriptureNodesToHtml(nodes: ScriptureDescendant[], context: ScriptureToHtmlContext): void {
    nodes.forEach(node => scriptureNodeToHtml(node, context));
}

function scriptureNodeToHtml(node: ScriptureDescendant, context: ScriptureToHtmlContext): void {
    if (isScriptureElement(node)) {
        closeAllTags(context);
        switch (node.type) {
            case "paragraph":
                context.output += "<p>";
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</p>";
                return;
            case "link":
                context.output += `<a href="${htmlEntities(node.href)}">`;
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</a>";
                return;
            case "spoiler":
                context.output += `<mr-spoiler title="${htmlEntities(node.title)}">`;
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</mr-spoiler>";
                return;
            case "spoiler-block":
                context.output += `<mr-spoiler-block title="${htmlEntities(node.title)}">`;
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</mr-spoiler-block>";
                return;
            case "mention":
                const href = Browser.universalLocation(null, node.nodeName, null, "/");
                context.output += `<a href="${htmlEntities(href)}" data-nodename="${htmlEntities(node.nodeName ?? "")}"`
                context.output += ' data-href="/">';
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</a>";
                return;
            case "horizontal-rule":
                context.output += "<hr>";
                return;
            case "blockquote":
                context.output += "<blockquote>";
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</blockquote>";
                return;
            case "list-unordered":
                context.output += "<ul>";
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</ul>";
                return;
            case "list-ordered":
                context.output += "<ol>";
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</ol>";
                return;
            case "list-item":
                context.output += "<li>";
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</li>";
                return;
        }
    }
    if (isScriptureText(node)) {
        scriptureTextToHtml(node, context);
        return;
    }
}

function scriptureTextToHtml(node: ScriptureText, context: ScriptureToHtmlContext): void {
    const toOpen = new Set<string>();
    const toClose = new Set<string>();

    requireTag("b", node.bold, toOpen, toClose, context);
    requireTag("i", node.italic, toOpen, toClose, context);
    requireTag("s", node.strikeout, toOpen, toClose, context);

    while (toClose.size > 0) {
        const tag = context.openStack.pop();
        if (tag == null) {
            console.error("Unexpected stack underflow in scriptureTextToHtml()");
            return;
        }
        context.output += `</${tag}>`;
        if (toClose.has(tag)) {
            toClose.delete(tag);
        } else {
            toOpen.add(tag);
        }
    }

    toOpen.forEach(tag => {
        context.output += `<${tag}>`;
        context.openStack.push(tag);
    });

    context.output += htmlEntities(node.text).replaceAll("\n", "<br>");
}

function requireTag(
    tagName: string, isPresent: boolean | undefined, toOpen: Set<string>, toClose: Set<string>,
    context: ScriptureToHtmlContext
): void {
    const isOpen = context.openStack.includes(tagName);
    if (isOpen && !isPresent) {
        toClose.add(tagName);
    }
    if (!isOpen && isPresent) {
        toOpen.add(tagName);
    }
}

function closeAllTags(context: ScriptureToHtmlContext): void {
    while (context.openStack.length > 0) {
        const tag = context.openStack.pop();
        context.output += `</${tag}>`;
    }
}

export function scriptureExtractUrls(scripture: Scripture): string[] {
    return scripture
        .map(node =>
            isLinkElement(node)
                ? node.href
                : (isScriptureElement(node) ? scriptureExtractUrls(node.children as Scripture) : [])
        ).flat();
}

function scriptureReplace(editor: BaseEditor, pattern: RegExp, replacer: TextReplacementFunction): void {
    const textNodes = SlateNode.texts(editor, {pass: node => isScriptureText(node) && node.text.length > 0});
    for (const [{text}, path] of textNodes) {
        let delta = 0;
        while (true) {
            const match = pattern.exec(text);
            if (match == null) {
                break;
            }

            const replacement = replacer(match[0], ...match.slice(1));
            if (replacement !== match[0]) {
                const at = {path, offset: match.index + delta};
                Transforms.delete(editor, {at, distance: match[0].length, unit: "character"});
                Transforms.insertText(editor, replacement, {at});
                delta += replacement.length - match[0].length;
            }
        }
    }
}

export function scriptureReplaceSmileys(editor: BaseEditor, removeEscapes: boolean = true): void {
    scriptureReplace(editor, SMILEY_LIKE, smileyReplacer(removeEscapes));
}
