import React from 'react';
import { useTranslation } from 'react-i18next';

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

function EntryLinkPreviewEditDialog() {
    const {t} = useTranslation();

    return (
        <>
            <InputField name="title" title={t("title")} maxLength={75} autoFocus/>
            <TextField name="description" title={t("description")} maxHeight="5em" maxLength={120}/>
        </>
    );
}

export default richTextEditorDialog<Props, EntryLinkPreviewEditValues>(
    "edit-link-preview", mapPropsToValues, EntryLinkPreviewEditDialog);
