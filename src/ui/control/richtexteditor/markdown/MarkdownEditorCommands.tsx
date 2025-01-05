import React, { ReactNode } from 'react';

import { NodeName, PrivateMediaFileInfo, SourceFormat } from "api";
import * as Browser from "ui/browser";
import { RichTextEditorCommandsContext } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import {
    getTextSelection,
    insertText,
    insertTextOnNewLine,
    wrapBlock,
    wrapSelection,
    wrapSelectionLines,
    wrapSelectionLinesOnNewLine,
    wrapSelectionOnNewLine
} from "util/ui";
import { useRichTextEditorDialogs } from "ui/control/richtexteditor/dialog/rich-text-editor-dialogs-context";
import { RichTextLinkValues } from "ui/control/richtexteditor/dialog/RichTextLinkDialog";
import { RichTextSpoilerValues } from "ui/control/richtexteditor/dialog/RichTextSpoilerDialog";
import { RichTextFoldValues } from "ui/control/richtexteditor/dialog/RichTextFoldDialog";
import { RichTextFormulaValues } from "ui/control/richtexteditor/dialog/RichTextFormulaDialog";
import { RichTextImageValues } from "ui/control/richtexteditor/media/RichTextImageDialog";
import { getImageDimensions, RichTextImageStandardSize } from "ui/control/richtexteditor/media/rich-text-image";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { htmlEntities } from "util/html";
import { NameListItem } from "util/names-list";
import { mentionName } from "util/names";

interface Props {
    format: SourceFormat;
    textArea: React.RefObject<HTMLTextAreaElement>,
    noComplexBlocks?: boolean | null;
    noEmbeddedMedia?: boolean | null;
    noMedia?: boolean | null;
    children: ReactNode;
}

function insertImage(
    field: HTMLTextAreaElement, src: string | PrivateMediaFileInfo, standardSize: RichTextImageStandardSize = "large",
    customWidth?: number | null, customHeight?: number | null, caption?: string | null
) {
    const href = typeof src === "string" ? src : "hash:" + src.hash;
    const figureBegin = caption ? "<figure>" : "";
    const figureEnd = caption ? `<figcaption>${htmlEntities(caption)}</figcaption></figure>` : "";
    const {width, height} = getImageDimensions(standardSize, customWidth, customHeight);
    const widthAttr = width != null ? ` width="${width}"` : "";
    const heightAttr = height != null ? ` height="${height}"` : "";

    const tagBegin = `${figureBegin}<img${widthAttr}${heightAttr} src="`;
    const tagEnd = `">${figureEnd}`;
    if (href) {
        insertText(field, tagBegin + htmlEntities(href) + tagEnd);
    } else {
        wrapSelection(field, tagBegin, tagEnd);
    }
}

