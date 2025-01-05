import React from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { SourceFormat, VerifiedMediaFile } from "api";
import { CheckboxField, InputField, NumberField, SelectField } from "ui/control/field";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { RichTextImageStandardSize, STANDARD_SIZES } from "ui/control/richtexteditor/media/rich-text-image";
import { RichTextField } from "ui/control/richtexteditor/RichTextField";
import UploadedImage from "ui/control/richtexteditor/media/UploadedImage";
import {
    richTextEditorDialog,
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
    description?: RichTextValue;
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
    descriptionSrcFormat?: SourceFormat;
    smileysEnabled?: boolean;
} & RichTextEditorDialogProps<RichTextImageValues>;

const mapPropsToValues = (props: Props): RichTextImageValues => ({
    files: props.files != null ? [...props.files] : null,
    mediaFiles: props.prevValues?.mediaFiles ?? props.mediaFiles,
    href: props.prevValues?.href ?? props.href,
    compress: props.compressDefault ?? true,
    description: props.prevValues?.description ?? new RichTextValue("", props.descriptionSrcFormat ?? "markdown"),
    standardSize: props.prevValues?.standardSize ?? "large",
    customWidth: props.prevValues?.customWidth,
    customHeight: props.prevValues?.customHeight,
    caption: props.prevValues?.caption ?? "",
});

function RichTextImageDialog({
    mediaFiles, insert, nodeName = REL_CURRENT, forceCompress, descriptionSrcFormat, smileysEnabled, onSubmit
}: Props) {
    const [, {value: files}, {setValue: setFiles}] = useField<File[] | null>("files");
    const [, {value: standardSize}] = useField<RichTextImageStandardSize>("standardSize");
    const {t} = useTranslation();

    const onDelete = (index: number, e: React.MouseEvent) => {
        if (files != null) {
            if (files.length === 1 && index === 0) {
                onSubmit(false, {});
            } else {
                setFiles(files.filter((_, i) => i !== index));
            }
        }
        e.preventDefault();
    }

    return (
        <>
            {files != null &&
                <SelectedImages files={files} onDelete={onDelete}/>
            }
            {mediaFiles != null &&
                <div className="rich-text-editor-image-list pt-0 mb-3">
                    {mediaFiles.map(mediaFile =>
                        <UploadedImage key={mediaFile.id} media={mediaFile} nodeName={nodeName} showMenu={false}/>
                    )}
                </div>
            }
            {files == null && mediaFiles == null &&
                <InputField name="href" title={t("link")} anyValue autoFocus/>
            }
            {!insert && files?.length === 1 &&
                <RichTextField name="description" format={descriptionSrcFormat ?? "markdown"} maxHeight="14em"
                               className="mt-3" placeholder={t("description-optional")} smileysEnabled={smileysEnabled}
                               noComplexBlocks noEmbeddedMedia noMedia noVideo anyValue/>
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

export default richTextEditorDialog<Props, RichTextImageValues>("add-images", mapPropsToValues, RichTextImageDialog);
