import React, { ReactNode } from 'react';
import { Editor, Element, Node, Path, PathRef, Range, Transforms } from 'slate';
import { ReactEditor, useSlateSelector, useSlateStatic } from 'slate-react';
import { HistoryEditor } from 'slate-history';

import { NodeName, VerifiedMediaFile } from "api";
import {
    createBlockquoteElement,
    createCodeBlockElement,
    createDetailsElement,
    createFigureImageElement,
    createFormulaBlockElement,
    createFormulaElement,
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
    DetailsElement,
    equalScriptureMarks,
    FigureImageElement,
    FormulaBlockElement,
    FormulaElement,
    HeadingElement,
    ImageElement,
    isDetailsElement,
    isFigureImageElement,
    isFormulaBlockElement,
    isFormulaElement,
    isHeadingElement,
    isImageElement,
    isLinkElement,
    isListItemElement,
    isParagraphElement,
    isScriptureElement,
    isScriptureRegularInline,
    isScriptureSimpleBlock,
    isScriptureSuperBlock,
    isSpoilerBlockElement,
    isSpoilerElement,
    LinkElement,
    ListItemElement,
    ParagraphElement,
    SCRIPTURE_MARKS,
    SCRIPTURE_VOID_TYPES,
    ScriptureElement,
    ScriptureMarks,
    SpoilerBlockElement,
    SpoilerElement
} from "ui/control/richtexteditor/visual/scripture";
import { RichTextEditorCommandsContext } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { useRichTextEditorDialogs } from "ui/control/richtexteditor/dialog/rich-text-editor-dialogs-context";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { findWrappingElement, isSelectionInElement } from "ui/control/richtexteditor/visual/scripture-editor";
import { RichTextLinkValues } from "ui/control/richtexteditor/dialog/RichTextLinkDialog";
import { RichTextSpoilerValues } from "ui/control/richtexteditor/dialog/RichTextSpoilerDialog";
import { RichTextVideoValues } from "ui/control/richtexteditor/dialog/RichTextVideoDialog";
import { RichTextFoldValues } from "ui/control/richtexteditor/dialog/RichTextFoldDialog";
import { RichTextFormulaValues } from "ui/control/richtexteditor/dialog/RichTextFormulaDialog";
import { RichTextImageValues } from "ui/control/richtexteditor/media/RichTextImageDialog";
import { NameListItem } from "util/names-list";
import { mentionName } from "util/names";

interface Props {
    noComplexBlocks?: boolean | null;
    noEmbeddedMedia?: boolean | null;
    noMedia?: boolean | null;
    noVideo?: boolean | null;
    children: ReactNode;
}

