import React from 'react';

import { InputField } from "ui/control/field";
import { richTextEditorDialog } from "ui/control/richtexteditor/rich-text-editor-dialog";

const RichTextLinkDialog = () => (
    <>
        <InputField name="text" title="Text"/>
        <InputField name="href" title="URL" autoFocus/>
    </>
);

const mapPropsToValues = props => ({
    text: props.text ?? "",
    href: props.href ?? "",
});

export default richTextEditorDialog("Insert a link", mapPropsToValues, RichTextLinkDialog);
