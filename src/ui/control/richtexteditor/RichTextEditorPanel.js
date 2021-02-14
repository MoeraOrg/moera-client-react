import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import * as textFieldEdit from 'text-field-edit';
import cx from 'classnames';

import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";
import RichTextSpoilerDialog from "ui/control/richtexteditor/RichTextSpoilerDialog";
import RichTextFoldDialog from "ui/control/richtexteditor/RichTextFoldDialog";
import RichTextLinkDialog from "ui/control/richtexteditor/RichTextLinkDialog";
import RichTextImageDialog from "ui/control/richtexteditor/RichTextImageDialog";
import RichTextMentionDialog from "ui/control/richtexteditor/RichTextMentionDialog";
import { getNodeRootPage } from "state/node/selectors";
import { htmlEntities } from "util/html";
import { mentionName } from "util/misc";
import { urlWithParameters } from "util/url";
import { NodeName } from "api";
import "./RichTextEditorPanel.css";

class RichTextEditorPanel extends React.PureComponent {

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
        mentionDialog: false,
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

    onMention = event => {
        this.setState({mentionDialog: true});
        event.preventDefault();
    }

    onMentionSubmit = (ok, {nodeName, fullName}) => {
        const {textArea, nodeRootPage} = this.props;

        this.setState({mentionDialog: false});

        const value = textArea.current.value;
        const start = textArea.current.selectionStart;
        if (value.length >= start && value[start - 1] === "@") {
            textArea.current.selectionStart = start - 1;
        }

        if (ok) {
            if (this.isMarkdown()) {
                textFieldEdit.insert(textArea.current, mentionName(nodeName, fullName))
            } else {
                const text = fullName ?? NodeName.shorten(nodeName);
                const href = urlWithParameters(nodeRootPage + "/gotoname",
                    {name: nodeName, location: "/"});
                textFieldEdit.insert(textArea.current,
                    `<a href="${htmlEntities(href)}" data-nodename="${htmlEntities(nodeName)}" data-href="/">`
                    + `${htmlEntities(text)}</a>`);
            }
        } else {
            textFieldEdit.insert(textArea.current, nodeName ? mentionName(nodeName) : "@")
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

    onImageSubmit = (ok, {href, title, alt}) => {
        const {textArea} = this.props;

        this.setState({imageDialog: false});
        if (ok) {
            if (this.isMarkdown()) {
                const titleAttr = title ? ` "${title}"`: "";
                const altAttr = alt ?? "";
                if (href) {
                    textFieldEdit.insert(textArea.current, `![${altAttr}](${href}${titleAttr})`);
                } else {
                    textFieldEdit.wrapSelection(textArea.current, `![${altAttr}](`, `${titleAttr})`);
                }
            } else {
                const titleAttr = title ? ` title="${htmlEntities(title)}"` : "";
                const altAttr = alt ? ` alt="${htmlEntities(alt)}"` : "";
                if (href) {
                    textFieldEdit.insert(textArea.current,
                        `<img${altAttr}${titleAttr} src="${htmlEntities(href)}">`);
                } else {
                    textFieldEdit.wrapSelection(textArea.current,
                        `<img${altAttr}${titleAttr} src="`, "\">");
                }
            }
        }
        textArea.current.focus();
    }

    render() {
        const {hiding, format} = this.props;
        const {spoilerDialog, foldDialog, linkDialog, imageDialog, mentionDialog, dialogText, panel} = this.state;

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
                <RichTextImageDialog show={imageDialog} onSubmit={this.onImageSubmit}/>
                <RichTextMentionDialog show={mentionDialog} onSubmit={this.onMentionSubmit}/>
            </div>
        );
    }

}

export default connect(
    state => ({
        nodeRootPage: getNodeRootPage(state)
    })
)(RichTextEditorPanel);
