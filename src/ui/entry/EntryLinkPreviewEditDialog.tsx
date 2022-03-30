import React from 'react';

import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";
import { InputField, TextField } from "ui/control/field";

export interface EntryLinkPreviewEditValues {
    title: string;
    description: string;
}

type Props = {
    title: string;
    description: string;
} & RichTextEditorDialogProps<EntryLinkPreviewEditValues>;

const mapPropsToValues = (props: Props): EntryLinkPreviewEditValues => ({
    title: props.title,
    description: props.description
});

const EntryLinkPreviewEditDialog = () => (
    <>
        <InputField name="title" title="Title" maxLength={75} autoFocus/>
        <TextField name="description" title="Description" maxRows={3} maxLength={120}/>
    </>
);

export default richTextEditorDialog<Props, EntryLinkPreviewEditValues>(
    "Edit link preview", mapPropsToValues, EntryLinkPreviewEditDialog);
