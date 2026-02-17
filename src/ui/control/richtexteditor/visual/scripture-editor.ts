import { MutableRefObject } from 'react';
import {
    BaseEditor,
    BaseElement,
    BaseOperation,
    BasePoint,
    Descendant,
    Element as SlateElement,
    Node,
    Node as SlateNode,
    NodeEntry,
    Operation,
    Path,
    Range,
    Text as SlateText,
    TextUnit,
    Transforms
} from 'slate';
import { TextInsertTextOptions } from "slate/dist/interfaces/transforms/text";
import { DOMEditor } from 'slate-dom';
import cloneDeep from 'lodash.clonedeep';

import { SMILEY_LIKE } from "smileys";
import { uiEventOpenMention } from "ui/ui-events";
import {
    createLinkElement,
    createListItemElement,
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
    ListItemElement,
    Scripture,
    SCRIPTURE_REGULAR_INLINE_TYPES,
    ScriptureElement,
    ScriptureElementType
} from "ui/control/richtexteditor/visual/scripture";
import { safeImportScripture } from "ui/control/richtexteditor/visual/scripture-html";
import { smileyReplacer, TextReplacementFunction } from "util/text";
import { URL_PATTERN } from "util/url";
import { containsTags, plainTextToHtml } from "util/html";
import { importQuirks } from "util/import-quirks";
import noTracking from "util/no-tracking";

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

export interface ScriptureEditorOptions {
    removeTracking: boolean;
}

export type EditorChangeListener = (operation: BaseOperation) => void;

interface ScriptureEditorInsertTextOptions extends TextInsertTextOptions {
    noHotKeys?: boolean;
}

export type ScriptureEditor<T extends DOMEditor> = T & {
    options: ScriptureEditorOptions;

    insertText(text: string, options?: ScriptureEditorInsertTextOptions): void;

    changeListeners: EditorChangeListener[];

    addChangeListener(listener: EditorChangeListener): void;
    removeChangeListener(listener: EditorChangeListener): void;
}

