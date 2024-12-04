import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { NodeName, PostingFeatures, PrivateMediaFileInfo, SourceFormat } from "api";
import {
    msAddLink,
    msAddPhotoAlternate,
    msAlternateEmail,
    msExpandCircleDown,
    msFormatBold,
    msFormatItalic,
    msFormatQuote,
    msReport,
    msStrikethroughS
} from "ui/material-symbols";
import * as Browser from "ui/browser";
import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";
import { RichTextSpoilerValues } from "ui/control/richtexteditor/RichTextSpoilerDialog";
import { RichTextFoldValues } from "ui/control/richtexteditor/RichTextFoldDialog";
import { RichTextLinkValues } from "ui/control/richtexteditor/RichTextLinkDialog";
import RichTextImageDialog, {
    getImageDimensions,
    RichTextImageValues
} from "ui/control/richtexteditor/RichTextImageDialog";
import { useRichTextEditorDialogs } from "ui/control/richtexteditor/rich-text-editor-dialogs-context";
import { htmlEntities } from "util/html";
import { getTextSelection, insertText, wrapSelection, wrapSelectionLines } from "util/ui";
import { mentionName } from "util/names";
import { NameListItem } from "util/names-list";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";

interface Props {
    textArea: React.RefObject<HTMLTextAreaElement>,
    panel: React.RefObject<HTMLDivElement>,
    hiding?: boolean;
    format: Exclude<SourceFormat, "plain-text">;
    features: PostingFeatures | null;
    noMedia?: boolean;
    nodeName?: RelNodeName | string;
    forceImageCompress?: boolean;
    selectedImage: PrivateMediaFileInfo | null;
    selectImage: (image: PrivateMediaFileInfo | null) => void;
    onImageAdded?: (image: PrivateMediaFileInfo) => void;
    onImageDeleted?: (id: string) => void;
    externalImage?: File;
    uploadingExternalImage?: () => void;
}

