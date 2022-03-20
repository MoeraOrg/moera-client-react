import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';

import { Browser } from "ui/browser";
import RichTextPasteDialog, { RichTextPasteMode } from "ui/control/richtexteditor/RichTextPasteDialog";
import { getSetting } from "state/settings/selectors";
import { settingsUpdate } from "state/settings/actions";
import { ClientState } from "state/state";
import { SourceFormat } from "api/node/api-types";
import { PREFIX } from "api/settings";
import { replaceSmileys } from "util/text";
import { containsTags, htmlToEmoji, quoteHtml, safeImportHtml } from "util/html";
import { insertText } from "util/misc";

const MENTION_START = /(^|\s)@$/;

export interface RichTextAreaProps {
    name: string;
    value?: string;
    format: SourceFormat;
    rows?: number;
    maxRows?: number;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
    autoComplete?: string;
    disabled?: boolean;
    smileysEnabled?: boolean;
    onKeyDown?: (event: React.KeyboardEvent) => void;
    onChange?: (event: React.FormEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
    textArea: React.RefObject<HTMLTextAreaElement>;
    panel: React.RefObject<HTMLDivElement>;
}

type Props = RichTextAreaProps & ConnectedProps<typeof connector>;

interface State {
    pasteDialogShow: boolean;
    pasteText: string | null;
    pasteHtml: string | null;
}

class RichTextArea extends React.PureComponent<Props, State> {

    static defaultProps = {
        rows: 3,
        placeholder: "Enter text here..."
    }

    #spaceInput = false;
    #anyInput = false;

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            pasteDialogShow: false,
            pasteText: null,
            pasteHtml: null
        }
    }

    componentDidMount() {
        const {autoFocus, textArea} = this.props;

        if (textArea.current) {
            textArea.current.addEventListener("input", this.onInput);
            textArea.current.addEventListener("paste", this.onPaste);
            if (autoFocus) {
                textArea.current.focus();
            }
        }
    }

    componentWillUnmount() {
        const {textArea} = this.props;

        if (textArea.current) {
            textArea.current.removeEventListener("input", this.onInput);
            textArea.current.removeEventListener("paste", this.onPaste);
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        const {disabled, autoFocus, textArea} = this.props;

        if (!disabled && prevProps.disabled && autoFocus && textArea.current) {
            textArea.current.focus();
        }
    }

    onChange = (event: React.FormEvent) => {
        const {panel, smileysEnabled, onChange} = this.props;

        const textArea = event.target as HTMLTextAreaElement;
        const value = textArea.value;
        const start = textArea.selectionStart;
        if (smileysEnabled && this.#spaceInput) {
            const newValue = replaceSmileys(value, false);
            if (newValue !== value) {
                textArea.value = newValue;
                textArea.selectionStart = start;
                textArea.selectionEnd = start;
            }
        }
        if (panel.current != null && this.#anyInput && value.length >= start
            && MENTION_START.test(value.substring(0, start))) {

            const button = panel.current.querySelector("button.mention") as HTMLButtonElement;
            if (!button) {
                return false;
            }
            button.click();
        }
        if (onChange) {
            onChange(event);
        }
    }

    onInput = (event: Event) => {
        const inputEvent = event as InputEvent; // FIXME should be in GlobalEventHandlersEventMap["input"]
        this.#anyInput = inputEvent.inputType.startsWith("insert");
        this.#spaceInput = inputEvent.inputType === "insertLineBreak"
            || (this.#anyInput && inputEvent.data != null && inputEvent.data.match(/\s/) != null);
    }

    onKeyDown = (event: React.KeyboardEvent) => {
        const {onKeyDown} = this.props;

        if (this.onControlKey(event)) {
            event.preventDefault();
            return;
        }
        if (onKeyDown) {
            onKeyDown(event);
        }
    }

    onControlKey = (event: React.KeyboardEvent) => {
        const {panel} = this.props;

        if (!panel.current || !event.ctrlKey || event.shiftKey || event.altKey || event.metaKey || !event.code
            || !event.code.startsWith("Key")) {
            return false;
        }
        const button = panel.current.querySelector(`button[data-letter=${event.code.substring(3)}]`) as HTMLButtonElement;
        if (!button) {
            return false;
        }
        button.click();
        return true;
    }

    _shouldPastePlainText(text: string, html: string): boolean {
        if (containsTags(text)) { // Plain text contains tags
            return true;
        }
        const clean = html.replace(/<\/?(p|br)(\s[^>]*)?>/gi, "");
        return !containsTags(clean);
    }

    _shouldPasteHtml(html: string): boolean {
        const clean = html.replace(/<\/?(p|div|span|br)(\s[^>]*)?>/gi, "");
        return !containsTags(htmlToEmoji(clean));
    }

    onPaste = (event: ClipboardEvent) => {
        const {format, pasteRich, textArea} = this.props;

        if (!textArea.current || event.clipboardData == null || format === "plain-text" || pasteRich === "text") {
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

    onPasteDialogSubmit = (mode: RichTextPasteMode, persist: boolean) => {
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

    pasteRichText(mode: RichTextPasteMode, text: string | null, html: string | null) {
        const {format, textArea} = this.props;

        if (textArea.current == null) {
            return;
        }

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

        if (content != null) {
            insertText(textArea.current, content);
            textArea.current.dispatchEvent(new InputEvent("input", {
                data: content,
                inputType: "insertText",
                bubbles: true
            }));
        }
        textArea.current.focus();
    }

    render() {
        const {
            name, value, className, autoComplete, placeholder, rows, maxRows, disabled, onBlur, textArea
        } = this.props;
        const {pasteDialogShow} = this.state;

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
                    maxRows={maxRows ?? (Browser.isTinyScreen() ? 12 : 20)}
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

const connector = connect(
    (state: ClientState) => ({
        pasteRich: getSetting(state, "rich-text-editor.paste-rich") as string
    }),
    { settingsUpdate }
);

export default connector(RichTextArea);
