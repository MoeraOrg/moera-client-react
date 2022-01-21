import React from 'react';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';

import { ModalDialog } from "ui/control/ModalDialog";
import { Button } from "ui/control/Button";

export interface RichTextEditorDialogProps<V> {
    show: boolean;
    risen?: boolean;
    onSubmit: (ok: boolean, values: Partial<V>) => void;
}

export function richTextEditorDialog<P extends RichTextEditorDialogProps<V>, V>(
    title: string, mapPropsToValues: (props: P) => V, DialogBody: React.ComponentType<P>) {

    const logic = {
        mapPropsToValues,
        handleSubmit(values: V, formik: FormikBag<RichTextEditorDialogProps<V>, V>) {
            formik.props.onSubmit(true, values);
        }
    };

    type Props = P & FormikProps<V>;

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
            const {show, risen} = this.props;

            if (!show) {
                return null;
            }

            return (
                <ModalDialog title={title} onClose={this.onClose} risen={risen}>
                    <Form>
                        <div className="modal-body">
                            <DialogBody {...this.props}/>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={this.onClose}>Cancel</Button>
                            <Button variant="primary" type="submit">OK</Button>
                        </div>
                    </Form>
                </ModalDialog>
            );
        }

    }

    return withFormik(logic)(dialog);
}
