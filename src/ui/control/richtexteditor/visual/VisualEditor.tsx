import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { BaseOperation, createEditor, Descendant } from 'slate';
import { ReactEditor, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import deepEqual from 'react-fast-compare';

import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { useIsTinyScreen } from "ui/hook";
import VisualEditorCommands from "ui/control/richtexteditor/visual/VisualEditorCommands";
import RichTextEditorPanel, { RichTextEditorPanelMode } from "ui/control/richtexteditor/panel/RichTextEditorPanel";
import RichTextEditorShortPanel from "ui/control/richtexteditor/formatting-menu/RichTextEditorShortPanel";
import VisualTextArea, { VisualTextAreaProps } from "ui/control/richtexteditor/visual/VisualTextArea";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { isLinkElement, Scripture } from "ui/control/richtexteditor/visual/scripture";
import {
    isScriptureEmpty,
    scriptureExtractUrls,
    withScripture
} from "ui/control/richtexteditor/visual/scripture-editor";
import { htmlToScripture } from "ui/control/richtexteditor/visual/scripture-html";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import RichTextEditorDropzone from "ui/control/richtexteditor/media/RichTextEditorDropzone";
import { RelNodeName } from "util/rel-node-name";

export type VisualEditorProps = {
    value: RichTextValue;
    touched: boolean;
    nodeName: RelNodeName | string;
    panelMode?: RichTextEditorPanelMode;
    noComplexBlocks?: boolean | null;
    noEmbeddedMedia?: boolean | null;
    noMedia?: boolean | null;
    noVideo?: boolean | null;
    onChange?: (value: Scripture) => void;
    submitKey?: string;
    onSubmit?: () => void;
    onUrls?: (urls: string[]) => void;
    children?: ReactNode;
} & VisualTextAreaProps;

export default function VisualEditor({
    name, value, touched, nodeName, rows, minHeight, maxHeight, placeholder, autoFocus, disabled, smileysEnabled,
    commentQuote, panelMode = "float", noComplexBlocks, noEmbeddedMedia, noMedia, noVideo, onChange, submitKey,
    onSubmit, onUrls, onBlur, children
}: VisualEditorProps) {
    const removeTracking = useSelector((state: ClientState) =>
        getSetting(state, "rich-text-editor.links.remove-tracking") as boolean
    );
    const {pasteImage} = useRichTextEditorMedia();
    const pasteImageRef = useRef(pasteImage);
    pasteImageRef.current = pasteImage;
    const [editor] = useState(
        () => withScripture(
            withHistory(withReact(createEditor(), "x-scripture-fragment")),
            pasteImageRef,
            {removeTracking}
        )
    );

    useEffect(() => {
        if (!disabled && autoFocus) {
            ReactEditor.focus(editor);
            if (editor.selection == null && editor.children != null) {
                editor.select(editor.start([]));
            }
        }
    }, [disabled, autoFocus, editor]);

    useEffect(() => {
        if (value.scripture != null && !touched && !deepEqual(value.scripture, editor.children)) {
            editor.deselect();
            editor.children = value.scripture;
            setTimeout(() => {
                editor.select(editor.start([]));
                editor.collapse({edge: "start"});
            });
            editor.onChange();
        }
    }, [editor, touched, value]);


    const updateUrls = useCallback(() => {
        onUrls && onUrls(scriptureExtractUrls(editor.children as Scripture));
    }, [editor.children, onUrls]);

    const updateUrlsTimeout = useRef<number | NodeJS.Timeout | null>(null);

    const delayedUpdateUrls = useCallback(() => {
        if (updateUrlsTimeout.current != null) {
            clearTimeout(updateUrlsTimeout.current);
        }
        updateUrlsTimeout.current = setTimeout(updateUrls, 1500);
    }, [updateUrls]);

    const scriptureChangeTimeout = useRef<number | NodeJS.Timeout | null>(null);

    const onEditorChange = useCallback((operation: BaseOperation) => {
        switch (operation.type) {
            case "remove_node":
            case "remove_text":
                delayedUpdateUrls();
                break;
            case "insert_node":
                if (isLinkElement(operation.node)) {
                    setTimeout(() => updateUrls());
                }
                break;
            case "set_node":
                if (isLinkElement(operation.properties)) {
                    setTimeout(() => updateUrls());
                }
                break;
            case "set_selection":
                return; // do not call onChange()
        }

        // A dirty hack to work around the issue when onScriptureChange is not called on Android after some changes
        // (for example, removal of the whole content)
        scriptureChangeTimeout.current = setTimeout(() => {
            if (onChange != null) {
                onChange(editor.children as Scripture);
            }
        }, 200);
    }, [delayedUpdateUrls, editor.children, onChange, updateUrls]);

    useEffect(() => {
        editor.addChangeListener(onEditorChange);
        return () => editor.removeChangeListener(onEditorChange);
    }, [editor, onEditorChange]);

    // useCallback() is mandatory here
    const onScriptureChange = useCallback((content: Scripture) => {
        if (scriptureChangeTimeout.current != null) {
            clearTimeout(scriptureChangeTimeout.current);
        }
        if (onChange != null) {
            onChange(content);
        }
    }, [onChange]);

    const tinyScreen = useIsTinyScreen();
    const topPanel = panelMode === "float" && !tinyScreen;

    return (
        <Slate
            editor={editor}
            initialValue={htmlToScripture("")}
            onValueChange={onScriptureChange as ((contents: Descendant[]) => void) | undefined}
        >
            <VisualEditorCommands
                noComplexBlocks={noComplexBlocks}
                noEmbeddedMedia={noEmbeddedMedia}
                noMedia={noMedia}
                noVideo={noVideo}
            >
                {topPanel &&
                    <RichTextEditorPanel/>
                }
                <VisualTextArea
                    name={name}
                    rows={rows}
                    minHeight={minHeight}
                    maxHeight={maxHeight}
                    placeholder={isScriptureEmpty(editor.children) ? placeholder : undefined}
                    disabled={disabled}
                    smileysEnabled={smileysEnabled}
                    commentQuote={commentQuote}
                    autoFocus={autoFocus}
                    submitKey={submitKey}
                    onSubmit={onSubmit}
                    onBlur={onBlur}
                />
                {!topPanel && panelMode !== "none" ?
                    <RichTextEditorShortPanel children={children}/>
                :
                    children
                }
                {!noMedia &&
                    <RichTextEditorDropzone value={value} hiding={panelMode === "none"} nodeName={nodeName}
                                            noEmbeddedMedia={noEmbeddedMedia}/>
                }
            </VisualEditorCommands>
        </Slate>
    );
}
