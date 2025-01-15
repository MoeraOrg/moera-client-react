import { Descendant } from 'slate';

import { PrivateMediaFileInfo } from "api";
import {
    createBlockquoteElement,
    createCodeBlockElement,
    createDetailsElement,
    createFormulaBlockElement,
    createFormulaElement,
    createHeadingElement,
    createHorizontalRuleElement,
    createIframeElement,
    createImageElement,
    createLinkElement,
    createListItemElement,
    createMentionElement,
    createParagraphElement,
    createScriptureText,
    createSpoilerBlockElement,
    createSpoilerElement,
    equalScriptureMarks,
    isImageElement,
    isLinkElement,
    isListItemElement,
    isScriptureBlock,
    isScriptureElement,
    isScriptureInline,
    isScriptureRegularInline,
    isScriptureSimpleBlock,
    isScriptureSuperBlock,
    isScriptureText, isScriptureVoid,
    isScriptureVoidBlock,
    Scripture,
    ScriptureDescendant,
    ScriptureElementType,
    ScriptureMarks,
    ScriptureText
} from "ui/control/richtexteditor/visual/scripture";
import { findStandardSize, getImageDimensions } from "ui/control/richtexteditor/media/rich-text-image";
import * as Browser from "ui/browser";
import { htmlEntities, htmlToEmoji, linefeedsToHtml, safeImportHtml, unhtmlEntities } from "util/html";
import { isNumericString, notNull } from "util/misc";

export function htmlToScripture(
    text?: string | Scripture | null | undefined, cleanup?: boolean, media?: PrivateMediaFileInfo[] | null
): Scripture {
    if (!text) { // null, undefined, "", []
        return [createParagraphElement([createScriptureText("")])];
    }
    if (Array.isArray(text)) {
        return text;
    }

    const context = {attributes: {}, listOrdered: false, listLevel: 0, media: media ?? []};
    let scripture = domToScripture(new DOMParser().parseFromString(text, "text/html").body, context);
    if (scripture == null) {
        return [createParagraphElement([createScriptureText("")])];
    }
    if (!Array.isArray(scripture)) {
        scripture = [scripture];
    }
    scripture = normalizeFragment(scripture);
    if (cleanup) {
        scripture = scriptureCleanup(scripture);
    }
    return scripture;
}

interface DomToScriptureContext {
    attributes: ScriptureMarks;
    listOrdered: boolean;
    listLevel: number;
    media: PrivateMediaFileInfo[];
}

