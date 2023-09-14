import React, { useState } from 'react';
import { useField } from 'formik';
import { WithTranslation } from 'react-i18next';

import { PostingFeatures, VerifiedMediaFile } from "api";
import { PlusButton } from "ui/control";
import { InputField, NumberField, SelectField, SelectFieldChoiceBase } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";
import RichTextImageDialogTabs from "ui/control/richtexteditor/RichTextImageDialogTabs";
import RichTextImageDialogDropzone from "ui/control/richtexteditor/RichTextImageDialogDropzone";
import "./RichTextImageDialog.css";

type RichTextImageStandardSize = "full" | "large" | "medium" | "small" | "tiny" | "custom";

const STANDARD_SIZES: SelectFieldChoiceBase<RichTextImageStandardSize>[] = [
    {title: "image-size.full", value: "full"},
    {title: "image-size.large", value: "large"},
    {title: "image-size.medium", value: "medium"},
    {title: "image-size.small", value: "small"},
    {title: "image-size.tiny", value: "tiny"},
    {title: "image-size.custom", value: "custom"}
];

export function getImageDimensions(standardSize: RichTextImageStandardSize,
                                   customWidth: number | null | undefined,
                                   customHeight: number | null | undefined): {width: number | null;
                                                                              height: number | null} {
    switch (standardSize) {
        case "full":
            return {width: null, height: null};
        case "large":
            return {width: 770, height: 600};
        case "medium":
            return {width: 600, height: 465};
        case "small":
            return {width: 400, height: 310};
        case "tiny":
            return {width: 250, height: 195};
        case "custom":
            return {width: customWidth ?? null, height: customHeight ?? null};
    }
}

type RichTextImageAlign = "text-start" | "text-center" | "text-end" | "float-text-start" | "float-text-end";

const ALIGNMENTS: SelectFieldChoiceBase<RichTextImageAlign>[] = [
    {title: "image-alignment.left", value: "text-start"},
    {title: "image-alignment.center", value: "text-center"},
    {title: "image-alignment.right", value: "text-end"},
    {title: "image-alignment.left-wrap", value: "float-text-start"},
    {title: "image-alignment.right-wrap", value: "float-text-end"}
];

export interface RichTextImageValues {
    source?: string;
    mediaFile?: VerifiedMediaFile | null;
    href?: string;
    standardSize?: RichTextImageStandardSize;
    customWidth?: number | null;
    customHeight?: number | null;
    align?: RichTextImageAlign;
    caption?: string;
    title?: string;
    alt?: string;
}

type Props = {
    features: PostingFeatures | null;
    noMedia?: boolean;
    nodeName?: string | null;
    forceCompress?: boolean;
    selectedImage?: VerifiedMediaFile | null;
    onAdded?: (image: VerifiedMediaFile) => void;
    onDeleted?: (id: string) => void;
    externalImage?: File;
    uploadingExternalImage?: () => void;
} & RichTextEditorDialogProps<RichTextImageValues>;

const mapPropsToValues = (props: Props): RichTextImageValues => ({
    source: props.noMedia === true ? "internet" : "device",
    mediaFile: props.selectedImage ?? null,
    href: "",
    standardSize: "large",
    customWidth: null,
    customHeight: null,
    align: "text-start",
    caption: "",
    title: "",
    alt: ""
});

function RichTextImageDialog({features, noMedia = false, nodeName, forceCompress,
                              onAdded, onDeleted, externalImage, uploadingExternalImage, t}: Props & WithTranslation) {
    const [showAlign, setShowAlign] = useState<boolean>(false);
    const [showCaption, setShowCaption] = useState<boolean>(false);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [showAlt, setShowAlt] = useState<boolean>(false);
    const [, {value: source}] = useField<string>("source");
    const [, {value: standardSize}] = useField<RichTextImageStandardSize>("standardSize");

    return (
        <>
            {!noMedia && <RichTextImageDialogTabs/>}
            {source === "device" ?
                <RichTextImageDialogDropzone features={features} nodeName={nodeName ?? null}
                                             forceCompress={forceCompress} onAdded={onAdded} onDeleted={onDeleted}
                                             uploadingExternalImage={uploadingExternalImage}
                                             externalImage={externalImage}/>
            :
                <InputField name="href" title={t("url")} autoFocus/>
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
            {showAlign && <SelectField name="align" title={t("align")} choices={ALIGNMENTS} horizontal anyValue/>}
            {showCaption && <InputField name="caption" title={t("caption")}/>}
            {showTooltip && <InputField name="title" title={t("tooltip")}/>}
            {showAlt && <InputField name="alt" title={t("alt-text")}/>}
            <div className="mb-3">
                <PlusButton title={t("align")} visible={!showAlign} onClick={() => setShowAlign(true)}/>
                <PlusButton title={t("caption")} visible={!showCaption} onClick={() => setShowCaption(true)}/>
                <PlusButton title={t("tooltip")} visible={!showTooltip} onClick={() => setShowTooltip(true)}/>
                <PlusButton title={t("alt-text-button")} visible={!showAlt} onClick={() => setShowAlt(true)}/>
            </div>
        </>
    );
}

export default richTextEditorDialog<Props, RichTextImageValues>("insert-image", mapPropsToValues, RichTextImageDialog);