export default function MarkdownEditorCommands({
    format, textArea, noComplexBlocks, noEmbeddedMedia, noMedia, children
}: Props) {
    const {
        showLinkDialog, showSpoilerDialog, showMentionDialog, showFoldDialog, showFormulaDialog
    } = useRichTextEditorDialogs();

    const isMarkdown = () => format === "markdown";

    const focus = () =>
        textArea.current?.focus();

    const formatBold = () => {
        if (textArea.current == null) {
            return;
        }

        if (isMarkdown()) {
            wrapSelectionLines(textArea.current, "**");
        } else {
            wrapSelection(textArea.current, "<b>", "</b>");
        }
    }

    const formatItalic = () => {
        if (textArea.current == null) {
            return;
        }

        if (isMarkdown()) {
            wrapSelectionLines(textArea.current, "_");
        } else {
            wrapSelection(textArea.current, "<i>", "</i>");
        }
    }

    const formatStrikeout = () => {
        if (textArea.current == null) {
            return;
        }

        if (isMarkdown()) {
            wrapSelectionLines(textArea.current, "~~");
        } else {
            wrapSelection(textArea.current, "<s>", "</s>");
        }
    }

    const formatLink = () => {
        if (textArea.current == null) {
            return;
        }

        const noSelection = getTextSelection(textArea.current).length === 0;

        showLinkDialog(true, !noSelection, null, (ok: boolean | null, {href, text}: Partial<RichTextLinkValues>) => {
            showLinkDialog(false);

            if (textArea.current == null) {
                return;
            }

            if (ok) {
                if (isMarkdown()) {
                    if (text) {
                        insertText(textArea.current, `[${text}](${htmlEntities(href ?? "")})`);
                    } else {
                        wrapSelection(textArea.current, "[", `](${htmlEntities(href ?? "")})`);
                    }
                } else {
                    if (text) {
                        insertText(textArea.current, `<a href="${htmlEntities(href ?? "")}">${htmlEntities(text)}</a>`);
                    } else {
                        wrapSelection(textArea.current, `<a href="${htmlEntities(href ?? "")}">`, "</a>");
                    }
                }
            }
            focus();
        });
    }

    const formatSpoiler = () => {
        showSpoilerDialog(true, null, (ok: boolean | null, {title}: Partial<RichTextSpoilerValues>) => {
            showSpoilerDialog(false);

            if (textArea.current == null) {
                return;
            }

            if (ok) {
                const tag = getTextSelection(textArea.current).includes("\n") ? "mr-spoiler-block" : "mr-spoiler";
                if (title) {
                    wrapSelection(textArea.current, `<${tag} title="${htmlEntities(title)}">`, `</${tag}>`);
                } else {
                    if (isMarkdown() && tag === "mr-spoiler") {
                        wrapSelection(textArea.current, "||");
                    } else {
                        wrapSelection(textArea.current, `<${tag}>`, `</${tag}>`);
                    }
                }
            }
            focus();
        });
    }

    const formatMention = () => {
        showMentionDialog(true, (ok: boolean | null, {nodeName, fullName}: Partial<NameListItem>) => {
            showMentionDialog(false);

            if (textArea.current == null) {
                return;
            }

            const value = textArea.current.value;
            const start = textArea.current.selectionStart;
            if (value.length >= start && value[start - 1] === "@") {
                textArea.current.selectionStart = start - 1;
            }

            if (ok) {
                if (isMarkdown()) {
                    insertText(textArea.current, mentionName(nodeName, fullName))
                } else {
                    const text = (fullName || NodeName.shorten(nodeName)) ?? nodeName ?? "";
                    const href = Browser.universalLocation(null, nodeName, null, "/");
                    insertText(textArea.current,
                        `<a href="${htmlEntities(href)}" data-nodename="${htmlEntities(nodeName ?? "")}" data-href="/">`
                        + `${htmlEntities(text)}</a>`);
                }
            } else {
                insertText(textArea.current, nodeName ? "\\" + mentionName(nodeName) : "\\@");
            }
            focus();
        });
    }

    const formatHorizontalRule = () => {
        if (textArea.current == null) {
            return;
        }

        insertTextOnNewLine(textArea.current, isMarkdown() ? "\n---\n\n" : "\n<hr>\n");
    }

    const formatEmoji = (emoji: string) => {
        if (textArea.current == null) {
            return;
        }

        insertText(textArea.current, emoji);
        focus();
    }

    const formatBlockquote = () => {
        if (textArea.current == null) {
            return;
        }

        const wrapBegin = isMarkdown() ? ">>>" : "<blockquote>";
        const wrapEnd = isMarkdown() ? ">>>\n" : "</blockquote>\n";

        wrapBlock(textArea.current, wrapBegin, wrapEnd);
    }

    const formatBlockunquote = () => {
    }

    const formatList = (ordered: boolean) => {
        if (textArea.current == null) {
            return;
        }

        if (isMarkdown()) {
            wrapSelectionLinesOnNewLine(textArea.current, ordered ? "1. " : "* ", "");
        } else {
            wrapSelectionLines(textArea.current, "<li>", "</li>");
            textArea.current.selectionStart -= 4;
            textArea.current.selectionEnd += 5;
            wrapBlock(textArea.current, ordered ? "<ol>" : "<ul>", ordered ? "</ol>\n" : "</ul>\n");
        }
    }

    const formatIndent = () => {
    }

    const formatHeading = (level: number) => {
        if (textArea.current == null || level === 0) {
            return;
        }

        const wrapBegin = isMarkdown() ? "#".repeat(level) + " " : `<h${level}>`;
        const wrapEnd = isMarkdown() ? "\n" : `</h${level}>\n`;

        wrapSelectionOnNewLine(textArea.current, wrapBegin, wrapEnd);
    }

    const formatVideo = () => {
    }

    const formatFold = () => {
        showFoldDialog(true, null, (ok: boolean | null, {summary}: Partial<RichTextFoldValues>) => {
            showFoldDialog(false);

            if (textArea.current == null) {
                return;
            }

            if (ok) {
                let wrapBegin = "<details>";
                let wrapEnd = "</details>\n";
                if (summary) {
                    wrapBegin += `<summary>${htmlEntities(summary)}</summary>`;
                }
                wrapBlock(textArea.current, wrapBegin, wrapEnd);
            }
            focus();
        });
    }

    const formatCode = () => {
        if (textArea.current == null) {
            return;
        }

        if (isMarkdown()) {
            wrapSelectionLines(textArea.current, "`");
        } else {
            wrapSelection(textArea.current, "<code>", "</code>");
        }
    }

    const formatSubscript = () => {
        if (textArea.current == null) {
            return;
        }

        if (isMarkdown()) {
            wrapSelectionLines(textArea.current, "~");
        } else {
            wrapSelection(textArea.current, "<sub>", "</sub>");
        }
    }

    const formatSuperscript = () => {
        if (textArea.current == null) {
            return;
        }

        if (isMarkdown()) {
            wrapSelectionLines(textArea.current, "^");
        } else {
            wrapSelection(textArea.current, "<sup>", "</sup>");
        }
    }

    const formatCodeBlock = () => {
        if (textArea.current == null) {
            return;
        }

        const wrapBegin = isMarkdown() ? "```" : "<pre>";
        const wrapEnd = isMarkdown() ? "```\n" : "</pre>\n";

        wrapBlock(textArea.current, wrapBegin, wrapEnd);
    }

    const formatFormula = () => {
        showFormulaDialog(true, null, (ok: boolean | null, {math, block}: Partial<RichTextFormulaValues>) => {
            showFormulaDialog(false);

            if (textArea.current == null) {
                return;
            }

            if (ok && math) {
                if (block) {
                    const block = isMarkdown()
                        ? "```math\n" + math + "\n```\n"
                        : '<div class="katex">\n' + math + "\n</div>\n";
                    insertTextOnNewLine(textArea.current, block);
                } else {
                    const inline = isMarkdown() ? "$`" + math + "`$" : '<span class="katex">' + math + "</span>";
                    insertText(textArea.current, inline);
                }
            }
            focus();
        });
    }

    const formatMark = () => {
        if (textArea.current == null) {
            return;
        }

        wrapSelection(textArea.current, "<mark>", "</mark>");
    }

    const formatClear = () => {
    }

    const {openLocalFiles, showImageDialog} = useRichTextEditorMedia();

    const formatImage = (embedded?: boolean) => {
        if (embedded) {
            showImageDialog(
                true,
                null,
                null,
                "",
                true,
                null,
                (
                    ok: boolean | null,
                    {href, standardSize = "large", customWidth, customHeight, caption}: Partial<RichTextImageValues>
                ) => {
                    showImageDialog(false);

                    if (ok && textArea.current != null) {
                        insertImage(textArea.current, href ?? "", standardSize, customWidth, customHeight, caption);
                    }
                    focus();
                }
            );
        } else {
            openLocalFiles((images, standardSize, customWidth, customHeight, caption) => {
                if (textArea.current == null) {
                    return;
                }

                for (const image of images) {
                    insertImage(textArea.current, image, standardSize, customWidth, customHeight, caption);
                }
                focus();
            });
        }
    }

    return (
        <RichTextEditorCommandsContext.Provider value={{
            enableHeading: true, supportsComplexBlocks: !noComplexBlocks, supportsEmbeddedMedia: !noEmbeddedMedia,
            supportsMedia: !noMedia, supportsVideo: false, supportsClear: false,
            inBold: false, inItalic: false, inStrikeout: false, inLink: false,
            inSpoilerInline: false, inSpoilerBlock: false, inSpoiler: false, inMention: false, inBlockquote: false,
            inList: false, inUnorderedList: false, inOrderedList: false, headingLevel: 0, inVoid: false, inFold: false,
            inCode: false, inSubscript: false, inSuperscript: false, inCodeBlock: false, inFormula: false,
            inMark: false, inImageEmbedded: false, inImageAttached: false,
            focus, formatBold, formatItalic, formatStrikeout, formatLink, formatSpoiler, formatMention,
            formatHorizontalRule, formatEmoji, formatBlockquote, formatBlockunquote, formatList, formatIndent,
            formatHeading, formatVideo, formatFold, formatCode, formatSubscript, formatSuperscript, formatCodeBlock,
            formatFormula, formatMark, formatClear, formatImage,
        }}>
            {children}
        </RichTextEditorCommandsContext.Provider>
    );
}