function domToScripture(node: Node, context: DomToScriptureContext): Scripture | ScriptureDescendant | null {
    if (node.nodeType === Node.TEXT_NODE) {
        return createScriptureText(node.textContent ?? "", context.attributes);
    } else if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const element: Element = node as Element;
    const attributes: ScriptureMarks = {...context.attributes};
    let {listOrdered, listLevel, media} = context;

    switch (element.nodeName) {
        case "B":
        case "STRONG":
        case "U":
            attributes.bold = true;
            break;
        case "I":
        case "EM":
        case "CITE":
        case "Q":
            attributes.italic = true;
            break;
        case "S":
        case "STRIKE":
        case "DEL":
            attributes.strikeout = true;
            break;
        case "CODE":
        case "KBD":
        case "SAMP":
        case "VAR":
            attributes.code = true;
            break;
        case "SUB":
            attributes.supsub = -1;
            break;
        case "SUP":
            attributes.supsub = 1;
            break;
        case "INS":
        case "MARK":
            attributes.mark = true;
            break;
        case "OL":
        case "DL":
            listOrdered = true;
            listLevel++;
            break;
        case "UL":
            listOrdered = false;
            listLevel++;
            break;
    }

    const children = Array.from(element.childNodes)
        .map(node => domToScripture(node, {attributes, listOrdered, listLevel, media}))
        .filter(notNull)
        .flat();

    switch (element.nodeName) {
        case "BODY":
            return children;
        case "P":
        case "H6":
        case "TD":
        case "TH":
            return createParagraphElement(children);
        case "A":
            const nodeName = element.getAttribute("data-nodename");
            if (nodeName == null) {
                const href = unhtmlEntities(element.getAttribute("href"));
                return href ? createLinkElement(href, children) : null;
            } else {
                return createMentionElement(unhtmlEntities(nodeName), children);
            }
        case "MR-SPOILER":
            return createSpoilerElement(unhtmlEntities(element.getAttribute("title")), children);
        case "MR-SPOILER-BLOCK":
            return createSpoilerBlockElement(unhtmlEntities(element.getAttribute("title")), children);
        case "HR":
            return createHorizontalRuleElement();
        case "BR":
            return createScriptureText("\n", attributes);
        case "BLOCKQUOTE":
            return createBlockquoteElement(children);
        case "LI":
        case "DD":
            return [
                createListItemElement(
                    context.listOrdered,
                    context.listLevel,
                    children.filter(node => !isListItemElement(node))
                ),
                ...children.filter(isListItemElement)
            ];
        case "DT":
            return [
                createListItemElement(
                    context.listOrdered,
                    context.listLevel,
                    children
                        .filter(node => !isListItemElement(node))
                        .map(node => isScriptureText(node) ? {...node, bold: true} : node)
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
        case "VIDEO":
        case "AUDIO":
            return createIframeElement(element.outerHTML);
        case "SPAN":
            if (element.classList.contains("katex")) {
                return createFormulaElement(unhtmlEntities(element.textContent));
            }
            return children;
        case "DIV":
            if (element.classList.contains("mr-spoiler")) {
                return createSpoilerBlockElement(unhtmlEntities(element.getAttribute("data-title")), children);
            }
            if (element.classList.contains("mr-video")) {
                return createIframeElement(element.innerHTML);
            }
            if (element.classList.contains("katex")) {
                return createFormulaBlockElement(unhtmlEntities(element.textContent));
            }
            return children;
        case "DETAILS": {
            const summaryElement = element.querySelector(":scope > summary");
            const summary = unhtmlEntities(summaryElement?.textContent);
            return createDetailsElement(summary, children);
        }
        case "SUMMARY":
            return null;
        case "PRE":
            return createCodeBlockElement(children);
        case "IMG": {
            let src: string | PrivateMediaFileInfo = element.getAttribute("src") ?? "";
            if (src.startsWith("hash:")) {
                const hash = src.substring(5);
                src = media.find(mf => mf.hash === hash) ?? src;
            }
            const widthS = element.getAttribute("width");
            const width = widthS != null && isNumericString(widthS) ? parseInt(widthS, 10) : undefined;
            const heightS = element.getAttribute("height");
            const height = heightS != null && isNumericString(heightS) ? parseInt(heightS, 10) : undefined;
            const standardSize = findStandardSize(width, height);
            const customWidth = standardSize === "custom" ? width : undefined;
            const customHeight = standardSize === "custom" ? height : undefined;
            return createImageElement(src, standardSize, customWidth, customHeight);
        }
        case "FIGURE": {
            const captionElement = element.querySelector(":scope > figcaption");
            const caption = unhtmlEntities(captionElement?.textContent) || undefined;
            const imageElement = children.find(isImageElement);
            if (imageElement == null) {
                return null;
            }
            if (!caption) {
                return imageElement;
            }
            return {...imageElement, type: "figure-image", caption};
        }
        case "FIGCAPTION":
            return null;
        default:
            return children;
    }
}

export const safeImportScripture = (html: string | null | undefined): Scripture =>
    htmlToScripture(htmlToEmoji(linefeedsToHtml(safeImportHtml(html?.replaceAll("\n", " ")))), true);

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
    closeAllTags(context);
    listLevel(false, 0, context);
    context.listStack = listStack;
}

const STANDALONE_VIDEO = /^(?:<iframe.*<\/iframe>|<video.*<\/video>|<audio.*<\/audio>)$/i;

function scriptureNodeToHtml(node: ScriptureDescendant, context: ScriptureToHtmlContext): void {
    if (isScriptureElement(node)) {
        closeAllTags(context);
        if (node.type !== "list-item") {
            listLevel(false, 0, context);
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
                context.output += `<a href="${htmlEntities(href)}" data-nodename="${htmlEntities(node.nodeName)}"`
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
                listLevel(node.ordered, node.level, context);
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
                    context.output += `<div class="mr-video">${node.code}</div>`;
                }
                return;
            case "details":
                context.output += "<details>";
                if (node.summary) {
                    context.output += `<summary>${htmlEntities(node.summary)}</summary>`;
                }
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</details>";
                return;
            case "code-block":
                context.output += "<pre>";
                scriptureNodesToHtml(node.children as ScriptureDescendant[], context);
                context.output += "</pre>";
                return;
            case "formula":
                context.output += `<span class="katex">${htmlEntities(node.content)}</span>`;
                return;
            case "formula-block":
                context.output += `<div class="katex">${htmlEntities(node.content)}</div>`;
                return;
            case "image": {
                const src = node.href ?? "hash:" + node.mediaFile?.hash;
                const {width, height} = getImageDimensions(
                    node.standardSize ?? "large", node.customWidth, node.customHeight
                );
                const widthAttr = width != null ? ` width="${width}"` : "";
                const heightAttr = height != null ? ` height="${height}"` : "";
                context.output += `<img${widthAttr}${heightAttr} src="${htmlEntities(src)}">`;
                return;
            }
            case "figure-image": {
                context.output += "<figure>";
                const src = node.href ?? "hash:" + node.mediaFile?.hash;
                const {width, height} = getImageDimensions(
                    node.standardSize ?? "large", node.customWidth, node.customHeight
                );
                const widthAttr = width != null ? ` width="${width}"` : "";
                const heightAttr = height != null ? ` height="${height}"` : "";
                context.output += `<img${widthAttr}${heightAttr} src="${htmlEntities(src)}">`;
                context.output += `<figcaption>${htmlEntities(node.caption)}</figcaption></figure>`;
                return;
            }
        }
    }
    if (isScriptureText(node)) {
        scriptureTextToHtml(node, context);
        return;
    }
}

