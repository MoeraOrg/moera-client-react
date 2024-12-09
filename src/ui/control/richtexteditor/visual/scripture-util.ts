import { BaseEditor, BaseElement, Node as SlateNode, NodeEntry, Path, Transforms } from 'slate';

import { SMILEY_LIKE } from "smileys";
import {
    createBlockquoteElement,
    createCodeBlockElement,
    createDetailsElement,
    createHeadingElement,
    createHorizontalRuleElement,
    createIframeElement,
    createLinkElement,
    createListItemElement,
    createMentionElement,
    createParagraphElement,
    createScriptureText,
    createSpoilerBlockElement,
    createSpoilerElement,
    equalScriptureMarks,
    isLinkElement,
    isListItemElement,
    isScriptureElement,
    isScriptureText,
    Scripture,
    SCRIPTURE_INLINE_TYPES,
    SCRIPTURE_VOID_TYPES,
    ScriptureDescendant,
    ScriptureElement,
    ScriptureElementType,
    ScriptureMarks,
    ScriptureText
} from "ui/control/richtexteditor/visual/scripture";
import * as Browser from "ui/browser";
import { htmlEntities, unhtmlEntities } from "util/html";
import { smileyReplacer, TextReplacementFunction } from "util/text";

interface WrappingElementOptions {
    at?: Path;
    reverse?: boolean;
}

