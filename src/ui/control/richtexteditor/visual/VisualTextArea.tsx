import React, { useCallback, useEffect, useRef, useState } from 'react';
import deepEqual from 'react-fast-compare';
import Delta from 'quill-delta';
import Toolbar from 'quill/modules/toolbar';

import * as Browser from "ui/browser";
import Quill, { QuillOptions, Range } from "ui/control/richtexteditor/visual/quill";
import AddReactionIcon from "ui/control/richtexteditor/visual/icons/add_reaction.isvg";
import useSpoilerTooltip, { SpoilerEditCallback } from "ui/control/richtexteditor/visual/SpoilerTooltip";
import RichTextSpoilerDialog, { RichTextSpoilerValues } from "ui/control/richtexteditor/RichTextSpoilerDialog";
import RichTextMentionDialog from "ui/control/richtexteditor/RichTextMentionDialog";
import useLinkTooltip, { LinkEditCallback } from "ui/control/richtexteditor/visual/icons/LinkTooltip";
import RichTextLinkDialog, { RichTextLinkValues } from "ui/control/richtexteditor/RichTextLinkDialog";
import { NameListItem } from "util/names-list";
import { mentionName } from "util/names";
import { deltaReplaceSmileys } from "util/text";
import { deltaEmpty, deltaExtractUrls, deltaFindInsert } from "util/delta";
import "./VisualTextArea.css";

interface Props {
    value?: Delta;
    autoFocus?: boolean;
    disabled?: boolean;
    onChange?: (contents: Delta) => void;
    onUrls?: (urls: string[]) => void;
}

