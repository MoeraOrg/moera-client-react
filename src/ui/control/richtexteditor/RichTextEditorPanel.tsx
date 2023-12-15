import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { NodeName, PostingFeatures, PrivateMediaFileInfo, SourceFormat } from "api";
import { getNodeRootPage } from "state/node/selectors";
import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";
import RichTextSpoilerDialog, { RichTextSpoilerValues } from "ui/control/richtexteditor/RichTextSpoilerDialog";
import RichTextFoldDialog, { RichTextFoldValues } from "ui/control/richtexteditor/RichTextFoldDialog";
import RichTextLinkDialog, { RichTextLinkValues } from "ui/control/richtexteditor/RichTextLinkDialog";
import RichTextImageDialog, {
    getImageDimensions,
    RichTextImageValues
} from "ui/control/richtexteditor/RichTextImageDialog";
import RichTextMentionDialog from "ui/control/richtexteditor/RichTextMentionDialog";
import { htmlEntities } from "util/html";
import { getTextSelection, insertText, wrapSelection, wrapSelectionLines } from "util/ui";
import { mentionName } from "util/names";
import { redirectUrl } from "util/url";
import { NameListItem } from "util/names-list";
import "./RichTextEditorPanel.css";

interface Props {
    textArea: React.RefObject<HTMLTextAreaElement>,
    panel: React.RefObject<HTMLDivElement>,
    hiding?: boolean;
    format: Exclude<SourceFormat, "plain-text">;
    features: PostingFeatures | null;
    noMedia?: boolean;
    nodeName?: string | null;
    forceImageCompress?: boolean;
    selectedImage: PrivateMediaFileInfo | null;
    selectImage: (image: PrivateMediaFileInfo | null) => void;
    onImageAdded?: (image: PrivateMediaFileInfo) => void;
    onImageDeleted?: (id: string) => void;
    externalImage?: File;
    uploadingExternalImage?: () => void;
}

