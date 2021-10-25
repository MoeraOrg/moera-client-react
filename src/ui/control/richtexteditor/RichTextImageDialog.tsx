import React from 'react';
import { useField } from 'formik';

import { PrivateMediaFileInfo } from "api/node/api-types";
import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";
import RichTextImageDialogTabs from "ui/control/richtexteditor/RichTextImageDialogTabs";
import RichTextImageDialogDropzone from "ui/control/richtexteditor/RichTextImageDialogDropzone";

export interface RichTextImageValues {
    source?: string;
    mediaFile?: PrivateMediaFileInfo | null;
    href?: string;
    title?: string;
    alt?: string;
}

type Props = {
    onAdded?: (id: string) => void;
    onDeleted?: (id: string) => void;
} & RichTextEditorDialogProps<RichTextImageValues>;

const mapPropsToValues = (): RichTextImageValues => ({
    source: "device",
    mediaFile: null,
    href: "",
    title: "",
    alt: ""
});

function RichTextImageDialog({onAdded, onDeleted}: Props) {
    const [, {value: source}] = useField<string>("source");

    return (
        <>
            <RichTextImageDialogTabs/>
            {source === "device" ?
                <RichTextImageDialogDropzone onAdded={onAdded} onDeleted={onDeleted}/>
            :
                <InputField name="href" title="URL" autoFocus/>
            }
            <InputField name="title" title="Title"/>
            <InputField name="alt" title="Alternative text"/>
        </>
    );
}

export default richTextEditorDialog<Props, RichTextImageValues>("Insert an image", mapPropsToValues, RichTextImageDialog);
