import React from 'react';
import { useTranslation } from 'react-i18next';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";

export interface RichTextSpoilerValues {
    title?: string;
}

type Props = RichTextEditorDialogProps<RichTextSpoilerValues>;

const mapPropsToValues = (props: Props): RichTextSpoilerValues => ({
    title: props.prevValues?.title
});

function RichTextSpoilerDialog() {
    const {t} = useTranslation();

    return <InputField name="title" title={t("alert-text")} placeholder={t("spoiler-alert")} anyValue autoFocus/>;
}

export default richTextEditorDialog<Props, RichTextSpoilerValues>("spoiler", mapPropsToValues, RichTextSpoilerDialog);
