import React from 'react';
import { WithTranslation } from 'react-i18next';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextSpoilerValues {
    title?: string;
}

type Props = RichTextEditorDialogProps<RichTextSpoilerValues>;

const mapPropsToValues = (): RichTextSpoilerValues => ({
    title: ""
});

const RichTextSpoilerDialog = ({t}: Props & WithTranslation) => (
    <InputField name="title" title={t("alert-text")} placeholder="spoiler!" autoFocus/>
);

export default richTextEditorDialog<Props, RichTextSpoilerValues>("spoiler", mapPropsToValues, RichTextSpoilerDialog);
