import React from 'react';
import PropType from 'prop-types';
import * as textFieldEdit from 'text-field-edit';
import cx from 'classnames';

import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";
import RichTextSpoilerDialog from "ui/control/richtexteditor/RichTextSpoilerDialog";
import RichTextFoldDialog from "ui/control/richtexteditor/RichTextFoldDialog";
import RichTextLinkDialog from "ui/control/richtexteditor/RichTextLinkDialog";
import RichTextImageDialog from "ui/control/richtexteditor/RichTextImageDialog";
import { htmlEntities } from "util/html";
import "./RichTextEditorPanel.css";

export default class RichTextEditorPanel extends React.PureComponent {

    static propTypes = {
        textArea: PropType.object,
        panel: PropType.object,
        hiding: PropType.bool,
        format: PropType.string
    };

    state = {
        spoilerDialog: false,
        foldDialog: false,
        linkDialog: false,
        imageDialog: false,
        dialogText: ""
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            panel: props.panel ?? React.createRef()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.panel !== prevProps.panel) {
            this.props.panel.current = this.state.panel.current;
            this.setState({panel: this.props.panel});
        }
    }

    isMarkdown() {
        return this.props.format === "markdown";
    }

    onBold = event => {
        const {textArea} = this.props;

        if (this.isMarkdown()) {
            textFieldEdit.wrapSelection(textArea.current, "**");
        } else {
            textFieldEdit.wrapSelection(textArea.current, "<b>", "</b>");
        }
        textArea.current.focus();
        event.preventDefault();
    }

    onItalic = event => {
        const {textArea} = this.props;

        if (this.isMarkdown()) {
            textFieldEdit.wrapSelection(textArea.current, "_");
        } else {
            textFieldEdit.wrapSelection(textArea.current, "<i>", "</i>");
        }
        textArea.current.focus();
        event.preventDefault();
    }

    onStrike = event => {
        const {textArea} = this.props;

        if (this.isMarkdown()) {
            textFieldEdit.wrapSelection(textArea.current, "~~");
        } else {
            textFieldEdit.wrapSelection(textArea.current, "<strike>", "</strike>");
        }
        textArea.current.focus();
        event.preventDefault();
    }

    onSpoiler = event => {
        this.setState({spoilerDialog: true});
        event.preventDefault();
    }

    onSpoilerSubmit = (ok, {title}) => {
        const {textArea} = this.props;

        this.setState({spoilerDialog: false});
        if (ok) {
            if (title) {
                textFieldEdit.wrapSelection(textArea.current,
                    `<mr-spoiler title="${htmlEntities(title)}">`, "</mr-spoiler>");
            } else {
                if (this.isMarkdown()) {
                    textFieldEdit.wrapSelection(textArea.current, "||");
                } else {
                    textFieldEdit.wrapSelection(textArea.current, "<mr-spoiler>", "</mr-spoiler>");
                }
            }
        }
        textArea.current.focus();
    }

    onFold = event => {
        this.setState({foldDialog: true});
        event.preventDefault();
    }

    onFoldSubmit = (ok, {summary}) => {
        const {textArea} = this.props;

        this.setState({foldDialog: false});
        if (ok) {
            let wrapBegin = "<details>";
            let wrapEnd = "</details>";
            if (summary) {
                wrapBegin += `<summary>${htmlEntities(summary)}</summary>`;
            }
            const selection = textFieldEdit.getSelection(textArea.current);
            if (!selection || !selection.startsWith("\n")) {
                wrapBegin += "\n";
            }
            if (!selection || !selection.endsWith("\n")) {
                wrapEnd = "\n" + wrapEnd;
            } else {
                wrapEnd += "\n";
            }
            textFieldEdit.wrapSelection(textArea.current, wrapBegin, wrapEnd);
        }
        textArea.current.focus();
    }

    onQuote = event => {
        const {textArea} = this.props;

        let wrapBegin = this.isMarkdown() ? "\n>>>" : "\n<blockquote>";
        let wrapEnd = this.isMarkdown() ? ">>>\n" : "</blockquote>\n";
        const selection = textFieldEdit.getSelection(textArea.current);
        if (!selection || !selection.startsWith("\n")) {
            wrapBegin += "\n";
        }
        if (!selection || !selection.endsWith("\n")) {
            wrapEnd = "\n" + wrapEnd;
        }
        textFieldEdit.wrapSelection(textArea.current, wrapBegin, wrapEnd);
        textArea.current.focus();
        event.preventDefault();
    }

    onLink = event => {
        const {textArea} = this.props;

        this.setState({
            linkDialog: true,
            dialogText: textFieldEdit.getSelection(textArea.current)
        });
        event.preventDefault();
    }

    onLinkSubmit = (ok, {href, text}) => {
        const {textArea} = this.props;

        this.setState({linkDialog: false});
        if (ok) {
            if (this.isMarkdown()) {
                if (text) {
                    if (href) {
                        textFieldEdit.insert(textArea.current, `[${text}](${href})`);
                    } else {
                        textFieldEdit.insert(textArea.current, `[${text}]`);
                        textFieldEdit.wrapSelection(textArea.current, "(", ")");
                    }
                } else {
                    if (href) {
                        textFieldEdit.insert(textArea.current, href);
                    } else {
                        textFieldEdit.wrapSelection(textArea.current, "[](", ")");
                    }
                }
            } else {
                if (text) {
                    if (href) {
                        textFieldEdit.insert(textArea.current,
                            `<a href="${htmlEntities(href)}">${htmlEntities(text)}</a>`);
                    } else {
                        textFieldEdit.insert(textArea.current, "");
                        textFieldEdit.wrapSelection(textArea.current,
                            "<a href=\"", `">${htmlEntities(text)}</a>`);
                    }
                } else {
                    if (href) {
                        textFieldEdit.insert(textArea.current,
                            `<a href="${htmlEntities(href)}">${htmlEntities(href)}</a>`);
                    } else {
                        textFieldEdit.wrapSelection(textArea.current, "<a href=\"", "\"></a>");
                    }
                }
            }
        }
        textArea.current.focus();
    }

    onImage = event => {
        this.setState({imageDialog: true});
        event.preventDefault();
    }

    onImageSubmit = (ok, {href, alt}) => {
        const {textArea} = this.props;

        this.setState({imageDialog: false});
        if (ok) {
            if (this.isMarkdown()) {
                if (alt) {
                    if (href) {
                        textFieldEdit.insert(textArea.current, `![${alt}](${href})`);
                    } else {
                        textFieldEdit.wrapSelection(textArea.current, `![${alt}](`, ")");
                    }
                } else {
                    if (href) {
                        textFieldEdit.insert(textArea.current, `![](${href})`);
                    } else {
                        textFieldEdit.wrapSelection(textArea.current, "![](", ")");
                    }
                }
            } else {
                if (alt) {
                    if (href) {
                        textFieldEdit.insert(textArea.current,
                            `<img alt="${htmlEntities(alt)}" src="${htmlEntities(href)}">`);
                    } else {
                        textFieldEdit.wrapSelection(textArea.current,
                            `<img alt="${htmlEntities(alt)}" src="`, "\">");
                    }
                } else {
                    if (href) {
                        textFieldEdit.insert(textArea.current, `<img src="${htmlEntities(href)}">`);
                    } else {
                        textFieldEdit.wrapSelection(textArea.current, `<img src="`, "\">");
                    }
                }
            }
        }
        textArea.current.focus();
    }

    render() {
        const {hiding, format} = this.props;
        const {spoilerDialog, foldDialog, linkDialog, imageDialog, dialogText, panel} = this.state;

        if (format === "plain-text") {
            return null;
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
                    <RichTextEditorButton icon="quote-left" title="Quote" letter="Q" onClick={this.onQuote}/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="link" title="Link" letter="L" onClick={this.onLink}/>
                    <RichTextEditorButton icon="image" title="Image" letter="M" onClick={this.onImage}/>
                </div>
                <RichTextSpoilerDialog show={spoilerDialog} onSubmit={this.onSpoilerSubmit}/>
                <RichTextFoldDialog show={foldDialog} onSubmit={this.onFoldSubmit}/>
                <RichTextLinkDialog show={linkDialog} text={dialogText} onSubmit={this.onLinkSubmit}/>
                <RichTextImageDialog show={imageDialog} onSubmit={this.onImageSubmit}/>
            </div>
        );
    }

}
