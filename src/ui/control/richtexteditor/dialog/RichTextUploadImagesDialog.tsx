import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { SourceFormat } from "api";
import { CheckboxField } from "ui/control/field";
import { Loading } from "ui/control/Loading";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";
import { RichTextField } from "ui/control/richtexteditor/RichTextField";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { Icon, msClose } from "ui/material-symbols";
import { useField } from "formik";

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
    const [filesData, setFilesData] = React.useState<string[]>([]);
    const {t} = useTranslation();

    useEffect(() => {
        Promise.all(files.map(readFileAsDataUrl)).then(setFilesData);
    }, [files]);

    const onDelete = (index: number) => (e: React.MouseEvent) => {
        if (files.length === 1 && index === 0) {
            onSubmit(false, {});
        } else {
            setFiles(files.filter((_, i) => i !== index));
        }
        e.preventDefault();
    }

    return (
        <>
            <div className="rich-text-editor-image-list pt-0">
                {filesData.length === 0 && files.length > 0 ?
                    <Loading/>
                :
                    filesData.map((fileData, index) =>
                        <div key={index} className="rich-text-editor-uploaded-image">
                            <button className="menu" onClick={onDelete(index)}>
                                <Icon icon={msClose} width={12} height={12}/>
                            </button>
                            <img className="thumbnail" src={fileData} alt=""/>
                        </div>
                    )
                }
            </div>
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

function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

export default richTextEditorDialog<Props, RichTextUploadImagesValues>(
    "add-images", mapPropsToValues, RichTextUploadImagesDialog);
