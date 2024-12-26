import React from 'react';
import { useTranslation } from 'react-i18next';

import { TextField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextVideoValues {
    code?: string;
}

type Props = RichTextEditorDialogProps<RichTextVideoValues>;

const mapPropsToValues = (): RichTextVideoValues => ({
    code: ""
});

function RichTextVideoDialog() {
    const {t} = useTranslation();

    return <TextField name="code" title={t("copy-embedding-video-code")} placeholder="" maxHeight="10em" rows={6}
                      anyValue autoFocus/>;
}

export default richTextEditorDialog<Props, RichTextVideoValues>("video-internet", mapPropsToValues, RichTextVideoDialog);
