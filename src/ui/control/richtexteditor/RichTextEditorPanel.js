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
        hiding: PropType.bool
    };

    state = {
        spoilerDialog: false,
        foldDialog: false,
        linkDialog: false,
        imageDialog: false,
        dialogText: ""
    };

    onBold = event => {
        const {textArea} = this.props;

        textFieldEdit.wrapSelection(textArea.current, "**");
        textArea.current.focus();
        event.preventDefault();
    }

    onItalic = event => {
        const {textArea} = this.props;

        textFieldEdit.wrapSelection(textArea.current, "_");
        textArea.current.focus();
        event.preventDefault();
    }

    onStrike = event => {
        const {textArea} = this.props;

        textFieldEdit.wrapSelection(textArea.current, "~~");
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
                textFieldEdit.wrapSelection(textArea.current, "||");
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

        let wrapBegin = "\n>>>";
        let wrapEnd = ">>>\n";
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
        }
        textArea.current.focus();
    }

    render() {
        const {hiding} = this.props;
        const {spoilerDialog, foldDialog, linkDialog, imageDialog, dialogText} = this.state;

        return (
            <div className={cx("rich-text-editor-panel", {"hiding": hiding})}>
                <div className="group">
                    <RichTextEditorButton icon="bold" title="Bold" onClick={this.onBold}/>
                    <RichTextEditorButton icon="italic" title="Italic" onClick={this.onItalic}/>
                    <RichTextEditorButton icon="strikethrough" title="Strikeout" onClick={this.onStrike}/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="exclamation-circle" title="Spoiler" onClick={this.onSpoiler}/>
                    <RichTextEditorButton icon="caret-square-down" title="Fold" onClick={this.onFold}/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="quote-left" title="Quote" onClick={this.onQuote}/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="link" title="Link" onClick={this.onLink}/>
                    <RichTextEditorButton icon="image" title="Image" onClick={this.onImage}/>
                </div>
                <RichTextSpoilerDialog show={spoilerDialog} onSubmit={this.onSpoilerSubmit}/>
                <RichTextFoldDialog show={foldDialog} onSubmit={this.onFoldSubmit}/>
                <RichTextLinkDialog show={linkDialog} text={dialogText} onSubmit={this.onLinkSubmit}/>
                <RichTextImageDialog show={imageDialog} onSubmit={this.onImageSubmit}/>
            </div>
        );
    }

}
