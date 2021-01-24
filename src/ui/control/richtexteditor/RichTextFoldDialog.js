import React from 'react';

import { InputField } from "ui/control/field";
import { richTextEditorDialog } from "ui/control/richtexteditor/rich-text-editor-dialog";

const RichTextFoldDialog = () => (
    <InputField name="summary" title="Summary" placeholder="Details" autoFocus/>
);

const mapPropsToValues = props => ({
    summary: props.summary ?? ""
});

export default richTextEditorDialog("Fold", mapPropsToValues, RichTextFoldDialog);
