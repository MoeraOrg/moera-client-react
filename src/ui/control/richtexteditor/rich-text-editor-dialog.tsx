import React from 'react';
import { Form, FormikBag, FormikProps, FormikValues, withFormik } from 'formik';
import { WithTranslation, withTranslation } from 'react-i18next';

import { ModalDialog } from "ui/control/ModalDialog";
import { Button } from "ui/control/Button";

export interface RichTextEditorDialogProps<V> {
    show: boolean;
    risen?: boolean;
    onSubmit: (ok: boolean, values: Partial<V>) => void;
}

type OuterProps<P> = P & WithTranslation;

export function richTextEditorDialog<P extends RichTextEditorDialogProps<V>, V extends FormikValues>(
    title: string, mapPropsToValues: (props: OuterProps<P>) => V, DialogBody: React.ComponentType<OuterProps<P>>) {

    const logic = {
        mapPropsToValues,
        handleSubmit(values: V, formik: FormikBag<RichTextEditorDialogProps<V>, V>) {
            formik.props.onSubmit(true, values);
        }
    };

    type Props = OuterProps<P> & FormikProps<V>;

    const dialog = class extends React.PureComponent<Props> {

        componentDidUpdate(prevProps: Readonly<Props>) {
            if (this.props.show !== prevProps.show && this.props.show) {
                this.props.resetForm({
                    values: logic.mapPropsToValues(this.props),
                });
            }
        }

        onClose = () => {
            this.props.onSubmit(false, {});
        }

        render() {
            const {show, risen, t} = this.props;

            if (!show) {
                return null;
            }

            return (
                <ModalDialog title={t(title)} onClose={this.onClose} risen={risen}>
                    <Form>
                        <div className="modal-body">
                            <DialogBody {...this.props}/>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={this.onClose}>{t("cancel")}</Button>
                            <Button variant="primary" type="submit">{t("ok")}</Button>
                        </div>
                    </Form>
                </ModalDialog>
            );
        }

    }

    return withTranslation()(withFormik(logic)(dialog));
}
