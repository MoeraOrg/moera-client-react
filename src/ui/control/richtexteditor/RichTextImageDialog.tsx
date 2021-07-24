import React from 'react';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextImageValues {
    href?: string;
    title?: string;
    alt?: string;
}

type Props = RichTextEditorDialogProps<RichTextImageValues>;

const mapPropsToValues = (): RichTextImageValues => ({
    href: "",
    title: "",
    alt: ""
});

const RichTextImageDialog = () => (
    <>
        <InputField name="href" title="URL" autoFocus/>
        <InputField name="title" title="Title"/>
        <InputField name="alt" title="Alternative text"/>
    </>
);

export default richTextEditorDialog<Props, RichTextImageValues>("Insert an image", mapPropsToValues, RichTextImageDialog);
