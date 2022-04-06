import React, { useState } from 'react';
import { useField } from 'formik';

import { Choice, PostingFeatures } from "api/node/api-types";
import { VerifiedMediaFile } from "api/node/images-upload";
import { PlusButton } from "ui/control";
import { InputField, NumberField, SelectField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";
import RichTextImageDialogTabs from "ui/control/richtexteditor/RichTextImageDialogTabs";
import RichTextImageDialogDropzone from "ui/control/richtexteditor/RichTextImageDialogDropzone";
import "./RichTextImageDialog.css";

type RichTextImageStandardSize = "full" | "large" | "medium" | "small" | "tiny" | "custom";

const STANDARD_SIZES: Choice<RichTextImageStandardSize>[] = [
    {title: "Full", value: "full"},
    {title: "Large", value: "large"},
    {title: "Medium", value: "medium"},
    {title: "Small", value: "small"},
    {title: "Tiny", value: "tiny"},
    {title: "Custom", value: "custom"}
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

const ALIGNMENTS: Choice<RichTextImageAlign>[] = [
    {title: "Left", value: "text-start"},
    {title: "Center", value: "text-center"},
    {title: "Right", value: "text-end"},
    {title: "Left, wrapping text", value: "float-text-start"},
    {title: "Right, wrapping text", value: "float-text-end"}
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
                              onAdded, onDeleted, externalImage, uploadingExternalImage}: Props) {
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
                <InputField name="href" title="URL" autoFocus/>
            }
            <SelectField name="standardSize" title="Size" choices={STANDARD_SIZES} horizontal anyValue/>
            {standardSize === "custom" &&
                <div className="rich-text-image-dialog-size">
                    <NumberField name="customWidth" title="Width" horizontal min={0} format={{useGrouping: false}}/>
                    <NumberField name="customHeight" title="Height" horizontal min={0} format={{useGrouping: false}}/>
                </div>
            }
            {showAlign && <SelectField name="align" title="Align" choices={ALIGNMENTS} horizontal anyValue/>}
            {showCaption && <InputField name="caption" title="Caption"/>}
            {showTooltip && <InputField name="title" title="Tooltip"/>}
            {showAlt && <InputField name="alt" title="Alternative text"/>}
            <div className="mb-3">
                <PlusButton title="Align" visible={!showAlign} onClick={() => setShowAlign(true)}/>
                <PlusButton title="Caption" visible={!showCaption} onClick={() => setShowCaption(true)}/>
                <PlusButton title="Tooltip" visible={!showTooltip} onClick={() => setShowTooltip(true)}/>
                <PlusButton title="Alt text" visible={!showAlt} onClick={() => setShowAlt(true)}/>
            </div>
        </>
    );
}

export default richTextEditorDialog<Props, RichTextImageValues>("Insert an image", mapPropsToValues, RichTextImageDialog);
