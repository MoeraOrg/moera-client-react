import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { SourceFormat } from "api";
import { CheckboxField, InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";
import { RichTextField } from "ui/control/richtexteditor/RichTextField";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";

export interface RichTextCopyImageValues {
    url?: string;
    compress?: boolean;
    description?: RichTextValue;
}

type Props = {
    forceCompress?: boolean;
    compressDefault?: boolean;
    descriptionSrcFormat?: SourceFormat;
    smileysEnabled?: boolean;
} & RichTextEditorDialogProps<RichTextCopyImageValues>;

const mapPropsToValues = (props: Props): RichTextCopyImageValues => ({
    url: "",
    compress: props.compressDefault ?? true,
    description: new RichTextValue("", props.descriptionSrcFormat ?? "markdown"),
});

const RichTextCopyImageDialog = ({forceCompress, descriptionSrcFormat, smileysEnabled}: Props) => {
    const {submitForm} = useFormikContext<RichTextCopyImageValues>();
    const {t} = useTranslation();

    return (
        <>
            <InputField name="url" title={t("link")} anyValue autoFocus/>
            {!forceCompress &&
                <CheckboxField title={t("compress-images")} name="compress" anyValue/>
            }
            <RichTextField
                name="description"
                format={descriptionSrcFormat ?? "markdown"}
                maxHeight="14em"
                className="mt-3"
                placeholder={t("description-optional")}
                smileysEnabled={smileysEnabled}
                noComplexBlocks
                noEmbeddedMedia
                noMedia
                noVideo
                anyValue
                submitKey="enter"
                onSubmit={submitForm}
            />
        </>
    );
}

export default richTextEditorDialog<Props, RichTextCopyImageValues>(
    "copy-image-from-internet", mapPropsToValues, RichTextCopyImageDialog);
