import {
    BaseEditor,
    BaseElement,
    BaseOperation,
    BasePoint,
    Descendant,
    Element as SlateElement,
    Node as SlateNode,
    NodeEntry,
    Operation,
    Path,
    Range,
    Text as SlateText,
    Transforms
} from 'slate';
import { DOMEditor } from 'slate-dom';
import cloneDeep from 'lodash.clonedeep';

import { SMILEY_LIKE } from "smileys";
import {
    createLinkElement,
    createParagraphElement,
    createScriptureText,
    isLinkElement,
    isParagraphElement,
    isScriptureBlock,
    isScriptureElement,
    isScriptureInline,
    isScriptureKnown,
    isScriptureSimpleBlock,
    isScriptureSuperBlock,
    isScriptureText,
    isScriptureVoid,
    isScriptureVoidBlock,
    Scripture,
    ScriptureElement,
    ScriptureElementType
} from "ui/control/richtexteditor/visual/scripture";
import { safeImportScripture } from "ui/control/richtexteditor/visual/scripture-html";
import { smileyReplacer, TextReplacementFunction } from "util/text";
import { URL_PATTERN } from "util/url";
import { containsTags, plainTextToHtml } from "util/html";
import { importQuirks } from "util/import-quirks";

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

export type EditorChangeListener = (operation: BaseOperation) => void;

export type ScriptureEditor<T extends DOMEditor> = T & {
    changeListeners: EditorChangeListener[];

    addChangeListener(listener: EditorChangeListener): void;
    removeChangeListener(listener: EditorChangeListener): void;
}

export function withScripture<T extends DOMEditor>(
    editor: T, pasteImage: (data: DataTransfer) => boolean
): ScriptureEditor<T> {
    const {isInline, isVoid, insertData, insertFragmentData, insertText, normalizeNode, apply} = editor;

    const scriptureEditor = editor as ScriptureEditor<T>;

    scriptureEditor.isInline = (element: BaseElement): boolean =>
        (isScriptureElement(element) && isScriptureInline(element)) || isInline(element);

    scriptureEditor.isVoid = (element: BaseElement): boolean =>
        (isScriptureElement(element) && isScriptureVoid(element)) || isVoid(element);

    scriptureEditor.insertData = (data: DataTransfer): void => {
        if (!pasteImage(data)) {
            insertData(data);
        }
    };

    scriptureEditor.insertFragmentData = (data: DataTransfer): boolean => {
        if (insertFragmentData(data)) {
            return true;
        }

        const html = data.getData("text/html");
        if (html && containsTags(html, "none")) {
            editor.insertFragment(importReplaceUrls(safeImportScripture(importQuirks(html))));
            return true;
        }

        return false;
    };

    scriptureEditor.insertTextData = (data: DataTransfer): boolean => {
        const text = data.getData("text/plain");
        editor.insertFragment(safeImportScripture(plainTextToHtml(text)));

        return true;
    };

    scriptureEditor.insertText = (text: string): void => {
        insertText(text);
        if (text.endsWith(" ") && editor.selection != null && Range.isCollapsed(editor.selection)) {
            const point = editor.selection.anchor;
            scriptureReplaceUrl(editor, point);
        }
    }

    scriptureEditor.normalizeNode = (entry: NodeEntry, options?: { operation?: Operation }) => {
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
                let prevPath: Path | null = null;
                for (const [child, childPath] of SlateNode.children(editor, path)) {
                    empty = false;
                    if (
                        (SlateText.isText(child) || (isScriptureElement(child) && isScriptureInline(child)))
                        && inlineStart == null
                    ) {
                        inlineStart = childPath;
                    }
                    if (
                        isScriptureElement(child) && !isScriptureInline(child)
                        && inlineStart != null && prevPath != null
                    ) {
                        Transforms.wrapNodes(
                            editor,
                            createParagraphElement([]),
                            {at: {anchor: editor.start(inlineStart), focus: editor.end(prevPath)}}
                        );
                        return;
                    }
                    prevPath = childPath;
                }
                if (inlineStart != null) {
                    Transforms.wrapNodes(
                        editor,
                        createParagraphElement([]),
                        {at: {anchor: editor.start(inlineStart), focus: editor.end(path)}}
                    );
                    return;
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
    };

    scriptureEditor.changeListeners = [];

    scriptureEditor.addChangeListener = (listener: EditorChangeListener): void => {
        if (!scriptureEditor.changeListeners.includes(listener)) {
            scriptureEditor.changeListeners.push(listener);
        }
    };

    scriptureEditor.removeChangeListener = (listener: EditorChangeListener): void => {
        const index = scriptureEditor.changeListeners.indexOf(listener);
        if (index !== -1) {
            scriptureEditor.changeListeners.splice(index, 1);
        }
    };

    scriptureEditor.apply = (operation: BaseOperation) => {
        scriptureEditor.changeListeners.forEach(listener => listener(operation));
        apply(operation);
    };

    return scriptureEditor;
}

const URLS = new RegExp("(?<!\\S)" + URL_PATTERN, "g");

function importReplaceUrls(scripture: Scripture): Scripture {
    return ([] as Scripture).concat(...scripture.map(node => {
        if (isScriptureText(node)) {
            const subs: [boolean, string][] = [];
            let tail = 0;
            while (true) {
                const match = URLS.exec(node.text);
                if (match == null) {
                    break;
                }
                subs.push([false, node.text.substring(tail, match.index)]);
                subs.push([true, match[0]]);
                tail = match.index + match[0].length;
            }
            if (subs.length === 0) {
                return node;
            }
            subs.push([false, node.text.substring(tail)]);
            return subs.map(([isUrl, text]) =>
                isUrl ? createLinkElement(text, [createScriptureText(text)]) : createScriptureText(text)
            );
        } else if (
            isScriptureElement(node) && isScriptureBlock(node) && !isScriptureVoidBlock(node) && !isLinkElement(node)
        ) {
            return {
                ...node,
                children: importReplaceUrls(node.children as Scripture)
            };
        } else {
            return cloneDeep(node);
        }
    }));
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
        if (findWrappingElement(editor, "link", {at: beforePoint.path}) != null) {
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
    editor.withoutNormalizing(() => {
        Transforms.delete(editor, {at, distance: m[1].length, unit: "character"});
        editor.insertFragment([
            createScriptureText(""),
            createLinkElement(m[1], [createScriptureText(m[1])]),
            createScriptureText("")
        ], {at});
    });
}

export function isScriptureEmpty(scripture: Descendant[] | null | undefined): boolean {
    if (!scripture || scripture.length === 0) {
        return true;
    }

    if (scripture.length > 1) {
        return false;
    }

    const node = scripture[0];
    return isScriptureElement(node) && isParagraphElement(node)
        && (
            node.children.length === 0
            || (node.children.length === 1 && isScriptureText(node.children[0]) && node.children[0].text === "")
        );
}