export function findWrappingElement<T extends ScriptureElement>(
    editor: BaseEditor, type: T["type"] | T["type"][], options?: WrappingElementOptions
): NodeEntry<T> | null {
    const {at, reverse} = options ?? {};
    const path = at ?? editor.selection?.anchor.path;
    if (path == null) {
        return null;
    }
    const ancestors = SlateNode.ancestors(editor, path, {reverse: reverse ?? true});
    for (const ancestor of ancestors) {
        const [element, path] = ancestor;
        if (
            isScriptureElement(element)
            && ((Array.isArray(type) && type.includes(element.type)) || element.type === type)
        ) {
            return [element as T, path];
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

    const context = {attributes: {}, listOrdered: false, listLevel: 0};
    const scripture = domToScripture(new DOMParser().parseFromString(text, "text/html").body, context);
    if (scripture == null) {
        return [createParagraphElement([createScriptureText("")])];
    }
    if (!Array.isArray(scripture)) {
        return [scripture];
    }
    return scripture;
}

interface DomToScriptureContext {
    attributes: ScriptureMarks;
    listOrdered: boolean;
    listLevel: number;
}

function domToScripture(node: Node, context: DomToScriptureContext): Scripture | ScriptureDescendant | null {
    if (node.nodeType === Node.TEXT_NODE) {
        return createScriptureText(node.textContent ?? "", context.attributes);
    } else if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const element: Element = node as Element;
    const attributes: ScriptureMarks = {...context.attributes};
    let {listOrdered, listLevel} = context;

    switch (element.nodeName) {
        case "B":
            attributes.bold = true;
            break;
        case "I":
            attributes.italic = true;
            break;
        case "S":
        case "STRIKE":
            attributes.strikeout = true;
            break;
        case "CODE":
            attributes.code = true;
            break;
        case "SUB":
            attributes.supsub = -1;
            break;
        case "SUP":
            attributes.supsub = 1;
            break;
        case "OL":
            listOrdered = true;
            listLevel++;
            break;
        case "UL":
            listOrdered = false;
            listLevel++;
            break;
    }

    const childNodes = Array.from(element.childNodes)
        .map(node => domToScripture(node, {attributes, listOrdered, listLevel}))
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
        case "LI":
            return [
                createListItemElement(
                    context.listOrdered,
                    context.listLevel,
                    children.filter(node => !isListItemElement(node))
                ),
                ...children.filter(isListItemElement)
            ];
        case "H1":
            return createHeadingElement(1, children);
        case "H2":
            return createHeadingElement(2, children);
        case "H3":
            return createHeadingElement(3, children);
        case "H4":
            return createHeadingElement(4, children);
        case "H5":
            return createHeadingElement(5, children);
        case "IFRAME":
            return createIframeElement(element.outerHTML);
        case "DIV":
            if (element.classList.contains("mr-video")) {
                return createIframeElement(element.innerHTML);
            }
            return children;
        case "DETAILS": {
            const summaryElement = element.querySelector(":scope > summary");
            const summary = summaryElement?.textContent ?? "";
            return createDetailsElement(summary, children);
        }
        case "SUMMARY": {
            return null;
        }
        case "PRE":
            return createCodeBlockElement(children);
        default:
            return children;
    }
}

export function scriptureToHtml(scripture?: Scripture | null | undefined): string {
    if (!scripture) { // null, undefined, "", []
        return "";
    }

    const context = {output: "", openStack: [], listStack: []};
    scriptureNodesToHtml(scripture, context);

    return context.output;
}

interface ScriptureToHtmlContext {
    output: string;
    openStack: string[];
    listStack: boolean[];
}

function scriptureNodesToHtml(nodes: ScriptureDescendant[], context: ScriptureToHtmlContext): void {
    const {listStack} = context;
    context.listStack = [];
    nodes.forEach(node => scriptureNodeToHtml(node, context));
    context.listStack = listStack;
}

const STANDALONE_VIDEO = /^(?:<iframe.*<\/iframe>|<video.*<\/video>)$/i;

function scriptureNodeToHtml(node: ScriptureDescendant, context: ScriptureToHtmlContext): void {
    const listLevel = (ordered: boolean, level: number) => {
        if (level > context.listStack.length) {
            if (context.output.endsWith("</li>")) {
                context.output = context.output.substring(0, context.output.length - 5);
            }
            for (let i = 0; i < level - context.listStack.length; i++) {
                if (i !== 0) {
                    context.output += "<li>";
                }
                context.output += listOpenTag(ordered, context.listStack.length + 1);
                context.listStack.push(ordered);
            }
        }
        if (level < context.listStack.length) {
            for (let i = context.listStack.length; i > level; i--) {
                const o = context.listStack.pop()!;
                context.output += listCloseTag(o);
                if (i !== 1) {
                    context.output += "</li>";
                }
            }
        }
        if (
            level > 0
            && level === context.listStack.length
            && ordered !== context.listStack[context.listStack.length - 1]
        ) {
            const o = context.listStack.pop()!;
            context.output += listCloseTag(o);
            context.output += listOpenTag(ordered, context.listStack.length + 1);
            context.listStack.push(ordered);
        }
    }

    if (isScriptureElement(node)) {
        closeAllTags(context);
        if (node.type !== "list-item") {
            listLevel(false, 0);
        }
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
            case "list-item":
                listLevel(node.ordered, node.level);
                context.output += "<li>";
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</li>";
                return;
            case "heading":
                context.output += `<h${node.level}>`;
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += `</h${node.level}>`;
                return;
            case "iframe":
                if (STANDALONE_VIDEO.test(node.code)) {
                    context.output += node.code;
                } else {
                    context.output += "<div class='mr-video'>" + node.code + "</div>";
                }
                return;
            case "details":
                context.output += "<details>";
                if (node.summary) {
                    context.output += `<summary>${node.summary}</summary>`;
                }
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</details>";
                return;
            case "code-block":
                context.output += "<pre>";
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</pre>";
                return;
        }
    }
    if (isScriptureText(node)) {
        scriptureTextToHtml(node, context);
        return;
    }
}

function listOpenTag(ordered: boolean, level: number): string {
    if (ordered) {
        switch (level % 3) {
            default:
            case 1:
                return "<ol>";
            case 2:
                return "<ol type='a'>";
            case 0:
                return "<ol type='i'>";
        }
    } else {
        switch (level % 3) {
            default:
            case 1:
                return "<ul>";
            case 2:
                return "<ul type='circle'>";
            case 0:
                return "<ul type='square'>";
        }
    }
}

const listCloseTag = (ordered: boolean): string =>
    ordered ? "</ol>" : "</ul>";

function scriptureTextToHtml(node: ScriptureText, context: ScriptureToHtmlContext): void {
    const toOpen = new Set<string>();
    const toClose = new Set<string>();

    requireTag("b", node.bold, toOpen, toClose, context);
    requireTag("i", node.italic, toOpen, toClose, context);
    requireTag("s", node.strikeout, toOpen, toClose, context);
    requireTag("code", node.code, toOpen, toClose, context);
    requireTag("sub", (node.supsub ?? 0) < 0, toOpen, toClose, context);
    requireTag("sup", (node.supsub ?? 0) > 0, toOpen, toClose, context);

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
