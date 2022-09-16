import React from 'react';
import { WithTranslation } from 'react-i18next';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextFoldValues {
    summary?: string;
}

type Props = RichTextEditorDialogProps<RichTextFoldValues>;

const mapPropsToValues = (): RichTextFoldValues => ({
    summary: ""
});

const RichTextFoldDialog = ({t}: Props & WithTranslation) => (
    <InputField name="summary" title={t("summary")} placeholder={t("details")} autoFocus/>
);

export default richTextEditorDialog<Props, RichTextFoldValues>("fold", mapPropsToValues, RichTextFoldDialog);
