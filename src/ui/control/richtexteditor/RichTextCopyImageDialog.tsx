import React from 'react';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextCopyImageValues {
    url?: string;
}

type Props = RichTextEditorDialogProps<RichTextCopyImageValues>;

const mapPropsToValues = (): RichTextCopyImageValues => ({
    url: ""
});

const RichTextCopyImageDialog = () => (
    <InputField name="url" title="URL" autoFocus/>
);

export default richTextEditorDialog<Props, RichTextCopyImageValues>(
    "Copy Image From Internet", mapPropsToValues, RichTextCopyImageDialog);