export function withScripture<T extends DOMEditor>(
    editor: T,
    pasteImageRef: MutableRefObject<(data: DataTransfer) => boolean>,
    options: ScriptureEditorOptions
): ScriptureEditor<T> {
    const {
        isInline, isVoid, insertData, insertFragmentData, insertText, deleteBackward, deleteForward, deleteFragment,
        normalizeNode, apply
    } = editor;

    const scriptureEditor = editor as ScriptureEditor<T>;

    scriptureEditor.options = options;

    scriptureEditor.isInline = (element: BaseElement): boolean =>
        (isScriptureElement(element) && isScriptureInline(element)) || isInline(element);

    scriptureEditor.isVoid = (element: BaseElement): boolean =>
        (isScriptureElement(element) && isScriptureVoid(element)) || isVoid(element);

    scriptureEditor.insertData = (data: DataTransfer): void => {
        if (pasteImageRef.current != null && !pasteImageRef.current(data)) {
            insertData(data);
        }
    };

    scriptureEditor.insertFragmentData = (data: DataTransfer): boolean => {
        if (insertFragmentData(data)) {
            return true;
        }

        const html = data.getData("text/html");
        if (html && containsTags(html, "none")) {
            editor.insertFragment(importReplaceUrls(safeImportScripture(importQuirks(html)), scriptureEditor.options));
            return true;
        }

        return false;
    };

    scriptureEditor.insertTextData = (data: DataTransfer): boolean => {
        const text = data.getData("text/plain");
        editor.insertFragment(safeImportScripture(plainTextToHtml(text)));

        return true;
    };

    scriptureEditor.insertText = (text: string, options?: ScriptureEditorInsertTextOptions): void => {
        insertText(text, options);
        if (!options?.noHotKeys && editor.selection != null && Range.isCollapsed(editor.selection)) {
            if (text.endsWith(" ")) {
                const point = editor.selection.anchor;
                scriptureReplaceUrl(editor, point);
            } else if (text.length >= 10 && text.match(URL_AT_END) != null) {
                insertText(" ", options);
                const point = editor.selection.anchor;
                scriptureReplaceUrl(editor, point);
            }
            if (text.endsWith("@")) {
                const node = Node.get(editor, editor.selection.anchor.path);
                if (isScriptureText(node)) {
                    const offset = editor.selection.anchor.offset;
                    if (offset <= 1 || /[\s(]/.test(node.text.charAt(offset - 2))) {
                        editor.deleteBackward("character");
                        document.dispatchEvent(uiEventOpenMention());
                    }
                }
            }
        }
    }

    const unwrapEmptyInlines = (): void => {
        if (editor.selection != null) {
            const [leaf, leafPath] = editor.leaf(editor.selection);
            if (leaf.text === "") {
                const [inline, inlinePath] = findWrappingElement(
                    editor, SCRIPTURE_REGULAR_INLINE_TYPES, {at: leafPath}
                ) ?? [null, null];
                if (inline != null) {
                    Transforms.unwrapNodes(editor, {at: inlinePath});
                }
            }
        }
    }

    scriptureEditor.deleteBackward = (unit: TextUnit): void => {
        if (unit === "character" && editor.selection != null && Range.isCollapsed(editor.selection)) {
            const [, blockPath] = findWrappingElement(editor, [
                "blockquote", "spoiler-block", "details"
            ]) ?? [null, null];
            if (blockPath != null) {
                const [, path] = findWrappingElement(editor, ["paragraph", "heading"]) ?? [null, null];
                if (path != null && path.length > blockPath.length && editor.isStart(editor.selection.anchor, path)) {
                    editor.liftNodes();
                    return;
                }
            }

            const [listItem, listItemPath] = findWrappingElement<ListItemElement>(editor, "list-item") ?? [null, null];
            if (listItemPath != null && editor.isStart(editor.selection.anchor, listItemPath)) {
                if (listItem.level > 1) {
                    editor.setNodes(createListItemElement(listItem.ordered, listItem.level - 1, []));
                } else {
                    editor.setNodes(createParagraphElement([]));
                }
                return;
            }

            const [, codeBlockPath] = findWrappingElement(editor, "code-block") ?? [null, null];
            if (codeBlockPath != null && editor.isStart(editor.selection.anchor, codeBlockPath)) {
                editor.setNodes(createParagraphElement([]));
                return;
            }
        }

        deleteBackward(unit);
        unwrapEmptyInlines();
    }

    scriptureEditor.deleteForward = (...args: Parameters<typeof deleteForward>): void => {
        deleteForward(...args);
        unwrapEmptyInlines();
    }

    scriptureEditor.deleteFragment = (...args: Parameters<typeof deleteFragment>): void => {
        deleteFragment(...args);
        unwrapEmptyInlines();
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

function importReplaceUrls(scripture: Scripture, options: ScriptureEditorOptions): Scripture {
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
            return subs.map(([isUrl, text]) => {
                if (isUrl) {
                    const url = options.removeTracking ? noTracking(text) : text;
                    return createLinkElement(url, [createScriptureText(url)]);
                } else {
                    return createScriptureText(text);
                }
            });
        } else if (isLinkElement(node)) {
            const linkNode = cloneDeep(node);
            if (options.removeTracking) {
                const href = noTracking(linkNode.href);
                if (
                    linkNode.children.length === 1
                    && isScriptureText(linkNode.children[0])
                    && linkNode.href === linkNode.children[0].text
                ) {
                    linkNode.children[0].text = href;
                }
                linkNode.href = href;
            }
            return linkNode;
        } else if (
            isScriptureElement(node) && isScriptureBlock(node) && !isScriptureVoidBlock(node)
        ) {
            return {
                ...node,
                children: importReplaceUrls(node.children as Scripture, options)
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
        pattern.lastIndex = 0;
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

export function scriptureReplaceUrl(editor: ScriptureEditor<any>, beforePoint: BasePoint): void {
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
        const href = editor.options.removeTracking ? noTracking(m[1]) : m[1];
        editor.insertFragment([
            createScriptureText(""),
            createLinkElement(href, [createScriptureText(href)]),
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
