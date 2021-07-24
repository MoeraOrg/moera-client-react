import React from 'react';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextLinkValues {
    text?: string;
    href?: string;
}

interface Props extends RichTextEditorDialogProps<RichTextLinkValues> {
    text: string;
}

const mapPropsToValues = (props: Props): RichTextLinkValues => ({
    text: props.text ?? "",
    href: ""
});

const RichTextLinkDialog = () => (
    <>
        <InputField name="text" title="Text"/>
        <InputField name="href" title="URL" autoFocus/>
    </>
);

export default richTextEditorDialog<Props, RichTextLinkValues>("Insert a link", mapPropsToValues, RichTextLinkDialog);