export default function VisualEditorCommands({noComplexBlocks, noEmbeddedMedia, noMedia, noVideo, children}: Props) {
    const editor = useSlateStatic() as ReactEditor & HistoryEditor;
    const {
        bold: inBold = false, italic: inItalic = false, strikeout: inStrikeout = false, code: inCode = false,
        supsub = 0, mark: inMark = false,
    } = useSlateSelector(
        editor => Editor.marks(editor) as ScriptureMarks ?? {},
        equalScriptureMarks
    );
    const inLink = useSlateSelector(editor => isSelectionInElement(editor, "link"));
    const inSpoilerInline = useSlateSelector(editor => isSelectionInElement(editor, "spoiler"));
    const inSpoilerBlock = useSlateSelector(editor => isSelectionInElement(editor, "spoiler-block"));
    const inSpoiler = inSpoilerInline || inSpoilerBlock;
    const inMention = useSlateSelector(editor => isSelectionInElement(editor, "mention"));
    const inBlockquote = useSlateSelector(editor => isSelectionInElement(editor, "blockquote"));
    const listItem = useSlateSelector(editor => findWrappingElement<ListItemElement>(editor, "list-item"));
    const inList = listItem != null;
    const inUnorderedList = inList && !listItem[0].ordered;
    const inOrderedList = inList && listItem[0].ordered;
    const heading = useSlateSelector(editor => findWrappingElement<HeadingElement>(editor, "heading"));
    const headingLevel = heading != null ? heading[0].level : 0;
    const inVoid = useSlateSelector(editor => isSelectionInElement(editor, SCRIPTURE_VOID_TYPES));
    const enableHeading = !inList && !inVoid;
    const inFold = useSlateSelector(editor => isSelectionInElement(editor, "details"));
    const inSubscript = supsub < 0;
    const inSuperscript = supsub > 0;
    const inCodeBlock = useSlateSelector(editor => isSelectionInElement(editor, "code-block"));
    const inFormula = useSlateSelector(editor => isSelectionInElement(editor, ["formula", "formula-block"]));
    const [image] = useSlateSelector(editor =>
        findWrappingElement<ImageElement | FigureImageElement>(editor, ["image", "figure-image"]) ?? [null]
    );
    const inImageEmbedded = image != null && image.href != null;
    const inImageAttached = image != null && image.mediaFile != null;
    const enableUndo = editor.history.undos.length > 0;
    const enableRedo = editor.history.redos.length > 0;

    const {
        showLinkDialog, showSpoilerDialog, showMentionDialog, showVideoDialog, showFoldDialog, showFormulaDialog
    } = useRichTextEditorDialogs();

    const focus = () =>
        ReactEditor.focus(editor);

    const resetSelection = () => {
        if (editor.selection == null || Range.isCollapsed(editor.selection)) {
            return;
        }
        const selection = editor.selection;
        Transforms.collapse(editor);
        Transforms.select(editor, selection);
    }

    const formatBold = () =>
        editor.addMark("bold", !inBold);

    const formatItalic = () =>
        editor.addMark("italic", !inItalic);

    const formatStrikeout = () =>
        editor.addMark("strikeout", !inStrikeout);

    const formatLink = () => {
        const [element, path] = findWrappingElement(editor, "link") ?? [null, null];
        const noSelection = editor.selection == null || Range.isCollapsed(editor.selection);
        const prevValues = element != null && isLinkElement(element) ? {href: element.href} : null;

        showLinkDialog(
            true, !noSelection, prevValues, (ok: boolean | null, {href = "", text = ""}: Partial<RichTextLinkValues>
        ) => {
            showLinkDialog(false);
            if (path != null) {
                if (ok) {
                    editor.setNodes<LinkElement>({href}, {at: path});
                } else if (ok == null) {
                    editor.unwrapNodes({at: path});
                }
            } else {
                if (ok) {
                    if (noSelection) {
                        editor.insertFragment([
                            createScriptureText(""),
                            createLinkElement(href, [createScriptureText(text || href)]),
                            createScriptureText("")
                        ]);
                    } else {
                        const at = editor.unhangRange(editor.selection!);
                        editor.wrapNodes(createLinkElement(href, []), {at, split: true});
                    }
                }
            }
            focus();
        });
    }

    const formatSpoiler = () => {
        const [element, path] = findWrappingElement(editor, ["spoiler", "spoiler-block"]) ?? [null, null];
        const prevValues = element != null && (isSpoilerElement(element) || isSpoilerBlockElement(element))
            ? {title: element.title}
            : null;

        showSpoilerDialog(true, prevValues, (ok: boolean | null, {title = ""}: Partial<RichTextSpoilerValues>) => {
            showSpoilerDialog(false);
            if (path != null) {
                if (ok) {
                    editor.setNodes<SpoilerElement | SpoilerBlockElement>({title}, {at: path});
                } else if (ok == null) {
                    editor.unwrapNodes({at: path});
                }
            } else {
                if (ok) {
                    if (editor.selection == null || Range.isCollapsed(editor.selection)) {
                        editor.insertNode(createSpoilerElement(title, [createScriptureText("")]));
                    } else {
                        const [parent] = Node.common(editor, editor.selection.anchor.path, editor.selection.focus.path);
                        if (
                            Editor.isEditor(parent)
                            || (Element.isElement(parent) && editor.isBlock(parent) && editor.hasBlocks(parent))
                        ) {
                            editor.wrapNodes(createSpoilerBlockElement(title, []), {split: true});
                        } else {
                            editor.wrapNodes(createSpoilerElement(title, []), {split: true});
                        }
                    }
                }
            }
            focus();
        });
    }

    const formatMention = (typeOnCancel: boolean) => {
        const [, path] = findWrappingElement(editor, "mention") ?? [null, null];
        if (path != null) {
            editor.unwrapNodes({at: path});
            return;
        }

        showMentionDialog(true, (ok: boolean | null, {nodeName, fullName}: Partial<NameListItem>) => {
            showMentionDialog(false);

            if (ok && nodeName != null) {
                const text = (fullName || NodeName.shorten(nodeName)) ?? nodeName ?? "";
                editor.insertNode(createMentionElement(nodeName, [createScriptureText(text)]));
                const selection = editor.selection?.anchor.path;
                if (selection != null) {
                    Transforms.select(editor, {path: Path.next(Path.parent(selection)), offset: 0});
                }
                editor.insertText(" ");
            } else if (typeOnCancel) {
                editor.insertText(nodeName ? mentionName(nodeName) : "@");
            }
            focus();
        });
    }

    const formatHorizontalRule = () =>
        editor.insertFragment([
            createHorizontalRuleElement(),
            createParagraphElement([createScriptureText("")])
        ]);

    const formatEmoji = (emoji: string) => {
        editor.insertText(emoji);
        focus();
    }

    const formatBlockquote = () => {
        if (editor.selection == null || Range.isCollapsed(editor.selection)) {
            editor.wrapNodes(createBlockquoteElement([]));
        } else {
            editor.wrapNodes(createBlockquoteElement([]), {split: true});
        }
    }

    const formatBlockunquote = () => {
        const [, path] = findWrappingElement(editor, "blockquote") ?? [null, null];
        if (path != null) {
            editor.unwrapNodes({at: path});
        }
    }

    const formatList = (ordered: boolean) => {
        if (editor.selection == null) {
            return;
        }

        const nodes = editor.nodes({
            at: editor.selection,
            match: node => isParagraphElement(node) || isListItemElement(node),
            mode: "all"
        });

        let minLevel = 100;
        let listOrdered: boolean | null | undefined = undefined;
        for (const [node] of nodes) {
            if (isListItemElement(node)) {
                minLevel = Math.min(minLevel, node.level);
                if (listOrdered !== null) {
                    listOrdered = listOrdered === undefined || listOrdered === node.ordered ? node.ordered : null;
                }
            } else {
                minLevel = 1;
                listOrdered = null;
            }
        }

        if (listOrdered === ordered) {
            editor.setNodes<ScriptureElement>(createParagraphElement([]), {
                at: editor.selection,
                match: isListItemElement
            });
        } else {
            editor.setNodes<ScriptureElement>(createListItemElement(ordered, minLevel, []), {
                at: editor.selection,
                match: node => (isListItemElement(node) && node.level === minLevel) || isParagraphElement(node)
            });
        }
    }

    const formatIndent = (delta: number) => {
        if (editor.selection == null) {
            return;
        }

        const nodes = editor.nodes<ListItemElement>({
            at: editor.selection,
            match: node => isListItemElement(node),
            mode: "all"
        });

        for (const [node, path] of nodes) {
            let level = node.level + delta;
            if (level < 1) {
                level = 1;
            } else if (level > 5) {
                level = 5;
            }
            if (level !== node.level) {
                editor.setNodes<ListItemElement>({level}, {at: path, match: isListItemElement});
            }
        }
    }

    const formatHeading = (level: number) => {
        if (level <= 0) {
            editor.setNodes<ParagraphElement>(
                {type: "paragraph"},
                {match: node => isHeadingElement(node)}
            );
        } else {
            editor.setNodes<HeadingElement>(
                {type: "heading", level},
                {match: node => isHeadingElement(node) || isParagraphElement(node)}
            );
        }
    }

    const formatVideo = () => {
        showVideoDialog(true, (ok: boolean | null, {code}: Partial<RichTextVideoValues>) => {
            showVideoDialog(false);

            if (ok && code) {
                editor.insertNode(createIframeElement(code));
            }
            focus();
        });
    }

    const formatFold = () => {
        const [element, path] = findWrappingElement(editor, "details") ?? [null, null];
        const prevValues = element != null && isDetailsElement(element) ? {summary: element.summary} : null;

        showFoldDialog(true, prevValues, (ok: boolean | null, {summary = ""}: Partial<RichTextFoldValues>) => {
            showFoldDialog(false);
            if (path != null) {
                if (ok) {
                    editor.setNodes<DetailsElement>({summary}, {at: path});
                } else if (ok == null) {
                    editor.unwrapNodes({at: path});
                }
            } else {
                if (ok) {
                    if (editor.selection == null || Range.isCollapsed(editor.selection)) {
                        editor.insertNode(createDetailsElement(summary, [createScriptureText("")]));
                    } else {
                        editor.wrapNodes(createDetailsElement(summary, []), {split: true});
                    }
                }
            }
            focus();
        });
    }

    const formatCode = () =>
        editor.addMark("code", !inCode);

    const formatSubscript = () =>
        editor.addMark("supsub", !inSubscript ? -1 : 0);

    const formatSuperscript = () =>
        editor.addMark("supsub", !inSuperscript ? 1 : 0);

    const formatCodeBlock = () => {
        if (editor.selection == null || Range.isCollapsed(editor.selection)) {
            editor.insertNode(createCodeBlockElement([createScriptureText("")]));
        } else {
            editor.setNodes(createCodeBlockElement([]), {split: true});
        }
    }

    const formatFormula = () => {
        const [element, path] = findWrappingElement(editor, ["formula", "formula-block"]) ?? [null, null];
        const prevValues = element != null && (isFormulaElement(element) || isFormulaBlockElement(element))
            ? {math: element.content, block: isFormulaBlockElement(element)}
            : null;

        showFormulaDialog(true, prevValues, (ok: boolean | null, {math, block}: Partial<RichTextFormulaValues>) => {
            showFormulaDialog(false);

            if (ok && math) {
                const node = block ? createFormulaBlockElement(math) : createFormulaElement(math);
                if (path != null) {
                    editor.setNodes<FormulaElement | FormulaBlockElement>(node, {at: path});
                } else {
                    editor.insertNode(node);
                }
            } else if (ok == null && path != null) {
                editor.removeNodes({at: path});
            }
            focus();
        });
    }

    const formatMark = () =>
        editor.addMark("mark", !inMark);

    interface ClearItem {
        type: "unwrap" | "set";
        pathRef: PathRef;
    }

    const findClearItems = (): ClearItem[] => {
        if (editor.selection == null) {
            return [];
        }

        const clearItems: ClearItem[] = [];

        if (Range.isCollapsed(editor.selection)) {
            for (const [node, path] of Node.ancestors(editor, editor.selection.anchor.path, {reverse: true})) {
                if (!isScriptureElement(node) || isParagraphElement(node)) {
                    continue;
                }
                if (isScriptureRegularInline(node) || isScriptureSuperBlock(node)) {
                    clearItems.push({type: "unwrap", pathRef: editor.pathRef(path)});
                    break;
                }
                if (isScriptureSimpleBlock(node)) {
                    clearItems.push({type: "set", pathRef: editor.pathRef(path)});
                    break;
                }
            }
        } else {
            const [start, end] = Range.edges(editor.selection);
            for (const [node, path] of Node.elements(editor, {from: start.path, to: end.path})) {
                if (!isScriptureElement(node) || isParagraphElement(node)) {
                    continue;
                }
                const nodeRange = {anchor: editor.start(path), focus: editor.end(path)};
                if (!Range.surrounds(editor.selection, nodeRange)) {
                    continue;
                }
                if (isScriptureRegularInline(node) || isScriptureSuperBlock(node)) {
                    clearItems.push({type: "unwrap", pathRef: editor.pathRef(path)});
                }
                if (isScriptureSimpleBlock(node)) {
                    clearItems.push({type: "set", pathRef: editor.pathRef(path)});
                }
            }
        }

        return clearItems;
    }

    const clearBlocks = () => {
        const clearItems = findClearItems();

        if (clearItems.length === 0) {
            return;
        }

        setTimeout(() => {
            clearItems.forEach(item => {
                const path = item.pathRef.current;
                if (path != null) {
                    if (item.type === "unwrap") {
                        editor.unwrapNodes({at: path});
                    } else {
                        editor.setNodes(createParagraphElement([]), {at: path});
                    }
                }
                item.pathRef.unref();
            });
            clearBlocks();
        });
    }

    const formatClear = () => {
        SCRIPTURE_MARKS.forEach(mark => editor.removeMark(mark));

        clearBlocks();
    }

    const {openLocalFiles, showImageDialog} = useRichTextEditorMedia();

    const formatImage = (embedded?: boolean) => {
        const [element, path] = findWrappingElement(editor, ["image", "figure-image"]) ?? [null, null];
        const prevType = element?.type;
        let prevValues: RichTextImageValues | null = null;
        if (isImageElement(element) || isFigureImageElement(element)) {
            prevValues = {
                href: element.href,
                mediaFiles: element.mediaFile != null ? [element.mediaFile] : null,
                standardSize: element.standardSize,
                customWidth: element.customWidth,
                customHeight: element.customHeight,
                caption: "caption" in element ? element.caption : undefined,
            }
        } else if (!embedded) {
            openLocalFiles((images, standardSize, customWidth, customHeight, caption) => {
                for (const image of images) {
                    const node = caption
                        ? createFigureImageElement(image, caption, standardSize, customWidth, customHeight)
                        : createImageElement(image, standardSize, customWidth, customHeight);
                    editor.insertNode(node);
                }
                focus();
            });
            return;
        }

        showImageDialog(
            true,
            null,
            prevValues?.mediaFiles,
            prevValues?.href,
            true,
            prevValues,
            (
                ok: boolean | null,
                {mediaFiles, href, standardSize, customWidth, customHeight, caption}: Partial<RichTextImageValues>
            ) => {
                showImageDialog(false);

                const src = href ?? mediaFiles?.[0];

                if (ok && src) {
                    const node = caption
                        ? createFigureImageElement(src, caption, standardSize, customWidth, customHeight)
                        : createImageElement(src, standardSize, customWidth, customHeight);
                    if (path != null) {
                        Editor.withoutNormalizing(editor, () => {
                            editor.setNodes<ImageElement | FigureImageElement>(node, {at: path});
                            if (prevType != null && prevType !== node.type) {
                                if (prevType === "image") {
                                    editor.liftNodes({at: path});
                                } else {
                                    editor.wrapNodes(createParagraphElement([]), {at: path});
                                }
                            }
                        });
                    } else {
                        editor.insertNode(node);
                    }
                } else if (ok == null && path != null) {
                    editor.removeNodes({at: path});
                }
                focus();
            }
        );
    }

    const embedImage = (mediaFile: VerifiedMediaFile) => {
        showImageDialog(
            true,
            null,
            [mediaFile],
            null,
            true,
            null,
            (
                ok: boolean | null,
                {mediaFiles, standardSize, customWidth, customHeight, caption}: Partial<RichTextImageValues>
            ) => {
                showImageDialog(false);

                if (ok && mediaFiles != null) {
                    for (const image of mediaFiles) {
                        const node = caption
                            ? createFigureImageElement(image, caption, standardSize, customWidth, customHeight)
                            : createImageElement(image, standardSize, customWidth, customHeight);
                        editor.insertNode(node);
                    }
                }
                focus();
            }
        );
    }

    const undo = () => editor.undo();

    const redo = () => editor.redo();

    return (
        <RichTextEditorCommandsContext.Provider value={{
            enableHeading, enableUndo, enableRedo,
            supportsComplexBlocks: !noComplexBlocks, supportsEmbeddedMedia: !noEmbeddedMedia, supportsMedia: !noMedia,
            supportsVideo: !noVideo, supportsClear: true, supportsUndoRedo: true,
            inBold, inItalic, inStrikeout, inLink, inSpoilerInline, inSpoilerBlock, inSpoiler, inMention, inBlockquote,
            inList, inUnorderedList, inOrderedList, headingLevel, inVoid, inFold, inCode, inSubscript, inSuperscript,
            inCodeBlock, inFormula, inMark, inImageEmbedded, inImageAttached,
            focus, resetSelection, formatBold, formatItalic, formatStrikeout, formatLink, formatSpoiler, formatMention,
            formatHorizontalRule, formatEmoji, formatBlockquote, formatBlockunquote, formatList, formatIndent,
            formatHeading, formatVideo, formatFold, formatCode, formatSubscript, formatSuperscript, formatCodeBlock,
            formatFormula, formatMark, formatClear, formatImage, embedImage, undo, redo
        }}>
            {children}
        </RichTextEditorCommandsContext.Provider>
    );
}
