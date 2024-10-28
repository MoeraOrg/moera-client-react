import React from 'react';
import { useTranslation } from 'react-i18next';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextSpoilerValues {
    title?: string;
}

interface Props extends RichTextEditorDialogProps<RichTextSpoilerValues> {
    title: string;
}

const mapPropsToValues = (props: Props): RichTextSpoilerValues => ({
    title: props.title
});

function RichTextSpoilerDialog() {
    const {t} = useTranslation();

    return <InputField name="title" title={t("alert-text")} placeholder={t("spoiler-alert")} autoFocus/>;
}

export default richTextEditorDialog<Props, RichTextSpoilerValues>("spoiler", mapPropsToValues, RichTextSpoilerDialog);
