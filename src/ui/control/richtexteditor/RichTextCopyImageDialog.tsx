import React from 'react';
import { useTranslation } from 'react-i18next';

import { CheckboxField, InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextCopyImageValues {
    url?: string;
    compress?: boolean;
}

type Props = {
    forceCompress?: boolean;
    compressDefault?: boolean;
} & RichTextEditorDialogProps<RichTextCopyImageValues>;

const mapPropsToValues = (props: Props): RichTextCopyImageValues => ({
    url: "",
    compress: props.compressDefault ?? true,
});

const RichTextCopyImageDialog = ({forceCompress}: Props) => {
    const {t} = useTranslation();

    return (
        <>
            <InputField name="url" title={t("link")} anyValue autoFocus/>
            {!forceCompress &&
                <CheckboxField title={t("compress-images")} name="compress" anyValue/>
            }
        </>
    );
}

export default richTextEditorDialog<Props, RichTextCopyImageValues>(
    "copy-image-from-internet", mapPropsToValues, RichTextCopyImageDialog);