export default function RichTextEditorPanel({
    textArea, panel, hiding, format, features, noMedia, nodeName, forceImageCompress, selectedImage, selectImage,
    onImageAdded, onImageDeleted, externalImage, uploadingExternalImage
}: Props) {
    const nodeRootPage = useSelector(getNodeRootPage);

    const [spoilerDialog, setSpoilerDialog] = useState<boolean>(false);
    const [foldDialog, setFoldDialog] = useState<boolean>(false);
    const [linkDialog, setLinkDialog] = useState<boolean>(false);
    const [imageDialog, setImageDialog] = useState<boolean>(false);
    const [mentionDialog, setMentionDialog] = useState<boolean>(false);
    const [dialogText, setDialogText] = useState<string>("");

    const {t} = useTranslation();

    const onImageClose = useCallback(() => {
        setImageDialog(false);
        window.closeLightDialog = null;
        selectImage(null);
    }, [setImageDialog, selectImage]);

    const onImage = (event: React.MouseEvent) => {
        setImageDialog(true);
        window.closeLightDialog = onImageClose;
        event.preventDefault();
    }

    const onImageSubmit = (
        ok: boolean,
        {
            source, mediaFile, href, standardSize = "large", customWidth, customHeight, align, caption, title, alt
        }: RichTextImageValues
    ) => {
        onImageClose();

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
            window.closeLightDialog = onImageClose;

            return () => {
                window.closeLightDialog = null;
            }
        }
    }, [selectedImage, setImageDialog, onImageClose])

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
            wrapSelection(textArea.current, "<strike>", "</strike>");
        }
        textArea.current.focus();
        event.preventDefault();
    }

    const onSpoilerClose = () => {
        setSpoilerDialog(false);
        window.closeLightDialog = null;
    }

    const onSpoiler = (event: React.MouseEvent) => {
        setSpoilerDialog(true);
        window.closeLightDialog = onSpoilerClose;
        event.preventDefault();
    }

    const onSpoilerSubmit = (ok: boolean, {title}: RichTextSpoilerValues) => {
        if (textArea.current == null) {
            return;
        }

        onSpoilerClose();
        if (ok) {
            if (title) {
                wrapSelection(textArea.current, `<mr-spoiler title="${htmlEntities(title)}">`, "</mr-spoiler>");
            } else {
                if (isMarkdown()) {
                    wrapSelection(textArea.current, "||");
                } else {
                    wrapSelection(textArea.current, "<mr-spoiler>", "</mr-spoiler>");
                }
            }
        }
        textArea.current.focus();
    }

    const onFoldClose = () => {
        setFoldDialog(false);
        window.closeLightDialog = null;
    }

    const onFold = (event: React.MouseEvent) => {
        setFoldDialog(true);
        window.closeLightDialog = onFoldClose;
        event.preventDefault();
    }

    const onFoldSubmit = (ok: boolean, {summary}: RichTextFoldValues) => {
        if (textArea.current == null) {
            return;
        }

        onFoldClose();
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
    }

    const onMentionClose = () => {
        setMentionDialog(false);
        window.closeLightDialog = null;
    }

    const onMention = (event: React.MouseEvent) => {
        setMentionDialog(true);
        window.closeLightDialog = onMentionClose;
        event.preventDefault();
    }

    const onMentionSubmit = (ok: boolean, {nodeName, fullName}: NameListItem) => {
        onMentionClose();

        if (textArea.current == null) {
            return;
        }

        const value = textArea.current.value;
        const start = textArea.current.selectionStart;
        if (value.length >= start && value[start - 1] === "@") {
            textArea.current.selectionStart = start - 1;
        }

        if (ok) {
            if (isMarkdown() || nodeRootPage == null) {
                insertText(textArea.current, mentionName(nodeName, fullName))
            } else {
                const text = (fullName || NodeName.shorten(nodeName)) ?? nodeName ?? "";
                const href = redirectUrl(false, nodeRootPage, nodeName, null, "/", null);
                insertText(textArea.current,
                    `<a href="${htmlEntities(href)}" data-nodename="${htmlEntities(nodeName ?? "")}" data-href="/">`
                    + `${htmlEntities(text)}</a>`);
            }
        } else {
            insertText(textArea.current, nodeName ? mentionName(nodeName) : "@")
        }
        textArea.current.focus();
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

    const onLinkClose = () => {
        setLinkDialog(false);
        window.closeLightDialog = null;
    }

    const onLink = (event: React.MouseEvent) => {
        if (textArea.current == null) {
            return;
        }

        setLinkDialog(true);
        setDialogText(getTextSelection(textArea.current));
        window.closeLightDialog = onLinkClose;
        event.preventDefault();
    }

    const onLinkSubmit = (ok: boolean, {href, text}: RichTextLinkValues) => {
        onLinkClose();

        if (textArea.current == null) {
            return;
        }

        if (ok) {
            if (isMarkdown()) {
                if (text) {
                    if (href) {
                        insertText(textArea.current, `[${text}](${href})`);
                    } else {
                        insertText(textArea.current, `[${text}]`);
                        wrapSelection(textArea.current, "(", ")");
                    }
                } else {
                    if (href) {
                        insertText(textArea.current, href);
                    } else {
                        wrapSelection(textArea.current, "[](", ")");
                    }
                }
            } else {
                if (text) {
                    if (href) {
                        insertText(textArea.current, `<a href="${htmlEntities(href)}">${htmlEntities(text)}</a>`);
                    } else {
                        insertText(textArea.current, "");
                        wrapSelection(textArea.current, "<a href=\"", `">${htmlEntities(text)}</a>`);
                    }
                } else {
                    if (href) {
                        insertText(textArea.current, `<a href="${htmlEntities(href)}">${htmlEntities(href)}</a>`);
                    } else {
                        wrapSelection(textArea.current, "<a href=\"", "\"></a>");
                    }
                }
            }
        }
        textArea.current.focus();
    }

    return (
        <div className={cx("rich-text-editor-panel", {"hiding": hiding})} ref={panel}>
            <div className="group">
                <RichTextEditorButton icon="bold" title={t("bold")} letter="B" onClick={onBold}/>
                <RichTextEditorButton icon="italic" title={t("italic")} letter="I" onClick={onItalic}/>
                <RichTextEditorButton icon="strikethrough" title={t("strikeout")} letter="R"
                                      onClick={onStrike}/>
            </div>
            <div className="group">
                <RichTextEditorButton icon="exclamation-circle" title={t("spoiler")} onClick={onSpoiler}/>
                <RichTextEditorButton icon="caret-square-down" title={t("fold")} onClick={onFold}/>
            </div>
            <div className="group">
                <RichTextEditorButton icon="at" title={t("mention")} className="mention" onClick={onMention}/>
                <RichTextEditorButton icon="quote-left" title={t("quote")} letter="Q" onClick={onQuote}/>
            </div>
            <div className="group">
                <RichTextEditorButton icon="link" title={t("link")} letter="L" onClick={onLink}/>
                <RichTextEditorButton icon="image" title={t("image")} letter="M" onClick={onImage}/>
            </div>
            {spoilerDialog && <RichTextSpoilerDialog onSubmit={onSpoilerSubmit}/>}
            {foldDialog && <RichTextFoldDialog onSubmit={onFoldSubmit}/>}
            {linkDialog && <RichTextLinkDialog text={dialogText} onSubmit={onLinkSubmit}/>}
            {imageDialog &&
                <RichTextImageDialog onSubmit={onImageSubmit} nodeName={nodeName}
                                     forceCompress={forceImageCompress} selectedImage={selectedImage}
                                     features={features} noMedia={noMedia} onAdded={onImageAdded}
                                     onDeleted={onImageDeleted} externalImage={externalImage}
                                     uploadingExternalImage={uploadingExternalImage}/>
            }
            {mentionDialog && <RichTextMentionDialog onSubmit={onMentionSubmit}/>}
        </div>
    );
}
