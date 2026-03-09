import { ChildNode, Element, hasChildren, isTag, isText, Node, Text } from 'domhandler';

import { hasClass } from "util/domhandler";

const HASHTAG = /(?:^|[\s([{>])(#[\p{L}\p{Nd}_]*[\p{L}_][\p{L}\p{Nd}_]*)/gu;

const SKIPPED_TAGS = new Set(["a", "code", "pre", "video", "audio", "object", "iframe"]);

export function wrapHashtags(root: Node | Node[]): Node[] {
    const roots = Array.isArray(root) ? root : [root];
    const textNodes: Text[] = [];

    for (const node of roots) {
        collectTextNodes(node, textNodes);
    }

    for (const textNode of textNodes) {
        wrapTextNodeHashtags(textNode);
    }

    return roots;
}

function collectTextNodes(node: Node, textNodes: Text[]): void {
    if (isTag(node) && shouldSkipElement(node)) {
        return;
    }

    if (isText(node)) {
        HASHTAG.lastIndex = 0;
        if (HASHTAG.test(node.data)) {
            textNodes.push(node);
        }
        return;
    }

    if (!hasChildren(node)) {
        return;
    }

    for (const child of node.children) {
        collectTextNodes(child, textNodes);
    }
}

function shouldSkipElement(element: Element): boolean {
    if (SKIPPED_TAGS.has(element.name)) {
        return true;
    }

    return hasClass(element, "katex");
}

function wrapTextNodeHashtags(textNode: Text): void {
    const text = textNode.data;

    HASHTAG.lastIndex = 0;
    let match: RegExpExecArray | null;
    let lastIndex = 0;
    const replacementNodes: ChildNode[] = [];

    while ((match = HASHTAG.exec(text)) != null) {
        const index = !match[0].startsWith("#") ? match.index + 1 : 0;

        if (index > lastIndex) {
            replacementNodes.push(new Text(text.slice(lastIndex, index)));
        }

        const hashtag = match[1];
        replacementNodes.push(createHashtagElement(hashtag));

        lastIndex = index + hashtag.length;
    }

    if (lastIndex < text.length) {
        replacementNodes.push(new Text(text.slice(lastIndex)));
    }

    if (replacementNodes.length > 0) {
        replaceNodeWithNodes(textNode, replacementNodes);
    }
}

function createHashtagElement(hashtag: string): Element {
    const textNode = new Text(hashtag);
    const element = new Element("span", {"data-hashtag": hashtag}, [textNode]);

    textNode.parent = element;
    textNode.prev = null;
    textNode.next = null;

    return element;
}

function replaceNodeWithNodes(node: ChildNode, replacements: ChildNode[]): void {
    const parent = node.parent;
    if (parent == null) {
        return;
    }

    const index = parent.children.indexOf(node);
    if (index < 0) {
        return;
    }

    const prev = node.prev;
    const next = node.next;

    parent.children.splice(index, 1, ...replacements);

    if (replacements.length === 0) {
        if (prev != null) {
            prev.next = next;
        }
        if (next != null) {
            next.prev = prev;
        }
        return;
    }

    for (let i = 0; i < replacements.length; i++) {
        const current = replacements[i];
        const previous = i === 0 ? prev : replacements[i - 1];
        const following = i === replacements.length - 1 ? next : replacements[i + 1];

        current.parent = parent;
        current.prev = previous;
        current.next = following;
    }

    if (prev != null) {
        prev.next = replacements[0];
    }
    if (next != null) {
        next.prev = replacements[replacements.length - 1];
    }

    node.parent = null;
    node.prev = null;
    node.next = null;
}
