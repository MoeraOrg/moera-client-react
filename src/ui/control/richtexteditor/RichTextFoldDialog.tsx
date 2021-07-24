import React from 'react';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextFoldValues {
    summary?: string;
}

type Props = RichTextEditorDialogProps<RichTextFoldValues>;

const mapPropsToValues = (): RichTextFoldValues => ({
    summary: ""
});

const RichTextFoldDialog = () => (
    <InputField name="summary" title="Summary" placeholder="Details" autoFocus/>
);

export default richTextEditorDialog<Props, RichTextFoldValues>("Fold", mapPropsToValues, RichTextFoldDialog);