export function VisualTextArea({value, autoFocus, disabled, onChange, onUrls}: Props) {
    const [spoilerDialog, setSpoilerDialog] = useState<boolean>(false);
    const [mentionDialog, setMentionDialog] = useState<boolean>(false);
    const [linkDialog, setLinkDialog] = useState<boolean>(false);
    const [dialogSelection, setDialogSelection] = useState<Range>(new Range(0));
    const [dialogValue, setDialogValue] = useState<string>("");

    const onSpoiler = useCallback<SpoilerEditCallback>((selection, title) => {
        if (spoilerDialog) {
            return;
        }
        if (selection.length > 0) {
            setDialogSelection(selection);
            setDialogValue(title);
            setSpoilerDialog(true);
        }
    }, [spoilerDialog]);

    const onMention = useCallback(
        () => mentionDialog || setMentionDialog(true),
        [mentionDialog]
    );

    const onLink = useCallback<LinkEditCallback>((selection, href) => {
        if (linkDialog) {
            return;
        }
        if (selection.length > 0) {
            setDialogSelection(selection);
            setDialogValue(href);
            setLinkDialog(true);
        }
    }, [linkDialog]);

    const quillOptions = useRef<QuillOptions>({
        modules: {
            toolbar: {
                container: [
                    [{"header": [false, 1, 2, 3, 4, 5]}],
                    ["bold", "italic", "strike", "spoiler"],
                    [{list: "ordered"}, {list: "bullet"}, {indent: "+1"}, {indent: "-1"}],
                    ["blockquote", "blockquote-off", "horizontal-rule"],
                    ["emoji", "mention"],
                    ["image", "link"],
                    ["clean"],
                ],
                handlers: {
                    spoiler: function (this: Toolbar): void {
                        onSpoiler(this.quill.getSelection(true), "");
                    },

                    blockquote: function (this: Toolbar): void {
                        const level = parseInt((this.quill.getFormat()?.["quote-level"] as string | undefined) ?? "0");
                        this.quill.format("blockquote", String(level + 1));
                        this.quill.focus();
                    },

                    "blockquote-off": function (this: Toolbar): void {
                        const level = parseInt((this.quill.getFormat()?.["quote-level"] as string | undefined) ?? "0");
                        if (level > 1) {
                            this.quill.format("blockquote", String(level - 1));
                        } else if (level === 1) {
                            this.quill.format("blockquote", false);
                        }
                        this.quill.focus();
                    },

                    "horizontal-rule": function (this: Toolbar): void {
                        const selection = this.quill.getSelection(true);
                        this.quill.insertEmbed(selection.index, "horizontal-rule", true, "user");
                        selection.index++;
                        this.quill.setSelection(selection);
                    },

                    emoji: () => {},

                    mention: onMention,

                    link: function (this: Toolbar): void {
                        onLink(this.quill.getSelection(true), "");
                    },
                }
            },
            magicUrl: true,
            emoji: true,
        },
        readOnly: disabled,
        theme: "snow-extended",
    });

    const [quillElement, setQuillElement] = useState<HTMLDivElement | null>(null);

    const [quill, setQuill] = useState<Quill | null>(null);

    useEffect(() => {
        if (quillElement != null) {
            setQuill(new Quill(quillElement, quillOptions.current));
            quillElement.parentElement?.querySelectorAll(".ql-emoji").forEach(button => {
                if (Browser.isMobile()) {
                    button.classList.add("d-none");
                } else {
                    button.innerHTML = AddReactionIcon;
                }
            });
        }
    }, [quillElement]);

    useEffect(() => quill?.enable(disabled !== true), [disabled, quill]);

    useEffect(() => {
        if (!disabled && autoFocus && quill != null) {
            quill.focus();
        }
    }, [disabled, autoFocus, quill]);

    useEffect(() => {
        if (quill != null && value != null && !deepEqual(value, quill.getContents())) {
            const range = quill.getSelection(false);
            quill.setContents(value, "silent");
            quill.setSelection(range, "silent");
        }
    }, [quill, value]);

    useEffect(() => {
        if (quill != null && onChange != null) {
            const handler = () => onChange(quill.getContents());
            quill.on("text-change", handler);
            return () => {
                quill.off("text-change", handler);
            }
        }
    }, [onChange, quill]);

    useEffect(() => {
        if (quillElement != null) {
            showButtons(quillElement, ".ql-indent", false);
            showButtons(quillElement, ".ql-blockquote-off", false);
        }
    }, [quillElement]);

    const onEditorChange = useCallback((...args: any[]) => {
        if (quill != null && quillElement != null) {
            const range: Range = args[0] === "selection-change" ? args[1] : quill.getSelection();
            const formats: Record<string, any> = range?.index != null ? quill.getFormat(range) : [];

            showButtons(quillElement, ".ql-indent", !!formats["list"]);
            showButtons(quillElement, ".ql-blockquote-off", !!formats["blockquote"] || !!formats["quote-level"]);
        }
    }, [quill, quillElement]);

    useEffect(() => {
        if (quill != null) {
            quill.on("editor-change", onEditorChange);
            return () => {
                quill.off("editor-change", onEditorChange)
            }
        }
    }, [onEditorChange, quill]);

    const onSpoilerSubmit = (ok: boolean, {title}: RichTextSpoilerValues) => {
        setSpoilerDialog(false);

        if (quill == null || !ok) {
            return;
        }

        quill.formatText(dialogSelection.index, dialogSelection.length, "spoiler", title || "spoiler!", "user");
        quill.focus();
    };

    useSpoilerTooltip(quill, onSpoiler);

    const onMentionSubmit = (ok: boolean, {nodeName, fullName}: NameListItem) => {
        setMentionDialog(false);

        if (quill == null) {
            return;
        }

        if (!ok && !nodeName) {
            quill.focus();
            return;
        }

        let {index, length} = quill.getSelection(true) ?? {index: 0, length: 0};
        let delta = new Delta();
        if (index > 0 && quill.getText(index - 1, 1) === "@") {
            index--;
            delta = delta.retain(index).delete(1);
        } else {
            delta = delta.retain(index);
        }
        const text = fullName || mentionName(nodeName);
        delta = ok ? delta.insert(text, {mention: nodeName}).insert(" ") : delta.insert(text);
        quill.updateContents(delta, "user");
        quill.setSelection(index + text.length + (ok ? 1 : 0), length);
    }

    const onTextEntered = useCallback((...args: any[]) => {
        if (quill != null && quillElement != null && args[0] === "text-change" && args[3] === "user") {
            const mentionIndex = deltaFindInsert(args[1], s => s.endsWith("@"));
            if (mentionIndex != null && (mentionIndex === 0 || /^\s$/.test(quill.getText(mentionIndex - 1, 1)))) {
                onMention();
            }

            const spaceIndex = deltaFindInsert(args[1], s => /\s$/.test(s));
            if (spaceIndex != null) {
                const delta = deltaReplaceSmileys(quill.getContents(), false);
                if (!deltaEmpty(delta)) {
                    quill.updateContents(delta, "api");
                }
            }
        }
    }, [onMention, quill, quillElement]);

    useEffect(() => {
        if (quill != null) {
            quill.on("editor-change", onTextEntered);
            return () => {
                quill.off("editor-change", onTextEntered)
            }
        }
    }, [onTextEntered, quill]);

    const onLinkSubmit = (ok: boolean, {href}: RichTextLinkValues) => {
        setLinkDialog(false);

        if (quill == null) {
            return;
        }

        if (ok && href) {
            const selection = quill.getSelection(true);
            if (selection.length > 0) {
                quill.format("link", href, "user");
            } else {
                quill.insertText(selection.index, href, {link: href}, "user");
            }
        }
        quill.focus();
    }

    useLinkTooltip(quill, onLink);

    const updateUrls = useCallback((...args: any[]) => {
        if (!onUrls || quill == null || args[0] !== "text-change") {
            return;
        }
        for (const op of (args[1] as Delta).ops) {
            if (op.delete || ((op.insert || op.retain) && op.attributes?.hasOwnProperty("link"))) {
                onUrls(deltaExtractUrls(quill.getContents()));
                return;
            }
        }
    }, [onUrls, quill]);

    useEffect(() => {
        if (quill != null) {
            quill.on("editor-change", updateUrls);
            return () => {
                quill.off("editor-change", updateUrls)
            }
        }
    }, [updateUrls, quill]);

    return (
        <div>
            <div ref={setQuillElement}/>
            {spoilerDialog && <RichTextSpoilerDialog title={dialogValue} onSubmit={onSpoilerSubmit}/>}
            {mentionDialog && <RichTextMentionDialog onSubmit={onMentionSubmit}/>}
            {linkDialog && <RichTextLinkDialog href={dialogValue} onSubmit={onLinkSubmit}/>}
        </div>
    );
}

function showButtons(quillElement: HTMLDivElement, selector: string, visible: boolean): void {
    if (quillElement.parentElement != null) {
        const buttons = quillElement.parentElement.querySelectorAll(selector);
        if (visible) {
            buttons.forEach(button => button.classList.remove("d-none"));
        } else {
            buttons.forEach(button => button.classList.add("d-none"));
        }
    }
}
