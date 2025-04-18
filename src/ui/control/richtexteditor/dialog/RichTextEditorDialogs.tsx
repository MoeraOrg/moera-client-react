import React, { ReactNode, useState } from 'react';

import { RichTextEditorDialogsContext } from "ui/control/richtexteditor/dialog/rich-text-editor-dialogs-context";
import RichTextSpoilerDialog, { RichTextSpoilerValues } from "ui/control/richtexteditor/dialog/RichTextSpoilerDialog";
import RichTextFoldDialog, { RichTextFoldValues } from "ui/control/richtexteditor/dialog/RichTextFoldDialog";
import RichTextLinkDialog, { RichTextLinkValues } from "ui/control/richtexteditor/dialog/RichTextLinkDialog";
import RichTextMentionDialog from "ui/control/richtexteditor/dialog/RichTextMentionDialog";
import RichTextVideoDialog, { RichTextVideoValues } from "ui/control/richtexteditor/dialog/RichTextVideoDialog";
import RichTextFormulaDialog, { RichTextFormulaValues } from "ui/control/richtexteditor/dialog/RichTextFormulaDialog";
import { RichTextEditorDialogSubmit } from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";
import { NameListItem } from "util/names-list";

interface Props {
    children: ReactNode;
}

export default function RichTextEditorDialogs({children}: Props) {
    const [spoilerDialog, setSpoilerDialog] = useState<boolean>(false);
    const [spoilerDialogPrevValues, setSpoilerDialogPrevValues] = useState<RichTextSpoilerValues | null>(null);
    const [spoilerDialogOnSubmit, setSpoilerDialogOnSubmit] =
        useState<RichTextEditorDialogSubmit<RichTextSpoilerValues>>(() => () => {});

    const [foldDialog, setFoldDialog] = useState<boolean>(false);
    const [foldDialogPrevValues, setFoldDialogPrevValues] = useState<RichTextFoldValues | null>(null);
    const [foldDialogOnSubmit, setFoldDialogOnSubmit] =
        useState<RichTextEditorDialogSubmit<RichTextFoldValues>>(() => () => {});

    const [linkDialog, setLinkDialog] = useState<boolean>(false);
    const [linkDialogNoText, setLinkDialogNoText] = useState<boolean | undefined>(undefined);
    const [linkDialogPrevValues, setLinkDialogPrevValues] = useState<RichTextLinkValues | null>(null);
    const [linkDialogOnSubmit, setLinkDialogOnSubmit] =
        useState<RichTextEditorDialogSubmit<RichTextLinkValues>>(() => () => {});

    const [mentionDialog, setMentionDialog] = useState<boolean>(false);
    const [mentionDialogOnSubmit, setMentionDialogOnSubmit] =
        useState<RichTextEditorDialogSubmit<NameListItem>>(() => () => {});

    const [videoDialog, setVideoDialog] = useState<boolean>(false);
    const [videoDialogOnSubmit, setVideoDialogOnSubmit] =
        useState<RichTextEditorDialogSubmit<RichTextVideoValues>>(() => () => {});

    const [formulaDialog, setFormulaDialog] = useState<boolean>(false);
    const [formulaDialogPrevValues, setFormulaDialogPrevValues] = useState<RichTextFormulaValues | null>(null);
    const [formulaDialogOnSubmit, setFormulaDialogOnSubmit] =
        useState<RichTextEditorDialogSubmit<RichTextFormulaValues>>(() => () => {});

    const showSpoilerDialog = (
        show: boolean, prevValues?: RichTextSpoilerValues | null,
        onSubmit?: RichTextEditorDialogSubmit<RichTextSpoilerValues>
    ) => {
        if (show) {
            setSpoilerDialogPrevValues(prevValues ?? null);
            onSubmit && setSpoilerDialogOnSubmit(() => onSubmit);
            setSpoilerDialog(true);
        } else {
            setSpoilerDialog(false);
        }
    }

    const showFoldDialog = (
        show: boolean, prevValues?: RichTextFoldValues | null, onSubmit?: RichTextEditorDialogSubmit<RichTextFoldValues>
    ) => {
        if (show) {
            setFoldDialogPrevValues(prevValues ?? null);
            onSubmit && setFoldDialogOnSubmit(() => onSubmit);
            setFoldDialog(true);
        } else {
            setFoldDialog(false);
        }
    }

    const showLinkDialog = (
        show: boolean, noText?: boolean, prevValues?: RichTextLinkValues | null,
        onSubmit?: RichTextEditorDialogSubmit<RichTextLinkValues>
    ) => {
        if (show) {
            setLinkDialogNoText(noText);
            setLinkDialogPrevValues(prevValues ?? null);
            onSubmit && setLinkDialogOnSubmit(() => onSubmit);
            setLinkDialog(true);
        } else {
            setLinkDialog(false);
        }
    }

    const showMentionDialog = (show: boolean, onSubmit?: RichTextEditorDialogSubmit<NameListItem>) => {
        if (show) {
            onSubmit && setMentionDialogOnSubmit(() => onSubmit);
            setMentionDialog(true);
        } else {
            setMentionDialog(false);
        }
    }

    const showVideoDialog = (show: boolean, onSubmit?: RichTextEditorDialogSubmit<RichTextVideoValues>) => {
        if (show) {
            onSubmit && setVideoDialogOnSubmit(() => onSubmit);
            setVideoDialog(true);
        } else {
            setVideoDialog(false);
        }
    }

    const showFormulaDialog = (
        show: boolean, prevValues?: RichTextFormulaValues | null,
        onSubmit?: RichTextEditorDialogSubmit<RichTextFormulaValues>
    ) => {
        if (show) {
            setFormulaDialogPrevValues(prevValues ?? null);
            onSubmit && setFormulaDialogOnSubmit(() => onSubmit);
            setFormulaDialog(true);
        } else {
            setFormulaDialog(false);
        }
    }

    return (
        <>
            <RichTextEditorDialogsContext.Provider value={{
                showSpoilerDialog, showFoldDialog, showLinkDialog, showMentionDialog, showVideoDialog,
                showFormulaDialog
            }}>
                {children}
            </RichTextEditorDialogsContext.Provider>
            {spoilerDialog &&
                <RichTextSpoilerDialog prevValues={spoilerDialogPrevValues} onSubmit={spoilerDialogOnSubmit}/>
            }
            {foldDialog && <RichTextFoldDialog prevValues={foldDialogPrevValues} onSubmit={foldDialogOnSubmit}/>}
            {linkDialog &&
                <RichTextLinkDialog noText={linkDialogNoText} prevValues={linkDialogPrevValues}
                                    onSubmit={linkDialogOnSubmit}/>
            }
            {mentionDialog && <RichTextMentionDialog onSubmit={mentionDialogOnSubmit}/>}
            {videoDialog && <RichTextVideoDialog onSubmit={videoDialogOnSubmit}/>}
            {formulaDialog &&
                <RichTextFormulaDialog prevValues={formulaDialogPrevValues} onSubmit={formulaDialogOnSubmit}/>
            }
        </>
    );
}
