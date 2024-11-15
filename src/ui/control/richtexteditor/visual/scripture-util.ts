import { Text as SlateText } from 'slate';

import {
    createLinkElement,
    createParagraphElement,
    createScriptureText,
    isLinkElement,
    isScriptureElement,
    Scripture,
    ScriptureDescendant
} from "ui/control/richtexteditor/visual/scripture";
import { htmlEntities } from "util/html";

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

function domToScripture(
    node: Node, attributes: Record<string, any> = {}
): Scripture | ScriptureDescendant | null {
    if (node.nodeType === Node.TEXT_NODE) {
        return createScriptureText(node.textContent ?? "", attributes);
    } else if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const element: Element = node as Element;
    const markAttributes: Record<string, any> = {...attributes};

    switch (element.nodeName) {
        case "B":
            markAttributes.bold = true;
    }

    const children: Scripture  = Array.from(element.childNodes)
        .map(node => domToScripture(node, markAttributes))
        .filter((node: Scripture | ScriptureDescendant | null): node is Scripture | ScriptureDescendant => node != null)
        .flat();

    if (children.length === 0) {
        children.push(createScriptureText(""));
    }

    switch (element.nodeName) {
        case "BODY":
            return children;
        case "P":
            return createParagraphElement(children);
        case "A":
            return createLinkElement(element.getAttribute("href") ?? "", children);
        case "BR":
            return createScriptureText("\n", attributes);
        default:
            return children;
    }
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
        return htmlEntities(descendant.text).replaceAll("\n", "<br>");
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
