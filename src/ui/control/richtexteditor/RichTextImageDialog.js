import React from 'react';

import { InputField } from "ui/control/field";
import { richTextEditorDialog } from "ui/control/richtexteditor/rich-text-editor-dialog";

const RichTextImageDialog = () => (
    <>
        <InputField name="href" title="URL" autoFocus/>
        <InputField name="title" title="Title"/>
        <InputField name="alt" title="Alternative text"/>
    </>
);

const mapPropsToValues = props => ({
    href: props.href ?? "",
    title: props.title ?? "",
    alt: props.alt ?? ""
});

export default richTextEditorDialog("Insert an image", mapPropsToValues, RichTextImageDialog);
