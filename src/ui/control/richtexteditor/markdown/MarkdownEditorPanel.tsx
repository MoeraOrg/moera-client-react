import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import {
    faAt,
    faBold,
    faCaretSquareDown,
    faExclamationCircle,
    faImage,
    faItalic,
    faLink,
    faQuoteLeft,
    faStrikethrough
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { NodeName, PostingFeatures, PrivateMediaFileInfo, SourceFormat } from "api";
import * as Browser from "ui/browser";
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
import { NameListItem } from "util/names-list";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import "./MarkdownEditorPanel.css";

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
    const [spoilerDialog, setSpoilerDialog] = useState<boolean>(false);
    const [foldDialog, setFoldDialog] = useState<boolean>(false);
    const [linkDialog, setLinkDialog] = useState<boolean>(false);
    const [imageDialog, setImageDialog] = useState<boolean>(false);
    const [mentionDialog, setMentionDialog] = useState<boolean>(false);

    const {t} = useTranslation();

    const onImage = (event: React.MouseEvent) => {
        setImageDialog(true);
        event.preventDefault();
    }

    const onImageSubmit = (
        ok: boolean,
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
        setSpoilerDialog(true);
        event.preventDefault();
    }

    const onSpoilerSubmit = (ok: boolean, {title}: RichTextSpoilerValues) => {
        if (textArea.current == null) {
            return;
        }

        setSpoilerDialog(false);
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

    const onFold = (event: React.MouseEvent) => {
        setFoldDialog(true);
        event.preventDefault();
    }

    const onFoldSubmit = (ok: boolean, {summary}: RichTextFoldValues) => {
        if (textArea.current == null) {
            return;
        }

        setFoldDialog(false);
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

    const onMention = (event: React.MouseEvent) => {
        if (!mentionDialog) {
            setMentionDialog(true);
        }
        event.preventDefault();
    }

    const onMentionSubmit = (ok: boolean, {nodeName, fullName}: NameListItem) => {
        setMentionDialog(false);

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
            insertText(textArea.current, nodeName ? "\\" + mentionName(nodeName) : "\\@")
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

    const onLink = (event: React.MouseEvent) => {
        if (textArea.current == null) {
            return;
        }

        setLinkDialog(true);
        event.preventDefault();
    }

    const onLinkSubmit = (ok: boolean, {href}: RichTextLinkValues) => {
        setLinkDialog(false);

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
    }

    return (
        <div className={cx("markdown-editor-panel", {"hiding": hiding})} ref={panel}>
            <div className="group">
                <RichTextEditorButton icon={faBold} title={t("bold")} letter="B" onClick={onBold}/>
                <RichTextEditorButton icon={faItalic} title={t("italic")} letter="I" onClick={onItalic}/>
                <RichTextEditorButton icon={faStrikethrough} title={t("strikeout")} letter="R"
                                      onClick={onStrike}/>
            </div>
            <div className="group">
                <RichTextEditorButton icon={faExclamationCircle} title={t("spoiler")} onClick={onSpoiler}/>
                <RichTextEditorButton icon={faCaretSquareDown} title={t("fold")} onClick={onFold}/>
            </div>
            <div className="group">
                <RichTextEditorButton icon={faAt} title={t("mention")} className="mention" onClick={onMention}/>
                <RichTextEditorButton icon={faQuoteLeft} title={t("quote")} letter="Q" onClick={onQuote}/>
            </div>
            <div className="group">
                <RichTextEditorButton icon={faLink} title={t("link")} letter="L" onClick={onLink}/>
                <RichTextEditorButton icon={faImage} title={t("image")} letter="M" onClick={onImage}/>
            </div>
            {spoilerDialog && <RichTextSpoilerDialog title="" onSubmit={onSpoilerSubmit}/>}
            {foldDialog && <RichTextFoldDialog onSubmit={onFoldSubmit}/>}
            {linkDialog && <RichTextLinkDialog href="" onSubmit={onLinkSubmit}/>}
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
