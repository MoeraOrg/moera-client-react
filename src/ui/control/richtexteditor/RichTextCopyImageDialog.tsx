import React from 'react';
import { WithTranslation } from 'react-i18next';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextCopyImageValues {
    url?: string;
}

type Props = RichTextEditorDialogProps<RichTextCopyImageValues>;

const mapPropsToValues = (): RichTextCopyImageValues => ({
    url: ""
});

const RichTextCopyImageDialog = ({t}: Props & WithTranslation) => (
    <InputField name="url" title={t("url")} autoFocus/>
);

export default richTextEditorDialog<Props, RichTextCopyImageValues>(
    "copy-image-from-internet", mapPropsToValues, RichTextCopyImageDialog);