export default function MarkdownEditorPanel({
    textArea, panel, hiding, format, features, noMedia, nodeName = REL_CURRENT, forceImageCompress, selectedImage,
    selectImage, onImageAdded, onImageDeleted, externalImage, uploadingExternalImage
}: Props) {
    const [imageDialog, setImageDialog] = useState<boolean>(false);
    const {showSpoilerDialog, showFoldDialog, showLinkDialog, showMentionDialog} = useRichTextEditorDialogs();

    const {t} = useTranslation();

    const onImage = (event: React.MouseEvent) => {
        setImageDialog(true);
        event.preventDefault();
    }

    const onImageSubmit = (
        ok: boolean | null,
        {
            source, mediaFile, href, standardSize = "large", customWidth, customHeight, align, caption, title, alt
        }: RichTextImageValues
    ) => {
        setImageDialog(false);
        selectImage(null);

        if (textArea.current == null) {
            return;
        }

        const src = source === "device" ? (mediaFile != null ? "hash:" + mediaFile.hash : null) : href;
        if (ok) {
            const figureBegin = caption ? "<figure>" : "";
            const figureEnd = caption ? `<figcaption>${htmlEntities(caption)}</figcaption></figure>` : "";
            const divBegin = align != null && align !== "text-start" ? `<div class="${align}">` : "";
            const divEnd = align != null && align !== "text-start" ? "</div>" : "";
            const {width, height} = getImageDimensions(standardSize, customWidth, customHeight);
            const widthAttr = width != null ? ` width="${width}"` : "";
            const heightAttr = height != null ? ` height="${height}"` : "";
            const titleAttr = title ? ` title="${htmlEntities(title)}"` : "";
            const altAttr = alt ? ` alt="${htmlEntities(alt)}"` : "";

            const tagBegin = `${divBegin}${figureBegin}<img${altAttr}${titleAttr}${widthAttr}${heightAttr} src="`;
            const tagEnd = `">${figureEnd}${divEnd}`;
            if (src) {
                insertText(textArea.current, tagBegin + htmlEntities(src) + tagEnd);
            } else {
                wrapSelection(textArea.current, tagBegin, tagEnd);
            }
        }
        textArea.current.focus();
    }

    useEffect(() => {
        if (selectedImage) {
            setImageDialog(true);
        }
    }, [selectedImage, setImageDialog])

    useEffect(() => {
        if (externalImage) {
            setImageDialog(true);
        }
    }, [externalImage, setImageDialog]);

    const isMarkdown = () => format === "markdown";

    const onBold = (event: React.MouseEvent) => {
        if (textArea.current == null) {
            return;
        }

        if (isMarkdown()) {
            wrapSelectionLines(textArea.current, "**");
        } else {
            wrapSelection(textArea.current, "<b>", "</b>");
        }
        textArea.current.focus();
        event.preventDefault();
    }

    const onItalic = (event: React.MouseEvent) => {
        if (textArea.current == null) {
            return;
        }

        if (isMarkdown()) {
            wrapSelectionLines(textArea.current, "_");
        } else {
            wrapSelection(textArea.current, "<i>", "</i>");
        }
        textArea.current.focus();
        event.preventDefault();
    }

    const onStrike = (event: React.MouseEvent) => {
        if (textArea.current == null) {
            return;
        }

        if (isMarkdown()) {
            wrapSelectionLines(textArea.current, "~~");
        } else {
            wrapSelection(textArea.current, "<s>", "</s>");
        }
        textArea.current.focus();
        event.preventDefault();
    }

    const onSpoiler = (event: React.MouseEvent) => {
        showSpoilerDialog(true, null, (ok: boolean | null, {title}: RichTextSpoilerValues) => {
            if (textArea.current == null) {
                return;
            }

            showSpoilerDialog(false);
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
            textArea.current.focus();
        });

        event.preventDefault();
    }

    const onFold = (event: React.MouseEvent) => {
        showFoldDialog(true, null, (ok: boolean | null, {summary}: RichTextFoldValues) => {
            if (textArea.current == null) {
                return;
            }

            showFoldDialog(false);
            if (ok) {
                let wrapBegin = "<details>";
                let wrapEnd = "</details>";
                if (summary) {
                    wrapBegin += `<summary>${htmlEntities(summary)}</summary>`;
                }
                const selection = getTextSelection(textArea.current);
                if (!selection || !selection.startsWith("\n")) {
                    wrapBegin += "\n";
                }
                if (!selection || !selection.endsWith("\n")) {
                    wrapEnd = "\n" + wrapEnd;
                } else {
                    wrapEnd += "\n";
                }
                wrapSelection(textArea.current, wrapBegin, wrapEnd);
            }
            textArea.current.focus();
        });

        event.preventDefault();
    }

    const onMention = (event: React.MouseEvent) => {
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
            textArea.current.focus();
        });

        event.preventDefault();
    }

    const onQuote = (event: React.MouseEvent) => {
        if (textArea.current == null) {
            return;
        }

        let wrapBegin = isMarkdown() ? ">>>" : "<blockquote>";
        let wrapEnd = isMarkdown() ? ">>>\n" : "</blockquote>\n";

        const value = textArea.current.value;
        const start = textArea.current.selectionStart;
        const selection = getTextSelection(textArea.current);

        if (start > 0 && value[start - 1] !== "\n") {
            wrapBegin = "\n" + wrapBegin;
        }
        if (!selection || !selection.startsWith("\n")) {
            wrapBegin += "\n";
        }
        if (!selection || !selection.endsWith("\n")) {
            wrapEnd = "\n" + wrapEnd;
        }
        wrapSelection(textArea.current, wrapBegin, wrapEnd);
        textArea.current.focus();
        event.preventDefault();
    }

    const onLink = (event: React.MouseEvent) => {
        if (textArea.current == null) {
            return;
        }

        showLinkDialog(true, null, (ok: boolean | null, {href}: Partial<RichTextLinkValues>) => {
            showLinkDialog(false);

            if (textArea.current == null) {
                return;
            }

            if (ok) {
                if (isMarkdown()) {
                    wrapSelection(textArea.current, "[", `](${htmlEntities(href ?? "")})`);
                } else {
                    wrapSelection(textArea.current, `<a href="${htmlEntities(href ?? "")}">`, "</a>");
                }
            }
            textArea.current.focus();
        });

        event.preventDefault();
    }

    return (
        <div className={cx("rich-text-editor-panel", {"hiding": hiding})} ref={panel}>
            <div className="group">
                <RichTextEditorButton icon={msFormatBold} title={t("bold")} letter="B" onClick={onBold}/>
                <RichTextEditorButton icon={msFormatItalic} title={t("italic")} letter="I" onClick={onItalic}/>
                <RichTextEditorButton icon={msStrikethroughS} title={t("strikeout")} letter="R"
                                      onClick={onStrike}/>
            </div>
            <div className="group">
                <RichTextEditorButton icon={msReport} title={t("spoiler")} onClick={onSpoiler}/>
                <RichTextEditorButton icon={msExpandCircleDown} title={t("fold")} onClick={onFold}/>
            </div>
            <div className="group">
                <RichTextEditorButton icon={msAlternateEmail} title={t("mention")} className="mention"
                                      onClick={onMention}/>
                <RichTextEditorButton icon={msFormatQuote} title={t("quote")} letter="Q" onClick={onQuote}/>
            </div>
            <div className="group">
                <RichTextEditorButton icon={msAddLink} title={t("link")} letter="L" onClick={onLink}/>
                {!noMedia &&
                    <RichTextEditorButton icon={msAddPhotoAlternate} title={t("image")} letter="M" onClick={onImage}/>
                }
            </div>
            {imageDialog &&
                <RichTextImageDialog onSubmit={onImageSubmit} nodeName={nodeName}
                                     forceCompress={forceImageCompress} selectedImage={selectedImage}
                                     features={features} noMedia={noMedia} onAdded={onImageAdded}
                                     onDeleted={onImageDeleted} externalImage={externalImage}
                                     uploadingExternalImage={uploadingExternalImage}/>
            }
        </div>
    );
}
