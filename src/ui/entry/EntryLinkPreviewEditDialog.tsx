import React from 'react';

import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";
import { InputField } from "ui/control/field";

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
        <InputField name="title" title="Title" autoFocus/>
        <InputField name="description" title="Description"/>
    </>
);

export default richTextEditorDialog<Props, EntryLinkPreviewEditValues>(
    "Edit link preview", mapPropsToValues, EntryLinkPreviewEditDialog);
