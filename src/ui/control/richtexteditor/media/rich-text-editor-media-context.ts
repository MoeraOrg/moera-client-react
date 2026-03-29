import { createContext, useContext } from 'react';
import { DropzoneRootProps } from 'react-dropzone';

import { VerifiedMediaFile } from "api";
import { RichTextImageStandardSize } from "ui/control/richtexteditor/media/rich-text-image";
import { RichTextImageValues } from "ui/control/richtexteditor/media/RichTextImageDialog";
import { RichTextEditorDialogSubmit } from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";

export type UploadStatus = "loading" | "success" | "failure";

export interface UploadProgress {
    status: UploadStatus;
    loaded: number;
    total: number;
}

export type OnInsertHandler = (
    media: VerifiedMediaFile[],
    standardSize: RichTextImageStandardSize,
    customWidth?: number | null,
    customHeight?: number | null,
    caption?: string | null
) => void;

export type AttachmentType = "image" | "file";

export interface RichTextEditorMediaInterface {
    getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
    isDragAccept: boolean;
    isDragReject: boolean;
    openLocalFiles: (onUploaded?: OnInsertHandler) => void;
    uploadProgress: UploadProgress[];
    deleteMedia: (id: string) => void;
    reorderMedia: (moveId: string, overId: string) => void;
    pasteMedia: (data: DataTransfer) => boolean;
    showImageDialog: (
        show: boolean, files?: File[] | null, mediaFiles?: VerifiedMediaFile[] | null, href?: string | null,
        insert?: boolean, prevValues?: RichTextImageValues | null,
        onSubmit?: RichTextEditorDialogSubmit<RichTextImageValues>
    ) => void;
    downloading: boolean;
    copyImage: () => void;
    attachmentType: AttachmentType;
    setAttachmentType: (type: AttachmentType) => void;
    renameMedia: (mediaId: string, title: string) => void;
}

export const RichTextEditorMediaContext = createContext<RichTextEditorMediaInterface>({
    getRootProps: () => ({}),
    isDragAccept: false,
    isDragReject: false,
    openLocalFiles: () => {},
    uploadProgress: [],
    deleteMedia: () => {},
    reorderMedia: () => {},
    pasteMedia: () => false,
    showImageDialog: () => {},
    downloading: false,
    copyImage: () => {},
    attachmentType: "image",
    setAttachmentType: () => {},
    renameMedia: () => {},
});

export const useRichTextEditorMedia = (): RichTextEditorMediaInterface => useContext(RichTextEditorMediaContext);
