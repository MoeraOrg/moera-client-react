import React, { useState } from 'react';
import { useField } from 'formik';

import { PostingFeatures } from "api/node/api-types";
import { RichTextMedia } from "state/richtexteditor/actions";
import { PlusButton } from "ui/control";
import { InputField, NumberField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";
import RichTextImageDialogTabs from "ui/control/richtexteditor/RichTextImageDialogTabs";
import RichTextImageDialogDropzone from "ui/control/richtexteditor/RichTextImageDialogDropzone";
import "./RichTextImageDialog.css";

export interface RichTextImageValues {
    source?: string;
    mediaFile?: RichTextMedia | null;
    href?: string;
    width?: number | null;
    height?: number | null;
    caption?: string;
    title?: string;
    alt?: string;
}

type Props = {
    features: PostingFeatures | null;
    noMedia?: boolean;
    nodeName?: string | null;
    forceCompress?: boolean;
    selectedImage?: RichTextMedia | null;
    onAdded?: (image: RichTextMedia) => void;
    onDeleted?: (id: string) => void;
} & RichTextEditorDialogProps<RichTextImageValues>;

const mapPropsToValues = (props: Props): RichTextImageValues => ({
    source: props.noMedia === true ? "internet" : "device",
    mediaFile: props.selectedImage ?? null,
    href: "",
    width: null,
    height: null,
    caption: "",
    title: "",
    alt: ""
});

function RichTextImageDialog({features, noMedia = false, nodeName, forceCompress, onAdded, onDeleted}: Props) {
    const [showSize, setShowSize] = useState<boolean>(false);
    const [showCaption, setShowCaption] = useState<boolean>(false);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [showAlt, setShowAlt] = useState<boolean>(false);
    const [, {value: source}] = useField<string>("source");

    return (
        <>
            {!noMedia && <RichTextImageDialogTabs/>}
            {source === "device" ?
                <RichTextImageDialogDropzone features={features} nodeName={nodeName ?? null}
                                             forceCompress={forceCompress} onAdded={onAdded} onDeleted={onDeleted}/>
            :
                <InputField name="href" title="URL" autoFocus/>
            }
            <div className="mb-3">
                <PlusButton title="Size" visible={!showSize} onClick={() => setShowSize(true)}/>
                <PlusButton title="Caption" visible={!showCaption} onClick={() => setShowCaption(true)}/>
                <PlusButton title="Tooltip" visible={!showTooltip} onClick={() => setShowTooltip(true)}/>
                <PlusButton title="Alt text" visible={!showAlt} onClick={() => setShowAlt(true)}/>
            </div>
            {showSize &&
                <div className="rich-text-image-dialog-size">
                    <NumberField name="width" title="Width" horizontal min={0} format={{useGrouping: false}}/>
                    <NumberField name="height" title="Height" horizontal min={0} format={{useGrouping: false}}/>
                </div>
            }
            {showCaption && <InputField name="caption" title="Caption"/>}
            {showTooltip && <InputField name="title" title="Tooltip"/>}
            {showAlt && <InputField name="alt" title="Alternative text"/>}
        </>
    );
}

export default richTextEditorDialog<Props, RichTextImageValues>("Insert an image", mapPropsToValues, RichTextImageDialog);
