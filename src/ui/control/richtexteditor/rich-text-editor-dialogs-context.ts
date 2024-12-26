import { createContext, useContext } from 'react';
import { RichTextEditorDialogSubmit } from "ui/control/richtexteditor/rich-text-editor-dialog";
import { RichTextSpoilerValues } from "ui/control/richtexteditor/RichTextSpoilerDialog";
import { RichTextFoldValues } from "ui/control/richtexteditor/RichTextFoldDialog";
import { RichTextLinkValues } from "ui/control/richtexteditor/RichTextLinkDialog";
import { RichTextVideoValues } from "ui/control/richtexteditor/RichTextVideoDialog";
import { RichTextFormulaValues } from "ui/control/richtexteditor/RichTextFormulaDialog";
import { RichTextImageValues } from "ui/control/richtexteditor/RichTextImageDialog";
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
        noText?: boolean,
        prevValues?: RichTextLinkValues | null,
        onSubmit?: RichTextEditorDialogSubmit<RichTextLinkValues>
    ) => void;
    showMentionDialog: (show: boolean, onSubmit?: RichTextEditorDialogSubmit<NameListItem>) => void;
    showVideoDialog: (show: boolean, onSubmit?: RichTextEditorDialogSubmit<RichTextVideoValues>) => void;
    showFormulaDialog: (
        show: boolean,
        prevValues?: RichTextFormulaValues | null,
        onSubmit?: RichTextEditorDialogSubmit<RichTextFormulaValues>
    ) => void;
    showImageDialog: (
        show: boolean,
        prevValues?: RichTextImageValues | null,
        onSubmit?: RichTextEditorDialogSubmit<RichTextImageValues>
    ) => void;
}

export const RichTextEditorDialogsContext = createContext<RichTextEditorDialogsInterface>({
    showSpoilerDialog: () => {},
    showFoldDialog: () => {},
    showLinkDialog: () => {},
    showMentionDialog: () => {},
    showVideoDialog: () => {},
    showFormulaDialog: () => {},
    showImageDialog: () => {},
});

export const useRichTextEditorDialogs = (): RichTextEditorDialogsInterface => useContext(RichTextEditorDialogsContext);
