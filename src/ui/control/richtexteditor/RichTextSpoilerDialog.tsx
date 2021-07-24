import React from 'react';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextSpoilerValues {
    title?: string;
}

type Props = RichTextEditorDialogProps<RichTextSpoilerValues>;

const mapPropsToValues = (): RichTextSpoilerValues => ({
    title: ""
});

const RichTextSpoilerDialog = () => (
    <InputField name="title" title="Alert text" placeholder="spoiler!" autoFocus/>
);

export default richTextEditorDialog<Props, RichTextSpoilerValues>("Spoiler", mapPropsToValues, RichTextSpoilerDialog);
