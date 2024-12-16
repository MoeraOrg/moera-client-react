import {
    BaseEditor,
    BaseElement,
    BasePoint,
    Element as SlateElement,
    Node as SlateNode,
    NodeEntry,
    Operation,
    Path,
    Text as SlateText,
    Transforms
} from 'slate';
import { DOMEditor } from 'slate-dom';

import { SMILEY_LIKE } from "smileys";
import {
    createLinkElement,
    createParagraphElement,
    createScriptureText,
    isLinkElement,
    isScriptureElement,
    isScriptureInline,
    isScriptureKnown,
    isScriptureSimpleBlock,
    isScriptureSuperBlock,
    isScriptureText,
    isScriptureVoid,
    Scripture,
    ScriptureElement,
    ScriptureElementType
} from "ui/control/richtexteditor/visual/scripture";
import { htmlToScripture } from "ui/control/richtexteditor/visual/scripture-html";
import { smileyReplacer, TextReplacementFunction } from "util/text";
import { URL_PATTERN } from "util/url";

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

export function withScripture<T extends DOMEditor>(editor: T): T {
    const {isInline, isVoid, insertFragmentData, insertTextData, normalizeNode} = editor;

    editor.isInline = (element: BaseElement): boolean =>
        (isScriptureElement(element) && isScriptureInline(element)) || isInline(element);

    editor.isVoid = (element: BaseElement): boolean =>
        (isScriptureElement(element) && isScriptureVoid(element)) || isVoid(element);

    editor.insertFragmentData = (data: DataTransfer): boolean => {
        if (insertFragmentData(data)) {
            return true;
        }

        const html = data.getData("text/html");
        if (html) {
            editor.insertFragment(htmlToScripture(html));
            return true;
        }

        return false;
    }

    editor.insertTextData = (data: DataTransfer): boolean => {
        const text = data.getData("text/plain");

        const m = text.match(new RegExp("^(\\s*)(" + URL_PATTERN + ")(\\s*)$"));
        if (!m) {
            return insertTextData(data);
        }

        editor.insertFragment([
            createScriptureText(m[1]),
            createLinkElement(m[2], [createScriptureText(m[2])]),
            createScriptureText(m[3] || " ")
        ]);

        return true;
    }

    editor.normalizeNode = (entry: NodeEntry, options?: {operation?: Operation}) => {
        const [node, path] = entry;

        if (SlateElement.isElement(node) && !isScriptureElement(node)) {
            Transforms.unwrapNodes(editor, {at: path});
            return;
        }
        if (isScriptureElement(node)) {
            if (!isScriptureKnown(node)) {
                Transforms.unwrapNodes(editor, {at: path});
                return;
            }
            if (isLinkElement(node)) {
                for (const [child, childPath] of SlateNode.children(editor, path)) {
                    if (isLinkElement(child)) {
                        Transforms.unwrapNodes(editor, {at: childPath});
                        return;
                    }
                }
            }
            if (isScriptureSimpleBlock(node)) {
                let empty = true;
                for (const [child, childPath] of SlateNode.children(editor, path)) {
                    empty = false;
                    if (isScriptureElement(child) && !isScriptureInline(child)) {
                        Transforms.unwrapNodes(editor, {at: childPath});
                        return;
                    }
                }
                if (empty) {
                    Transforms.insertNodes(editor, createScriptureText(""), {at: [...path, 0]});
                    return;
                }
            }
            if (isScriptureSuperBlock(node)) {
                let empty = true;
                let inlineStart: Path | null = null;
                for (const [child, childPath] of SlateNode.children(editor, path)) {
                    empty = false;
                    if (
                        (SlateText.isText(child) || (isScriptureElement(child) && isScriptureInline(child)))
                        && inlineStart == null
                    ) {
                        inlineStart = childPath;
                    }
                    if (isScriptureElement(child) && !isScriptureInline(child) && inlineStart != null) {
                        Transforms.wrapNodes(
                            editor,
                            createParagraphElement([]),
                            {at: {anchor: editor.start(inlineStart), focus: editor.end(childPath)}}
                        );
                        return;
                    }
                }
                if (empty) {
                    Transforms.insertNodes(
                        editor, createParagraphElement([createScriptureText("")]), {at: [...path, 0]}
                    );
                    return;
                }
            }
        }

        normalizeNode(entry, options);
    }

    return editor;
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

const URL_AT_END = new RegExp("(" + URL_PATTERN + ")\\s*$", "i");

export function scriptureReplaceUrl(editor: BaseEditor, beforePoint: BasePoint): void {
    let textNode;
    try {
        textNode = SlateNode.leaf(editor, beforePoint.path);
        if (!isScriptureText(textNode)) {
            return;
        }
    } catch (e) {
        return;
    }

    const {text} = textNode;
    const m = text.substring(0, beforePoint.offset).match(URL_AT_END);
    if (m == null || m.index == null) {
        return;
    }
    const at = {path: beforePoint.path, offset: m.index};
    Transforms.delete(editor, {at, distance: m[1].length, unit: "character"});
    editor.insertNode(createLinkElement(m[1], [createScriptureText(m[1])]), {at});
}
