import { createContext, useContext } from 'react';
import { DropzoneRootProps } from 'react-dropzone';

import { VerifiedMediaFile } from "api";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";

export type UploadStatus = "loading" | "success" | "failure";

export interface UploadProgress {
    status: UploadStatus;
    loaded: number;
    total: number;
}

export type OnUploadedHandler = (media: VerifiedMediaFile[]) => void;

export interface RichTextEditorMediaInterface {
    getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
    isDragAccept: boolean;
    isDragReject: boolean;
    openLocalFiles: (onUploaded?: OnUploadedHandler) => void;
    uploadImages: (files: File[], caption: RichTextValue | undefined) => void;
    uploadProgress: UploadProgress[];
    forceCompress: boolean;
    compress: boolean;
    setCompress: (compress: boolean) => void;
    deleteImage: (id: string) => void;
    reorderImage: (moveId: string, overId: string) => void;
    pasteImage: (data: DataTransfer) => boolean;
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
});

export const useRichTextEditorMedia = (): RichTextEditorMediaInterface => useContext(RichTextEditorMediaContext);
