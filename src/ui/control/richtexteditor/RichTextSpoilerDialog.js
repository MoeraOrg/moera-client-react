import React from 'react';
import { Form, withFormik } from 'formik';

import { ModalDialog } from "ui/control/ModalDialog";
import { Button } from "ui/control/Button";
import { InputField } from "ui/control/field";

class RichTextSpoilerDialog extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show !== prevProps.show && this.props.show) {
            this.props.resetForm({
                values: richTextSpoilerDialogLogic.mapPropsToValues(this.props),
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
            <ModalDialog title="Spoiler" onClose={this.onClose}>
                <Form>
                    <div className="modal-body sign-up-dialog">
                        <InputField name="title" title="Alert text" placeholder="spoiler!" autoFocus/>
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

const richTextSpoilerDialogLogic = {

    mapPropsToValues(props) {
        return {
            title: props.title ?? ""
        }
    },

    handleSubmit(values, formik) {
        formik.props.onSubmit(true, values);
    }

};

export default withFormik(richTextSpoilerDialogLogic)(RichTextSpoilerDialog);
