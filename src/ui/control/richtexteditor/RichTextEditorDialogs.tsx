import React, { ReactNode, useState } from 'react';

import { RichTextEditorDialogsContext } from "ui/control/richtexteditor/rich-text-editor-dialogs-context";
import RichTextSpoilerDialog, { RichTextSpoilerValues } from "ui/control/richtexteditor/RichTextSpoilerDialog";
import RichTextFoldDialog, { RichTextFoldValues } from "ui/control/richtexteditor/RichTextFoldDialog";
import RichTextLinkDialog, { RichTextLinkValues } from "ui/control/richtexteditor/RichTextLinkDialog";
import RichTextMentionDialog from "ui/control/richtexteditor/RichTextMentionDialog";
import { RichTextEditorDialogSubmit } from "ui/control/richtexteditor/rich-text-editor-dialog";
import { NameListItem } from "util/names-list";

interface Props {
    children: ReactNode;
}

export default function RichTextEditorDialogs({children}: Props) {
    const [spoilerDialog, setSpoilerDialog] = useState<boolean>(false);
    const [spoilerDialogOnSubmit, setSpoilerDialogOnSubmit] =
        useState<RichTextEditorDialogSubmit<RichTextSpoilerValues>>(() => () => {});
    const [foldDialog, setFoldDialog] = useState<boolean>(false);
    const [foldDialogOnSubmit, setFoldDialogOnSubmit] =
        useState<RichTextEditorDialogSubmit<RichTextFoldValues>>(() => () => {});
    const [linkDialog, setLinkDialog] = useState<boolean>(false);
    const [linkDialogOnSubmit, setLinkDialogOnSubmit] =
        useState<RichTextEditorDialogSubmit<RichTextLinkValues>>(() => () => {});
    const [mentionDialog, setMentionDialog] = useState<boolean>(false);
    const [mentionDialogOnSubmit, setMentionDialogOnSubmit] =
        useState<RichTextEditorDialogSubmit<NameListItem>>(() => () => {});

    const showSpoilerDialog = (show: boolean, onSubmit?: RichTextEditorDialogSubmit<RichTextSpoilerValues>) => {
        if (show) {
            onSubmit && setSpoilerDialogOnSubmit(() => onSubmit);
            setSpoilerDialog(true);
        } else {
            setSpoilerDialog(false);
        }
    }

    const showFoldDialog = (show: boolean, onSubmit?: RichTextEditorDialogSubmit<RichTextFoldValues>) => {
        if (show) {
            onSubmit && setFoldDialogOnSubmit(() => onSubmit);
            setFoldDialog(true);
        } else {
            setFoldDialog(false);
        }
    }

    const showLinkDialog = (show: boolean, onSubmit?: RichTextEditorDialogSubmit<RichTextLinkValues>) => {
        if (show) {
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

    return (
        <>
            <RichTextEditorDialogsContext.Provider
                value={{showSpoilerDialog, showFoldDialog, showLinkDialog, showMentionDialog}}
            >
                {children}
            </RichTextEditorDialogsContext.Provider>
            {spoilerDialog && <RichTextSpoilerDialog title="" onSubmit={spoilerDialogOnSubmit}/>}
            {foldDialog && <RichTextFoldDialog onSubmit={foldDialogOnSubmit}/>}
            {linkDialog && <RichTextLinkDialog href="" onSubmit={linkDialogOnSubmit}/>}
            {mentionDialog && <RichTextMentionDialog onSubmit={mentionDialogOnSubmit}/>}
        </>
    );
}
