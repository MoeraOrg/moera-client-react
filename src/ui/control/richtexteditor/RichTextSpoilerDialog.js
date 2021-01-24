import React from 'react';

import { InputField } from "ui/control/field";
import { richTextEditorDialog } from "ui/control/richtexteditor/rich-text-editor-dialog";

const RichTextSpoilerDialog = () => (
    <InputField name="title" title="Alert text" placeholder="spoiler!" autoFocus/>
);

const mapPropsToValues = props => ({
    title: props.title ?? ""
});

export default richTextEditorDialog("Spoiler", mapPropsToValues, RichTextSpoilerDialog);
