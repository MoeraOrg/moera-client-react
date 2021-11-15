import React, { useState } from 'react';
import { useField } from 'formik';

import { PostingFeatures, PrivateMediaFileInfo } from "api/node/api-types";
import { PlusButton } from "ui/control";
import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";
import RichTextImageDialogTabs from "ui/control/richtexteditor/RichTextImageDialogTabs";
import RichTextImageDialogDropzone from "ui/control/richtexteditor/RichTextImageDialogDropzone";

export interface RichTextImageValues {
    source?: string;
    mediaFile?: PrivateMediaFileInfo | null;
    href?: string;
    caption?: string;
    title?: string;
    alt?: string;
}

type Props = {
    features: PostingFeatures | null;
    noMedia?: boolean;
    selectedImage?: PrivateMediaFileInfo | null;
    onAdded?: (image: PrivateMediaFileInfo) => void;
    onDeleted?: (id: string) => void;
} & RichTextEditorDialogProps<RichTextImageValues>;

const mapPropsToValues = (props: Props): RichTextImageValues => ({
    source: props.noMedia === true ? "internet" : "device",
    mediaFile: props.selectedImage ?? null,
    href: "",
    caption: "",
    title: "",
    alt: ""
});

function RichTextImageDialog({features, noMedia = false, onAdded, onDeleted}: Props) {
    const [showCaption, setShowCaption] = useState<boolean>(false);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [showAlt, setShowAlt] = useState<boolean>(false);
    const [, {value: source}] = useField<string>("source");

    return (
        <>
            {!noMedia && <RichTextImageDialogTabs/>}
            {source === "device" ?
                <RichTextImageDialogDropzone features={features} onAdded={onAdded} onDeleted={onDeleted}/>
            :
                <InputField name="href" title="URL" autoFocus/>
            }
            <div className="mb-3">
                <PlusButton title="Caption" visible={!showCaption} onClick={() => setShowCaption(true)}/>
                <PlusButton title="Tooltip" visible={!showTooltip} onClick={() => setShowTooltip(true)}/>
                <PlusButton title="Alt text" visible={!showAlt} onClick={() => setShowAlt(true)}/>
            </div>
            {showCaption && <InputField name="caption" title="Caption"/>}
            {showTooltip && <InputField name="title" title="Tooltip"/>}
            {showAlt && <InputField name="alt" title="Alternative text"/>}
        </>
    );
}

export default richTextEditorDialog<Props, RichTextImageValues>("Insert an image", mapPropsToValues, RichTextImageDialog);
