import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import debounce from 'lodash.debounce';
import { WithTranslation, withTranslation } from 'react-i18next';

import { SourceFormat } from "api/node/api-types";
import { PREFIX } from "api/settings";
import { ClientState } from "state/state";
import { settingsUpdate } from "state/settings/actions";
import { getSetting } from "state/settings/selectors";
import { TextareaAutosize } from "ui/control";
import RichTextPasteDialog, { RichTextPasteMode } from "ui/control/richtexteditor/RichTextPasteDialog";
import { extractUrls, replaceSmileys } from "util/text";
import { containsTags, quoteHtml, safeImportHtml } from "util/html";
import { insertText } from "util/misc";

const MENTION_START = /(^|\s)@$/;

export interface RichTextAreaProps {
    name: string;
    value?: string;
    format: SourceFormat;
    rows?: number;
    maxHeight?: string | null;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
    autoComplete?: string;
    disabled?: boolean;
    smileysEnabled?: boolean;
    onKeyDown?: (event: React.KeyboardEvent) => void;
    onChange?: (event: React.FormEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
    onUrls?: (urls: string[]) => void;
    textArea: React.RefObject<HTMLTextAreaElement>;
    panel: React.RefObject<HTMLDivElement>;
    uploadImage?: (image: File) => void;
}

type Props = RichTextAreaProps & ConnectedProps<typeof connector> & WithTranslation;

interface State {
    pasteDialogShow: boolean;
    pasteText: string | null;
    pasteHtml: string | null;
}

class RichTextArea extends React.PureComponent<Props, State> {

    static defaultProps = {
        rows: 3
    }

    #sentenceInput = false;
    #spaceInput = false;
    #anyInput = false;
    #anyDelete = false;

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
        const {panel, smileysEnabled, onChange, onUrls} = this.props;

        const textArea = event.target as HTMLTextAreaElement;
        const start = textArea.selectionStart;
        const value = textArea.value.substring(0, start) + "\u001a" + textArea.value.substring(start);
        if (smileysEnabled && this.#spaceInput) {
            const newValue = replaceSmileys(value, false);
            if (newValue !== value) {
                const newStart = newValue.indexOf("\u001a");
                textArea.value = newValue.replace("\u001a", "");
                textArea.selectionStart = newStart;
                textArea.selectionEnd = newStart;
            }
        }
        if (onUrls) {
            if (this.#sentenceInput) {
                this.updateUrls(textArea);
            } else if (this.#anyDelete) {
                this.delayedUpdateUrls(textArea);
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

    delayedUpdateUrls = debounce((textArea: HTMLTextAreaElement) => this.updateUrls(textArea), 1500);

    updateUrls(textArea: HTMLTextAreaElement) {
        const {onUrls} = this.props;

        if (onUrls) {
            onUrls(extractUrls(textArea.value));
        }
    }

    onInput = (event: Event) => {
        const inputEvent = event as InputEvent; // FIXME should be in GlobalEventHandlersEventMap["input"]
        this.#anyInput = inputEvent.inputType.startsWith("insert");
        this.#spaceInput = inputEvent.inputType === "insertLineBreak"
            || (this.#anyInput && inputEvent.data != null && inputEvent.data.match(/\s/) != null);
        this.#sentenceInput = inputEvent.inputType.startsWith("insertFromPaste")
            || inputEvent.inputType.startsWith("history") || this.#spaceInput;
        this.#anyDelete = inputEvent.inputType.startsWith("delete");
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
        if (containsTags(text, "none")) { // Plain text contains tags
            return true;
        }
        return !containsTags(html, "basic");
    }

    _shouldPasteHtml(html: string): boolean {
        return !containsTags(safeImportHtml(html), "all");
    }

    onPaste = (event: ClipboardEvent) => {
        const {format, pasteRich, textArea, uploadImage} = this.props;

        if (!textArea.current || event.clipboardData == null || format === "plain-text" || pasteRich === "text") {
            return;
        }

        if (uploadImage) {
            // clipboardData.items is array-like, not a real array, thus weird calling convention
            const imageItem: DataTransferItem = Array.prototype.find.call(
                event.clipboardData.items,
                ({kind, type}: DataTransferItem) => kind === 'file' && type.startsWith('image/')
            );

            if (imageItem) {
                const imageFile = imageItem.getAsFile();
                if (imageFile) {
                    uploadImage(imageFile);
                }
                return;
            }
        }

        const html = event.clipboardData.getData("text/html");
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

        let content: string | null;
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
            this.updateUrls(textArea.current);
        }
        textArea.current.focus();
    }

    render() {
        const {
            name, value, className, autoComplete, maxHeight, placeholder, rows, disabled, onBlur, textArea, t
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
                    placeholder={placeholder ?? t("enter-text-here")}
                    rows={rows}
                    style={{
                        minHeight: rows != null ? `${Math.ceil(rows * 1.5)}em` : undefined,
                        maxHeight: maxHeight ?? "calc(100vh - 26rem)"
                    }}
                    disabled={disabled}
                    onKeyDown={this.onKeyDown}
                    onBlur={onBlur}
                    onChange={this.onChange}
                    innerRef={textArea} // impossible to pass lambda here
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

export default withTranslation()(connector(RichTextArea));
