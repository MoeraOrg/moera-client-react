import React from 'react';
import { Form, FormikBag, FormikValues, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ModalDialog } from "ui/control/ModalDialog";
import { Button } from "ui/control/Button";

export interface RichTextEditorDialogProps<V> {
    risen?: boolean;
    onSubmit: (ok: boolean, values: Partial<V>) => void;
}

export function richTextEditorDialog<P extends RichTextEditorDialogProps<V>, V extends FormikValues>(
    title: string,
    mapPropsToValues: (props: P) => V,
    DialogBody: React.ComponentType<P>
) {
    const logic = {
        mapPropsToValues,
        handleSubmit(values: V, formik: FormikBag<RichTextEditorDialogProps<V>, V>) {
            formik.props.onSubmit(true, values);
        }
    };

    const dialog = function (props: P) {
        const {risen, onSubmit} = props;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const {t} = useTranslation();

        const onClose = () => onSubmit(false, {});

        return (
            <ModalDialog title={t(title)} onClose={onClose} risen={risen}>
                <Form>
                    <div className="modal-body">
                        <DialogBody {...props}/>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                        <Button variant="primary" type="submit">{t("ok")}</Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }

    return withFormik(logic)(dialog);
}