function listLevel(ordered: boolean, level: number, context: ScriptureToHtmlContext): void {
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
    requireTag("mark", node.mark, toOpen, toClose, context);

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

// NOTE: normalization functions modify the scripture passed to their input

export function normalizeDocument(nodes: Descendant[]): Scripture {
    return normalizeBlocks(nodes);
}

function normalizeFragment(nodes: Descendant[]): Scripture {
    const hasBlocks = nodes.some(d => isScriptureElement(d) && isScriptureBlock(d));
    return hasBlocks ? normalizeBlocks(nodes) : normalizeInlines(nodes, []);
}

function normalizeBlocks(nodes: Descendant[]): Scripture {
    const input: Descendant[] = Array.from(nodes);
    const output: Scripture = [];

    let inlines: ScriptureDescendant[] = [];
    while (input.length > 0) {
        const node = input.shift()!;

        if (isScriptureElement(node)) {
            if (isScriptureBlock(node) && inlines.length > 0) {
                output.push(createParagraphElement(normalizeInlines(inlines, [])));
                inlines = [];
            }
            if (isScriptureSuperBlock(node)) {
                node.children = normalizeBlocks(node.children);
                if (node.children.length === 0) {
                    node.children = [createParagraphElement([createScriptureText("")])];
                }
            } else if (isScriptureSimpleBlock(node)) {
                const children = node.children;
                const last = children.findIndex(d => isScriptureElement(d) && isScriptureBlock(d));
                node.children = normalizeInlines(last < 0 ? children : children.slice(0, last), []);
                if (node.children.length === 0) {
                    node.children = [createScriptureText("")];
                }
                if (last >= 0) {
                    input.unshift({...node, children: children.slice(last + 1)});
                    input.unshift(children[last]);
                }
            } else if (isScriptureVoidBlock(node)) {
                node.children = [createScriptureText("")];
            } else if (isScriptureInline(node)) {
                inlines.push(node);
                continue;
            } else {
                continue;
            }
        } else if (isScriptureText(node)) {
            inlines.push(node);
            continue;
        } else {
            continue;
        }

        output.push(node);
    }

    if (inlines.length > 0) {
        output.push(createParagraphElement(normalizeInlines(inlines, [])));
    }

    return output;
}

function normalizeInlines(nodes: Descendant[], prohibited: ScriptureElementType[]): Scripture {
    const input: Descendant[] = Array.from(nodes);
    const output: Scripture = [];

    let prevInline = true;
    while (input.length > 0) {
        const node = input.shift()!;

        if (isScriptureText(node)) {
            if (output.length > 0) {
                const prevNode = output[output.length - 1];
                if (isScriptureText(prevNode) && equalScriptureMarks(prevNode, node)) {
                    prevNode.text += node.text;
                    continue;
                }
            }
            prevInline = false;
        } else if (isScriptureElement(node)) {
            if (!isScriptureInline(node) || prohibited.includes(node.type)) {
                input.unshift(...node.children);
                continue;
            }

            if (prevInline) {
                output.push(createScriptureText(""));
            }
            prevInline = true;

            if (isScriptureRegularInline(node)) {
                node.children = normalizeInlines(
                    node.children,
                    !isLinkElement(node) ? prohibited : [...prohibited, "link"]
                );
                if (node.children.length === 0) {
                    node.children = [createScriptureText("")];
                }
            } else {
                node.children = [createScriptureText("")];
            }
        } else {
            continue;
        }

        output.push(node);
    }
    if (prevInline) {
        output.push(createScriptureText(""));
    }

    return output;
}

export const isSignificant = (nodes: Descendant[]): boolean =>
    nodes.some(d => isScriptureElement(d) || (isScriptureText(d) && d.text.trim().length > 0));


function scriptureCleanup(scripture: Scripture): Scripture {
    const output: Scripture = [];
    for (const node of scripture) {
        if (isScriptureText(node)) {
            let textNode: ScriptureText = node;
            let skip = false;
            if (output.length > 0) {
                const prevNode = output[output.length - 1];
                if (isScriptureText(prevNode) && equalScriptureMarks(prevNode, node)) {
                    prevNode.text += node.text;
                    textNode = prevNode;
                    skip = true;
                }
            }
            textNode.text = textNode.text.replace(/ +/g, " ").replace(/\s*\n\s*/g, "\n");
            if (skip) {
                continue;
            }
        }
        if (isScriptureElement(node)) {
            if (isScriptureVoid(node)) {
                node.children = [createScriptureText("")];
                output.push(node);
                continue;
            }
            node.children = scriptureCleanup(node.children as Scripture);
            if (!isSignificant(node.children)) {
                continue;
            }
            if (isScriptureRegularInline(node)) {
                let child = node.children[0];
                if (isScriptureText(child)) {
                    child.text = child.text.trimStart();
                }
                child = node.children[node.children.length - 1];
                if (isScriptureText(child)) {
                    child.text = child.text.trimEnd();
                }
            }
        }
        output.push(node);
    }
    return output;
}
