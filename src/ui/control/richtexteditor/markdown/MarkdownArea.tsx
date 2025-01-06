import React, { ForwardedRef, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import composeRefs from '@seznam/compose-react-refs';
import { useTranslation } from 'react-i18next';
import isHotkey from 'is-hotkey';

import { CLIENT_SETTINGS_PREFIX, SourceFormat } from "api";
import { ClientState } from "state/state";
import { settingsUpdate } from "state/settings/actions";
import { getSetting } from "state/settings/selectors";
import * as Browser from "ui/browser";
import { TextareaAutosize } from "ui/control";
import MarkdownPasteDialog, { RichTextPasteMode } from "ui/control/richtexteditor/markdown/MarkdownPasteDialog";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { extractUrls, replaceSmileys } from "util/text";
import { containsTags, quoteHtml, safeImportHtml } from "util/html";
import { insertText } from "util/ui";

const MENTION_START = /(^|\s)@$/;

export interface MarkdownAreaProps {
    name: string;
    value?: string;
    format: SourceFormat;
    rows?: number;
    minHeight?: string | null;
    maxHeight?: string | null;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
    autoComplete?: string;
    disabled?: boolean;
    smileysEnabled?: boolean;
    submitKey?: string;
    onSubmit?: () => void;
    onChange?: (event: React.FormEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
    onUrls?: (urls: string[]) => void;
    panel: React.RefObject<HTMLDivElement>;
}

function MarkdownArea(
    {
        name, value, format, className, autoFocus, autoComplete, minHeight, maxHeight, placeholder, rows = 3, disabled,
        smileysEnabled, submitKey, onSubmit, onChange, onBlur, onUrls, panel
    }: MarkdownAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement>
) {
    const pasteRich = useSelector((state: ClientState) => getSetting(state, "rich-text-editor.paste-rich") as string);
    const dispatch = useDispatch();
    const {pasteImage} = useRichTextEditorMedia();

    const textArea = useRef<HTMLTextAreaElement>(null);

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
    }, []);

    const updateUrls = useCallback(() => {
        if (onUrls && textArea.current) {
            onUrls(extractUrls(textArea.current.value));
        }
    }, [onUrls]);

    const updateUrlsTimeout = useRef<number | NodeJS.Timeout | null>(null);

    const delayedUpdateUrls = () => {
        if (updateUrlsTimeout.current != null) {
            clearTimeout(updateUrlsTimeout.current);
        }
        updateUrlsTimeout.current = setTimeout(updateUrls, 1500);
    };

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
    }, [format, updateUrls]);

    const onPaste = useCallback((event: ClipboardEvent) => {
        if (!textArea.current || event.clipboardData == null || format === "plain-text" || pasteRich === "text") {
            return;
        }

        if (pasteImage(event.clipboardData)) {
            return;
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
    }, [format, pasteRich, pasteImage, pasteRichText]);

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
    }, [autoFocus, onInput, onPaste]);

    useEffect(() => {
        if (!disabled && autoFocus && textArea.current) {
            textArea.current.focus();
        }
    }, [disabled, autoFocus]);

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
        if (
            panel.current != null && anyInput.current && value.length >= start
            && MENTION_START.test(value.substring(0, start))
        ) {
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

    const onHotkey = (event: React.KeyboardEvent) => {
        if (!panel.current) {
            return false;
        }
        for (const button of panel.current.querySelectorAll("button[data-hotkey]") as NodeListOf<HTMLButtonElement>) {
            if (isHotkey(button.getAttribute("data-hotkey")!.replace("Ctrl-", "Mod+"))(event)) {
                button.click();
                return true;
            }
        }
        return false;
    }

    const onKeyDownHandler = (event: React.KeyboardEvent) => {
        if (onHotkey(event)) {
            event.preventDefault();
            return;
        }
        if (event.key === "Enter") {
            const submit = !Browser.isTouchScreen() && !event.shiftKey
                && ((submitKey === "enter" && !event.ctrlKey) || (submitKey === "ctrl-enter" && event.ctrlKey));
            if (submit) {
                onSubmit && onSubmit();
            } else {
                insertText(event.target as HTMLTextAreaElement, "\n");
            }
            event.preventDefault();
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
                    minHeight: minHeight ?? (rows != null ? `${Math.ceil(rows * 18) / 10}em` : undefined),
                    maxHeight: maxHeight ?? "calc(100vh - 26rem)"
                }}
                disabled={disabled}
                onKeyDown={onKeyDownHandler}
                onBlur={onBlur}
                onChange={onChangeHandler}
                ref={composeRefs(ref, textArea)}
            />
            {pasteDialogShow && <MarkdownPasteDialog onSubmit={onPasteDialogSubmit}/>}
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

export default forwardRef(MarkdownArea);
