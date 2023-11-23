import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { useTranslation } from 'react-i18next';

import { CLIENT_SETTINGS_PREFIX, SourceFormat } from "api";
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

export default function RichTextArea({
    name, value, format, className, autoFocus, autoComplete, maxHeight, placeholder, rows = 3, disabled, smileysEnabled,
    onKeyDown, onChange, onBlur, onUrls, textArea, panel, uploadImage
}: RichTextAreaProps) {
    const pasteRich = useSelector((state: ClientState) => getSetting(state, "rich-text-editor.paste-rich") as string);
    const dispatch = useDispatch();

    const sentenceInput = useRef<boolean>(false);
    const spaceInput = useRef<boolean>(false);
    const anyInput = useRef<boolean>(false);
    const anyDelete =  useRef<boolean>(false);

    const [pasteDialogShow, setPasteDialogShow] = useState<boolean>(false);
    const [pasteText, setPasteText] = useState<string | null>(null);
    const [pasteHtml, setPasteHtml] = useState<string | null>(null);

    const {t} = useTranslation();

    const onInput = useCallback((event: Event) => {
        const inputEvent = event as InputEvent; // FIXME should be in GlobalEventHandlersEventMap["input"]
        anyInput.current = inputEvent.inputType.startsWith("insert");
        spaceInput.current = inputEvent.inputType === "insertLineBreak"
            || (anyInput.current && inputEvent.data != null && inputEvent.data.match(/\s/) != null);

        sentenceInput.current = inputEvent.inputType.startsWith("insertFromPaste")
            || inputEvent.inputType === "insertLink"
            || inputEvent.inputType.startsWith("history")
            || spaceInput.current;
        anyDelete.current = inputEvent.inputType.startsWith("delete");
    }, [anyInput, spaceInput, sentenceInput, anyDelete]);

    const updateUrls = useCallback(() => {
        if (onUrls && textArea.current) {
            onUrls(extractUrls(textArea.current.value));
        }
    }, [textArea, onUrls]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const delayedUpdateUrls = useCallback(debounce(updateUrls, 1500), [updateUrls]);

    const pasteRichText = useCallback((mode: RichTextPasteMode, text: string | null, html: string | null) => {
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
            updateUrls();
        }
        textArea.current.focus();
    }, [format, textArea, updateUrls]);

    const onPaste = useCallback((event: ClipboardEvent) => {
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
        if (shouldPastePlainText(text, html)) {
            return;
        }
        event.preventDefault();

        if (pasteRich === "html" || shouldPasteHtml(html)) {
            pasteRichText("html", text, html);
        } else {
            setPasteDialogShow(true);
            setPasteText(text);
            setPasteHtml(html);
        }
    }, [textArea, format, pasteRich, uploadImage, pasteRichText, setPasteDialogShow, setPasteText, setPasteHtml]);

    useEffect(() => {
        if (textArea.current) {
            const theTextArea = textArea.current;
            theTextArea.addEventListener("input", onInput);
            theTextArea.addEventListener("paste", onPaste);
            if (autoFocus) {
                theTextArea.focus();
            }

            return () => {
                theTextArea.removeEventListener("input", onInput);
                theTextArea.removeEventListener("paste", onPaste);
            }
        }
    }, [textArea, autoFocus, onInput, onPaste]);

    useEffect(() => {
        if (!disabled && autoFocus && textArea.current) {
            textArea.current.focus();
        }
    }, [disabled, autoFocus, textArea]);

    const onChangeHandler = (event: React.FormEvent) => {
        const textArea = event.target as HTMLTextAreaElement;
        const start = textArea.selectionStart;
        const value = textArea.value.substring(0, start) + "\u001a" + textArea.value.substring(start);
        if (smileysEnabled && spaceInput.current) {
            const newValue = replaceSmileys(value, false);
            if (newValue !== value) {
                const newStart = newValue.indexOf("\u001a");
                textArea.value = newValue.replace("\u001a", "");
                textArea.selectionStart = newStart;
                textArea.selectionEnd = newStart;
            }
        }
        if (onUrls) {
            if (sentenceInput.current) {
                updateUrls();
            } else if (anyDelete.current) {
                delayedUpdateUrls();
            }
        }
        if (panel.current != null && anyInput.current && value.length >= start
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

    const onControlKey = (event: React.KeyboardEvent) => {
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

    const onKeyDownHandler = (event: React.KeyboardEvent) => {
        if (onControlKey(event)) {
            event.preventDefault();
            return;
        }
        if (onKeyDown) {
            onKeyDown(event);
        }
    }

    const onPasteDialogSubmit = (mode: RichTextPasteMode, persist: boolean) => {
        setPasteDialogShow(false);
        if (persist) {
            dispatch(settingsUpdate([{
                name: CLIENT_SETTINGS_PREFIX + "rich-text-editor.paste-rich",
                value: mode
            }]))
        }
        pasteRichText(mode, pasteText, pasteHtml)
    }

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
                onKeyDown={onKeyDownHandler}
                onBlur={onBlur}
                onChange={onChangeHandler}
                innerRef={textArea} // impossible to pass lambda here
            />
            {pasteDialogShow && <RichTextPasteDialog onSubmit={onPasteDialogSubmit}/>}
        </>
    );
}

function shouldPastePlainText(text: string, html: string): boolean {
    if (containsTags(text, "none")) { // Plain text contains tags
        return true;
    }
    return !containsTags(html, "basic");
}

function shouldPasteHtml(html: string): boolean {
    return !containsTags(safeImportHtml(html), "all");
}
