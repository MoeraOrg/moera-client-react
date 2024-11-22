import { createContext, useContext } from 'react';
import { RichTextEditorDialogSubmit } from "ui/control/richtexteditor/rich-text-editor-dialog";
import { RichTextSpoilerValues } from "ui/control/richtexteditor/RichTextSpoilerDialog";
import { RichTextFoldValues } from "ui/control/richtexteditor/RichTextFoldDialog";
import { RichTextLinkValues } from "ui/control/richtexteditor/RichTextLinkDialog";
import { NameListItem } from "util/names-list";

export interface RichTextEditorDialogsInterface {
    showSpoilerDialog: (
        show: boolean,
        prevValues?: RichTextSpoilerValues | null,
        onSubmit?: RichTextEditorDialogSubmit<RichTextSpoilerValues>
    ) => void;
    showFoldDialog: (
        show: boolean,
        prevValues?: RichTextFoldValues | null,
        onSubmit?: RichTextEditorDialogSubmit<RichTextFoldValues>
    ) => void;
    showLinkDialog: (
        show: boolean,
        prevValues?: RichTextLinkValues | null,
        onSubmit?: RichTextEditorDialogSubmit<RichTextLinkValues>
    ) => void;
    showMentionDialog: (show: boolean, onSubmit?: RichTextEditorDialogSubmit<NameListItem>) => void;
}

export const RichTextEditorDialogsContext = createContext<RichTextEditorDialogsInterface>({
    showSpoilerDialog: () => {},
    showFoldDialog: () => {},
    showLinkDialog: () => {},
    showMentionDialog: () => {},
});

export const useRichTextEditorDialogs = (): RichTextEditorDialogsInterface => useContext(RichTextEditorDialogsContext);
