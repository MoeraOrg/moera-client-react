import React from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { SourceFormat } from "api";
import { CheckboxField } from "ui/control/field";
import {
    richTextEditorDialog,
    RichTextEditorDialogProps
} from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";
import { RichTextField } from "ui/control/richtexteditor/RichTextField";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { SelectedImages } from "ui/control/richtexteditor/dialog/SelectedImages";

export interface RichTextUploadImagesValues {
    files: File[];
    compress?: boolean;
    caption: RichTextValue;
}

type Props = {
    files: File[];
    forceCompress?: boolean;
    compressDefault?: boolean;
    captionSrcFormat?: SourceFormat;
    smileysEnabled?: boolean;
} & RichTextEditorDialogProps<RichTextUploadImagesValues>;

const mapPropsToValues = (props: Props): RichTextUploadImagesValues => ({
    files: [...props.files],
    caption: new RichTextValue("", props.captionSrcFormat ?? "markdown"),
    compress: props.compressDefault ?? true,
});

const RichTextUploadImagesDialog = ({forceCompress, captionSrcFormat, smileysEnabled, onSubmit}: Props) => {
    const [, {value: files}, {setValue: setFiles}] = useField<File[]>("files");
    const {t} = useTranslation();

    const onDelete = (index: number, e: React.MouseEvent) => {
        if (files.length === 1 && index === 0) {
            onSubmit(false, {});
        } else {
            setFiles(files.filter((_, i) => i !== index));
        }
        e.preventDefault();
    }

    return (
        <>
            <SelectedImages files={files} onDelete={onDelete}/>
            {files.length === 1 &&
                <RichTextField name="caption" format={captionSrcFormat ?? "markdown"} maxHeight="14em" className="mt-3"
                               placeholder={t("description-optional")} smileysEnabled={smileysEnabled} anyValue
                               noMedia/>
            }
            {!forceCompress &&
                <CheckboxField title={t("compress-images")} name="compress" groupClassName="mt-3 mb-0" anyValue/>
            }
        </>
    );
}

export default richTextEditorDialog<Props, RichTextUploadImagesValues>(
    "add-images", mapPropsToValues, RichTextUploadImagesDialog);
