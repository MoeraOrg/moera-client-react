import React from 'react';
import { useTranslation } from 'react-i18next';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextCopyImageValues {
    url?: string;
}

type Props = RichTextEditorDialogProps<RichTextCopyImageValues>;

const mapPropsToValues = (): RichTextCopyImageValues => ({
    url: ""
});

const RichTextCopyImageDialog = () => {
    const {t} = useTranslation();

    return <InputField name="url" title={t("url")} anyValue autoFocus/>;
}

export default richTextEditorDialog<Props, RichTextCopyImageValues>(
    "copy-image-from-internet", mapPropsToValues, RichTextCopyImageDialog);
