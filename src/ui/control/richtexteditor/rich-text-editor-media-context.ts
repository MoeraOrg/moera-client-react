import { createContext, useContext } from 'react';
import { DropzoneRootProps } from 'react-dropzone';

import { VerifiedMediaFile } from "api";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { RichTextImageStandardSize } from "ui/control/richtexteditor/rich-text-image";
import { RichTextImageValues } from "ui/control/richtexteditor/RichTextImageDialog";
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

export interface RichTextEditorMediaInterface {
    getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
    isDragAccept: boolean;
    isDragReject: boolean;
    openLocalFiles: (onUploaded?: OnInsertHandler) => void;
    uploadImages: (files: File[], compress: boolean, caption?: RichTextValue) => void;
    uploadProgress: UploadProgress[];
    forceCompress: boolean;
    compress: boolean;
    setCompress: (compress: boolean) => void;
    deleteImage: (id: string) => void;
    reorderImage: (moveId: string, overId: string) => void;
    pasteImage: (data: DataTransfer) => boolean;
    showImageDialog: (
        show: boolean, files?: File[] | null, mediaFiles?: VerifiedMediaFile[] | null, href?: string | null,
        insert?: boolean, prevValues?: RichTextImageValues | null,
        onSubmit?: RichTextEditorDialogSubmit<RichTextImageValues>
    ) => void;
}

export const RichTextEditorMediaContext = createContext<RichTextEditorMediaInterface>({
    getRootProps: () => ({}),
    isDragAccept: false,
    isDragReject: false,
    openLocalFiles: () => {},
    uploadImages: () => {},
    uploadProgress: [],
    forceCompress: false,
    compress: false,
    setCompress: () => {},
    deleteImage: () => {},
    reorderImage: () => {},
    pasteImage: () => false,
    showImageDialog: () => {},
});

export const useRichTextEditorMedia = (): RichTextEditorMediaInterface => useContext(RichTextEditorMediaContext);
