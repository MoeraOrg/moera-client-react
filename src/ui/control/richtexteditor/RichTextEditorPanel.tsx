import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { NodeName } from "api";
import { PostingFeatures, PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
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
import { getTextSelection, insertText, mentionName, wrapSelection } from "util/misc";
import { redirectUrl } from "util/url";
import { NameListItem } from "util/names-list";
import "./RichTextEditorPanel.css";

type Props = {
    textArea: React.RefObject<HTMLTextAreaElement>,
    panel: React.RefObject<HTMLDivElement>,
    hiding?: boolean;
    format: string;
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
} & ConnectedProps<typeof connector>;

interface State {
    spoilerDialog: boolean;
    foldDialog: boolean;
    linkDialog: boolean;
    imageDialog: boolean;
    mentionDialog: boolean;
    dialogText: string;
}

class RichTextEditorPanel extends React.PureComponent<Props, State> {

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            spoilerDialog: false,
            foldDialog: false,
            linkDialog: false,
            imageDialog: false,
            mentionDialog: false,
            dialogText: ""
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (this.props.selectedImage != null && prevProps.selectedImage == null) {
            this.setState({imageDialog: true});
            window.closeLightDialog = this.onImageClose;
        }
    }

    componentWillUnmount() {
        window.closeLightDialog = null;
    }

    isMarkdown() {
        return this.props.format === "markdown";
    }

    onBold = (event: React.MouseEvent) => {
        const {textArea} = this.props;

        if (textArea.current == null) {
            return;
        }

        if (this.isMarkdown()) {
            wrapSelection(textArea.current, "**");
        } else {
            wrapSelection(textArea.current, "<b>", "</b>");
        }
        textArea.current.focus();
        event.preventDefault();
    }

    onItalic = (event: React.MouseEvent) => {
        const {textArea} = this.props;

        if (textArea.current == null) {
            return;
        }

        if (this.isMarkdown()) {
            wrapSelection(textArea.current, "_");
        } else {
            wrapSelection(textArea.current, "<i>", "</i>");
        }
        textArea.current.focus();
        event.preventDefault();
    }

    onStrike = (event: React.MouseEvent) => {
        const {textArea} = this.props;

        if (textArea.current == null) {
            return;
        }

        if (this.isMarkdown()) {
            wrapSelection(textArea.current, "~~");
        } else {
            wrapSelection(textArea.current, "<strike>", "</strike>");
        }
        textArea.current.focus();
        event.preventDefault();
    }

    onSpoiler = (event: React.MouseEvent) => {
        this.setState({spoilerDialog: true});
        window.closeLightDialog = this.onSpoilerClose;
        event.preventDefault();
    }

    onSpoilerClose = () => {
        this.setState({spoilerDialog: false});
        window.closeLightDialog = null;
    }

    onSpoilerSubmit = (ok: boolean, {title}: RichTextSpoilerValues) => {
        const {textArea} = this.props;

        if (textArea.current == null) {
            return;
        }

        this.onSpoilerClose();
        if (ok) {
            if (title) {
                wrapSelection(textArea.current, `<mr-spoiler title="${htmlEntities(title)}">`, "</mr-spoiler>");
            } else {
                if (this.isMarkdown()) {
                    wrapSelection(textArea.current, "||");
                } else {
                    wrapSelection(textArea.current, "<mr-spoiler>", "</mr-spoiler>");
                }
            }
        }
        textArea.current.focus();
    }

    onFold = (event: React.MouseEvent) => {
        this.setState({foldDialog: true});
        window.closeLightDialog = this.onFoldClose;
        event.preventDefault();
    }

    onFoldClose = () => {
        this.setState({foldDialog: false});
        window.closeLightDialog = null;
    }

    onFoldSubmit = (ok: boolean, {summary}: RichTextFoldValues) => {
        const {textArea} = this.props;

        if (textArea.current == null) {
            return;
        }

        this.onFoldClose();
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

    onMention = (event: React.MouseEvent) => {
        this.setState({mentionDialog: true});
        window.closeLightDialog = this.onMentionClose;
        event.preventDefault();
    }

    onMentionClose = () => {
        this.setState({mentionDialog: false});
        window.closeLightDialog = null;
    }

    onMentionSubmit = (ok: boolean, {nodeName, fullName}: NameListItem) => {
        const {textArea, nodeRootPage} = this.props;

        this.onMentionClose();

        if (textArea.current == null) {
            return;
        }

        const value = textArea.current.value;
        const start = textArea.current.selectionStart;
        if (value.length >= start && value[start - 1] === "@") {
            textArea.current.selectionStart = start - 1;
        }

        if (ok) {
            if (this.isMarkdown() || nodeRootPage == null) {
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

    onQuote = (event: React.MouseEvent) => {
        const {textArea} = this.props;

        if (textArea.current == null) {
            return;
        }

        let wrapBegin = this.isMarkdown() ? ">>>" : "<blockquote>";
        let wrapEnd = this.isMarkdown() ? ">>>\n" : "</blockquote>\n";

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

    onLink = (event: React.MouseEvent) => {
        const {textArea} = this.props;

        if (textArea.current == null) {
            return;
        }

        this.setState({
            linkDialog: true,
            dialogText: getTextSelection(textArea.current)
        });
        window.closeLightDialog = this.onLinkClose;
        event.preventDefault();
    }

    onLinkClose = () => {
        this.setState({linkDialog: false});
        window.closeLightDialog = null;
    }

    onLinkSubmit = (ok: boolean, {href, text}: RichTextLinkValues) => {
        const {textArea} = this.props;

        this.onLinkClose();

        if (textArea.current == null) {
            return;
        }

        if (ok) {
            if (this.isMarkdown()) {
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

    onImage = (event: React.MouseEvent) => {
        this.setState({imageDialog: true});
        window.closeLightDialog = this.onImageClose;
        event.preventDefault();
    }

    onImageClose = () => {
        this.setState({imageDialog: false});
        window.closeLightDialog = null;
        this.props.selectImage(null);
    }

    onImageSubmit = (ok: boolean, {source, mediaFile, href, standardSize = "large", customWidth, customHeight,
                                   align, caption, title, alt}: RichTextImageValues) => {
        const {textArea} = this.props;

        this.onImageClose();

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

    render() {
        const {
            hiding, format, panel, features, noMedia, nodeName, forceImageCompress, selectedImage, onImageAdded,
            onImageDeleted, externalImage, uploadingExternalImage
        } = this.props;
        const {spoilerDialog, foldDialog, linkDialog, imageDialog, mentionDialog, dialogText} = this.state;

        if (format === "plain-text") {
            return null;
        }

        if (externalImage) {
            this.setState({imageDialog: true});
        }

        return (
            <div className={cx("rich-text-editor-panel", {"hiding": hiding})} ref={panel}>
                <div className="group">
                    <RichTextEditorButton icon="bold" title="Bold" letter="B" onClick={this.onBold}/>
                    <RichTextEditorButton icon="italic" title="Italic" letter="I" onClick={this.onItalic}/>
                    <RichTextEditorButton icon="strikethrough" title="Strikeout" letter="R" onClick={this.onStrike}/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="exclamation-circle" title="Spoiler" onClick={this.onSpoiler}/>
                    <RichTextEditorButton icon="caret-square-down" title="Fold" onClick={this.onFold}/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="at" title="Mention" className="mention" onClick={this.onMention}/>
                    <RichTextEditorButton icon="quote-left" title="Quote" letter="Q" onClick={this.onQuote}/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="link" title="Link" letter="L" onClick={this.onLink}/>
                    <RichTextEditorButton icon="image" title="Image" letter="M" onClick={this.onImage}/>
                </div>
                <RichTextSpoilerDialog show={spoilerDialog} onSubmit={this.onSpoilerSubmit}/>
                <RichTextFoldDialog show={foldDialog} onSubmit={this.onFoldSubmit}/>
                <RichTextLinkDialog show={linkDialog} text={dialogText} onSubmit={this.onLinkSubmit}/>
                <RichTextImageDialog show={imageDialog} onSubmit={this.onImageSubmit} nodeName={nodeName}
                                     forceCompress={forceImageCompress} selectedImage={selectedImage}
                                     features={features} noMedia={noMedia} onAdded={onImageAdded}
                                     onDeleted={onImageDeleted} externalImage={externalImage}
                                     uploadingExternalImage={uploadingExternalImage}/>
                <RichTextMentionDialog show={mentionDialog} onSubmit={this.onMentionSubmit}/>
            </div>
        );
    }

}

const connector = connect(
    (state: ClientState) => ({
        nodeRootPage: getNodeRootPage(state)
    })
);

export default connector(RichTextEditorPanel);
