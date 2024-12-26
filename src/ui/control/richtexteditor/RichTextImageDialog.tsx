import React from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { PostingFeatures, VerifiedMediaFile } from "api";
import { InputField, NumberField, SelectField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";
import { RichTextImageStandardSize, STANDARD_SIZES } from "ui/control/richtexteditor/rich-text-image";
import RichTextImageDialogTabs from "ui/control/richtexteditor/RichTextImageDialogTabs";
import RichTextImageDialogDropzone from "ui/control/richtexteditor/RichTextImageDialogDropzone";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import "./RichTextImageDialog.css";

export interface RichTextImageValues {
    source?: string;
    mediaFile?: VerifiedMediaFile | null;
    href?: string;
    standardSize?: RichTextImageStandardSize;
    customWidth?: number | null;
    customHeight?: number | null;
    caption?: string;
}

type Props = {
    features?: PostingFeatures | null;
    noMedia?: boolean;
    nodeName?: RelNodeName | string;
    forceCompress?: boolean;
    selectedImage?: VerifiedMediaFile | null;
    onAdded?: (image: VerifiedMediaFile) => void;
    onDeleted?: (id: string) => void;
    externalImage?: File;
    uploadingExternalImage?: () => void;
} & RichTextEditorDialogProps<RichTextImageValues>;

const mapPropsToValues = (props: Props): RichTextImageValues => ({
    source: props.prevValues?.source ?? (props.noMedia === true ? "internet" : "device"),
    mediaFile: props.prevValues?.mediaFile ?? props.selectedImage ?? null,
    href: props.prevValues?.href ?? "",
    standardSize: props.prevValues?.standardSize ?? "large",
    customWidth: props.prevValues?.customWidth,
    customHeight: props.prevValues?.customHeight,
    caption: props.prevValues?.caption ?? "",
});

function RichTextImageDialog({
    features, noMedia = false, nodeName = REL_CURRENT, forceCompress, onAdded, onDeleted, externalImage,
    uploadingExternalImage
}: Props) {
    const [, {value: source}] = useField<string>("source");
    const [, {value: standardSize}] = useField<RichTextImageStandardSize>("standardSize");
    const {t} = useTranslation();

    return (
        <>
            {!noMedia && <RichTextImageDialogTabs/>}
            {source === "device" ?
                <RichTextImageDialogDropzone features={features ?? null} nodeName={nodeName}
                                             forceCompress={forceCompress} onAdded={onAdded} onDeleted={onDeleted}
                                             uploadingExternalImage={uploadingExternalImage}
                                             externalImage={externalImage}/>
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
            <InputField name="caption" title={t("caption-optional")} anyValue/>
        </>
    );
}

export default richTextEditorDialog<Props, RichTextImageValues>("insert-image", mapPropsToValues, RichTextImageDialog);
