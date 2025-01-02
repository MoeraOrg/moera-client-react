import React from 'react';
import { useTranslation } from 'react-i18next';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";

export interface RichTextFoldValues {
    summary?: string;
}

type Props = RichTextEditorDialogProps<RichTextFoldValues>;

const mapPropsToValues = (props: Props): RichTextFoldValues => ({
    summary: props.prevValues?.summary ?? ""
});

function RichTextFoldDialog() {
    const {t} = useTranslation();

    return <InputField name="summary" title={t("summary")} placeholder={t("summary")} anyValue autoFocus/>;
}

export default richTextEditorDialog<Props, RichTextFoldValues>("fold", mapPropsToValues, RichTextFoldDialog);
