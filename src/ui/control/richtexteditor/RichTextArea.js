import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';
import * as textFieldEdit from 'text-field-edit';

import { Browser } from "ui/browser";
import { replaceSmileys } from "util/text";
import { quoteHtml, safeImportHtml } from "util/html";
import RichTextPasteDialog from "ui/control/richtexteditor/RichTextPasteDialog";
import { getSetting } from "state/settings/selectors";
import { PREFIX } from "api/settings";
import { settingsUpdate } from "state/settings/actions";

const MENTION_START = RegExp(/(^|\s)@$/);

class RichTextArea extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        value: PropType.string,
        format: PropType.string,
        rows: PropType.number,
        placeholder: PropType.string,
        className: PropType.string,
        autoFocus: PropType.bool,
        autoComplete: PropType.string,
        disabled: PropType.bool,
        smileysEnabled: PropType.bool,
        onKeyDown: PropType.func,
        onChange: PropType.func,
        onBlur: PropType.func,
        textArea: PropType.object,
        panel: PropType.object
    };

    static defaultProps = {
        rows: 3,
        placeholder: "Enter text here..."
    }

    #spaceInput = false;
    #anyInput = false;

    constructor(props, context) {
        super(props, context);

        this.state = {
            textArea: props.textArea ?? React.createRef(),
            pasteDialogShow: false,
            pasteText: null,
            pasteHtml: null
        }
    }

    componentDidMount() {
        const {autoFocus} = this.props;
        const {textArea} = this.state;

        if (textArea.current) {
            textArea.current.addEventListener("input", this.onInput);
            textArea.current.addEventListener("paste", this.onPaste);
            if (autoFocus) {
                textArea.current.focus();
            }
        }
    }

    componentWillUnmount() {
        const {textArea} = this.state;

        if (textArea.current) {
            textArea.current.removeEventListener("input", this.onInput);
            textArea.current.removeEventListener("paste", this.onPaste);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {disabled, autoFocus} = this.props;

        if (!disabled && prevProps.disabled && autoFocus && this.state.textArea.current) {
            this.state.textArea.current.focus();
        }
        if (this.props.textArea !== prevProps.textArea) {
            this.props.textArea.current = this.state.textArea.current;
            this.setState({textArea: this.props.textArea});
        }
    }

    onChange = event => {
        const {panel, smileysEnabled, onChange} = this.props;

        const value = event.target.value;
        const start = event.target.selectionStart;
        if (smileysEnabled && this.#spaceInput) {
            event.target.value = replaceSmileys(value, false);
        }
        if (this.#anyInput && value.length >= start && MENTION_START.test(value.substring(0, start))) {
            const button = panel.current.querySelector("button.mention");
            if (!button) {
                return false;
            }
            button.click();
        }
        if (onChange) {
            onChange(event);
        }
    }

    onInput = event => {
        this.#anyInput = event.inputType.startsWith("insert");
        this.#spaceInput = event.inputType === "insertLineBreak"
            || (this.#anyInput && event.data != null && event.data.match(/\s/));
    }

    onKeyDown = event => {
        const {onKeyDown} = this.props;

        if (this.onControlKey(event)) {
            event.preventDefault();
            return;
        }
        if (onKeyDown) {
            onKeyDown(event);
        }
    }

    onControlKey = event => {
        const {panel} = this.props;

        if (!panel.current || !event.ctrlKey || event.shiftKey || event.altKey || event.metaKey || !event.code
            || !event.code.startsWith("Key")) {
            return false;
        }
        const button = panel.current.querySelector(`button[data-letter=${event.code.substring(3)}]`);
        if (!button) {
            return false;
        }
        button.click();
        return true;
    }

    _shouldPastePlainText(text, html) {
        if (text.search(/<[a-zA-z][^\n]*>/) >= 0) {
            return true;
        }
        const clean = html.replace(/<\/?(p|br)(\s[^>]*)?>/gi, "");
        if (clean.search(/<[a-zA-z][^\n]*>/) < 0) {
            return true;
        }
        return false;
    }

    _shouldPasteHtml(html) {
        const clean = html.replace(/<\/?(p|div|span|br)(\s[^>]*)?>/gi, "");
        if (clean.search(/<[a-zA-z][^\n]*>/) < 0) {
            return true;
        }
        return false;
    }

    onPaste = event => {
        const {format, pasteRich} = this.props;
        const {textArea} = this.state;

        if (!textArea.current || format === "plain-text" || pasteRich === "text") {
            return;
        }
        let html = event.clipboardData.getData("text/html");
        if (!html) {
            return;
        }
        const text = event.clipboardData.getData("text/plain");
        if (this._shouldPastePlainText(text, html)) {
            return;
        }
        event.preventDefault();

        if (pasteRich === "html" || this._shouldPasteHtml(html)) {
            this.pasteRichText("html", text, html);
        } else {
            this.setState({pasteDialogShow: true, pasteText: text, pasteHtml: html});
        }
    }

    onPasteDialogSubmit = (mode, persist) => {
        const {settingsUpdate} = this.props;
        const {pasteText, pasteHtml} = this.state;

        this.setState({pasteDialogShow: false});
        if (persist) {
            settingsUpdate([{
                name: PREFIX + "rich-text-editor.paste-rich",
                value: mode
            }])
        }
        this.pasteRichText(mode, pasteText, pasteHtml)
    }

    pasteRichText(mode, text, html) {
        const {format} = this.props;
        const {textArea} = this.state;

        if (mode === "none") {
            textArea.current.focus();
            return;
        }

        let content;
        if (mode === "html") {
            content = safeImportHtml(html);
            if (format === "markdown") {
                content = quoteHtml(content);
            }
        } else {
            content = text;
        }

        textFieldEdit.insert(textArea.current, content);
        textArea.current.dispatchEvent(new InputEvent("input", {
            data: content,
            inputType: "insertText",
            bubbles: true
        }));
        textArea.current.focus();
    }

    render() {
        const {name, value, className, autoComplete, placeholder, rows, disabled, onBlur} = this.props;
        const {textArea, pasteDialogShow} = this.state;

        return (
            <>
                <TextareaAutosize
                    name={name}
                    value={value}
                    id={name}
                    className={className}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    rows={rows}
                    maxRows={Browser.isTinyScreen() ? 15 : 20}
                    disabled={disabled}
                    onKeyDown={this.onKeyDown}
                    onBlur={onBlur}
                    onChange={this.onChange}
                    ref={textArea} // impossible to pass lambda here
                />
                <RichTextPasteDialog show={pasteDialogShow} onSubmit={this.onPasteDialogSubmit}/>
            </>
        );
    }

}

export default connect(
    state => ({
        pasteRich: getSetting(state, "rich-text-editor.paste-rich")
    }),
    { settingsUpdate }
)(RichTextArea);
