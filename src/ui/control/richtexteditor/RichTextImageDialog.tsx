import React from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { VerifiedMediaFile } from "api";
import { InputField, NumberField, SelectField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";
import { RichTextImageStandardSize, STANDARD_SIZES } from "ui/control/richtexteditor/rich-text-image";
import UploadedImage from "ui/control/richtexteditor/UploadedImage";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import "./RichTextImageDialog.css";

export interface RichTextImageValues {
    mediaFiles?: VerifiedMediaFile[] | null;
    href?: string | null;
    standardSize?: RichTextImageStandardSize;
    customWidth?: number | null;
    customHeight?: number | null;
    caption?: string;
}

type Props = {
    mediaFiles?: VerifiedMediaFile[] | null;
    href?: string | null;
    nodeName?: RelNodeName | string;
    selectedImage?: VerifiedMediaFile | null;
} & RichTextEditorDialogProps<RichTextImageValues>;

const mapPropsToValues = (props: Props): RichTextImageValues => ({
    mediaFiles: props.prevValues?.mediaFiles ?? props.mediaFiles,
    href: props.prevValues?.href ?? props.href,
    standardSize: props.prevValues?.standardSize ?? "large",
    customWidth: props.prevValues?.customWidth,
    customHeight: props.prevValues?.customHeight,
    caption: props.prevValues?.caption ?? "",
});

function RichTextImageDialog({mediaFiles, nodeName = REL_CURRENT}: Props) {
    const [, {value: standardSize}] = useField<RichTextImageStandardSize>("standardSize");
    const {t} = useTranslation();

    return (
        <>
            {mediaFiles != null ?
                <div className="rich-text-editor-image-list pt-0 mb-3">
                    {mediaFiles.map(mediaFile =>
                        <UploadedImage key={mediaFile.id} media={mediaFile} nodeName={nodeName} showMenu={false}/>
                    )}
                </div>
            :
                <InputField name="href" title={t("link")} anyValue autoFocus/>
            }
            <SelectField name="standardSize" title={t("size")} choices={STANDARD_SIZES} horizontal anyValue/>
            {standardSize === "custom" &&
                <div className="rich-text-image-dialog-size">
                    <NumberField name="customWidth" title={t("width")} horizontal min={0}
                                 format={{useGrouping: false}}/>
                    <NumberField name="customHeight" title={t("height")} horizontal min={0}
                                 format={{useGrouping: false}}/>
                </div>
            }
            {(mediaFiles == null || mediaFiles.length === 1) &&
                <InputField name="caption" title={t("caption-optional")} anyValue/>
            }
        </>
    );
}

export default richTextEditorDialog<Props, RichTextImageValues>("insert-image", mapPropsToValues, RichTextImageDialog);
