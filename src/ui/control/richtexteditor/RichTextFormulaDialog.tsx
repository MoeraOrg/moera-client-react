import React from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import cx from 'classnames';

import { InputField, TextField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextFormulaValues {
    math?: string;
    block: boolean;
}

type Props = RichTextEditorDialogProps<RichTextFormulaValues>;

const mapPropsToValues = (props: Props): RichTextFormulaValues => ({
    math: props.prevValues?.math,
    block: props.prevValues?.block ?? false
});

function RichTextFormulaDialog() {
    const {t} = useTranslation();

    const [, {value: block}, {setValue: setBlock}] = useField<boolean>("block");

    return (
        <>
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item" onClick={() => setBlock(false)}>
                    <span className={cx("nav-link", {"active": !block})} aria-current="page">
                        {t("inline-formula")}
                    </span>
                </li>
                <li className="nav-item" onClick={() => setBlock(true)}>
                    <span className={cx("nav-link", {"active": block})} aria-current="page">
                        {t("display-formula")}
                    </span>
                </li>
            </ul>
            {!block ?
                <InputField name="math" anyValue autoFocus/>
            :
                <TextField name="math" placeholder="" maxHeight="10em" rows={6} anyValue autoFocus/>
            }
        </>
    );
}

export default richTextEditorDialog<Props, RichTextFormulaValues>("formula", mapPropsToValues, RichTextFormulaDialog);
