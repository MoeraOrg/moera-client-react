import React from 'react';
import { useTranslation } from 'react-i18next';

import { InputField } from "ui/control/field";
import {
    richTextEditorDialog,
    RichTextEditorDialogProps
} from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";

export interface RichTextRenameMediaValues {
    title?: string;
}

type Props = {
    title?: string | null;
} & RichTextEditorDialogProps<RichTextRenameMediaValues>;

const mapPropsToValues = (props: Props): RichTextRenameMediaValues => ({
    title: props.title ?? "",
});

const RichTextRenameMediaDialog = () => {
    const {t} = useTranslation();

    return <InputField name="title" title={t("file-name")} anyValue autoFocus/>;
}

export default richTextEditorDialog<Props, RichTextRenameMediaValues>(
    "rename-file", mapPropsToValues, RichTextRenameMediaDialog
);
