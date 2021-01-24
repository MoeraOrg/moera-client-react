import React from 'react';
import { Form, withFormik } from 'formik';

import { ModalDialog } from "ui/control/ModalDialog";
import { Button } from "ui/control/Button";

export function richTextEditorDialog(title, mapPropsToValues, DialogBody) {
    const logic = {
        mapPropsToValues,
        handleSubmit(values, formik) {
            formik.props.onSubmit(true, values);
        }
    };

    const dialog = class extends React.PureComponent {

        componentDidUpdate(prevProps, prevState, snapshot) {
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
            const {show} = this.props;

            if (!show) {
                return null;
            }

            return (
                <ModalDialog title={title} onClose={this.onClose}>
                    <Form>
                        <div className="modal-body sign-up-dialog">
                            <DialogBody/>
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
