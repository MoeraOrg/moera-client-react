import React, { useEffect } from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { VerifiedMediaFile } from "api";
import { CheckboxField, InputField, NumberField, SelectField } from "ui/control/field";
import { RichTextImageStandardSize, STANDARD_SIZES } from "ui/control/richtexteditor/media/rich-text-image";
import UploadedImage from "ui/control/richtexteditor/media/UploadedImage";
import {
    richTextEditorDialog,
    RichTextEditorDialogBodyProps,
    RichTextEditorDialogProps
} from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";
import { SelectedImages } from "ui/control/richtexteditor/dialog/SelectedImages";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import "./RichTextImageDialog.css";

export interface RichTextImageValues {
    files?: File[] | null;
    mediaFiles?: VerifiedMediaFile[] | null;
    href?: string | null;
    compress?: boolean;
    standardSize?: RichTextImageStandardSize;
    customWidth?: number | null;
    customHeight?: number | null;
    caption?: string;
}

type Props = {
    files?: File[] | null;
    mediaFiles?: VerifiedMediaFile[] | null;
    href?: string | null;
    insert?: boolean;
    nodeName?: RelNodeName | string;
    forceCompress?: boolean;
    compressDefault?: boolean;
    mediaMaxSize?: number;
} & RichTextEditorDialogProps<RichTextImageValues>;

type BodyProps = RichTextEditorDialogBodyProps<Props>;

const mapPropsToValues = (props: Props): RichTextImageValues => ({
    files: props.files != null ? [...props.files] : null,
    mediaFiles: props.prevValues?.mediaFiles ?? props.mediaFiles,
    href: props.prevValues?.href ?? props.href,
    compress: props.compressDefault ?? true,
    standardSize: props.prevValues?.standardSize ?? "large",
    customWidth: props.prevValues?.customWidth,
    customHeight: props.prevValues?.customHeight,
    caption: props.prevValues?.caption ?? "",
});

function RichTextImageDialog({
    mediaFiles, insert, nodeName = REL_CURRENT, forceCompress, mediaMaxSize, onSubmit, okButtonRef
}: BodyProps) {
    const [, {value: files}, {setValue: setFiles}] = useField<File[] | null>("files");
    const [, {value: standardSize}] = useField<RichTextImageStandardSize>("standardSize");
    const [, {value: compress}] = useField<boolean>("compress");
    const {t} = useTranslation();

    useEffect(() => {
        // If there is no other field that should receive focus
        if (
            !(files == null && mediaFiles == null)
            && !(!insert && files?.length === 1)
            && okButtonRef?.current != null
        ) {
            okButtonRef.current.focus();
        }
    }, [files, insert, mediaFiles, okButtonRef]);

    useEffect(() => {
        if (okButtonRef.current != null) {
            const valid = compress || mediaMaxSize == null || files == null
                || files.every(file => file.size <= mediaMaxSize);
            okButtonRef.current.disabled = !valid;
        }
    }, [compress, files, mediaMaxSize, okButtonRef]);

    const onDelete = (index: number, e: React.MouseEvent) => {
        if (files != null) {
            if (files.length === 1 && index === 0) {
                onSubmit(false, {});
            } else {
                setFiles(files.toSpliced(index, 1));
            }
        }
        e.preventDefault();
    }

    return (
        <>
            {files != null &&
                <SelectedImages files={files} maxSize={compress ? undefined : mediaMaxSize} onDelete={onDelete}/>
            }
            {mediaFiles != null &&
                <div className="rich-text-editor-image-list pt-0 mb-3">
                    {mediaFiles.map(mediaFile =>
                        <UploadedImage key={mediaFile.id} media={mediaFile} nodeName={nodeName} showMenu={false}/>
                    )}
                </div>
            }
            {files == null && mediaFiles == null &&
                <InputField type="url" name="href" title={t("link")} anyValue autoFocus/>
            }
            {files != null && !forceCompress &&
                <CheckboxField title={t("compress-images")} name="compress" groupClassName="mt-3 mb-0" anyValue/>
            }
            {insert &&
                <>
                    <SelectField name="standardSize" title={t("size")} choices={STANDARD_SIZES} horizontal anyValue/>
                    {standardSize === "custom" &&
                        <div className="rich-text-image-dialog-size">
                            <NumberField name="customWidth" title={t("width")} horizontal min={0}
                                         format={{useGrouping: false}}/>
                            <NumberField name="customHeight" title={t("height")} horizontal min={0}
                                         format={{useGrouping: false}}/>
                        </div>
                    }
                    {((files == null && mediaFiles == null) || files?.length === 1 || mediaFiles?.length === 1) &&
                        <InputField name="caption" title={t("caption-optional")} anyValue/>
                    }
                </>
            }
        </>
    );
}

function getTitle({mediaFiles, insert}: Props): string {
    if (insert) {
        return mediaFiles != null ? "edit-inserted-image" : "insert-images";
    } else {
        return "add-images";
    }
}

export default richTextEditorDialog<Props, RichTextImageValues>(getTitle, mapPropsToValues, RichTextImageDialog);
