import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import moment from 'moment';

import { closeChangeDateDialog, storyChangeDate } from "state/changedatedialog/actions";
import { Button, ModalDialog } from "ui/control";
import { DateTimeField } from "ui/control/field";

class ChangeDateDialog extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.publishedAt !== prevProps.publishedAt) {
            const values = changeDateDialogLogic.mapPropsToValues(this.props);
            this.props.resetForm({values});
        }
    }

    render() {
        const {show, changing, closeChangeDateDialog} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog title="Change Date/Time" onClose={closeChangeDateDialog}>
                <Form>
                    <div className="modal-body">
                        <DateTimeField name="publishedAt" horizontal={true} groupClassName="pl-4"/>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={closeChangeDateDialog}>Cancel</Button>
                        <Button variant="primary" type="submit" loading={changing}>Change</Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }

}

const changeDateDialogLogic = {

    mapPropsToValues(props) {
        return {
            publishedAt: moment.unix(props.publishedAt).toDate()
        }
    },

    handleSubmit(values, formik) {
        formik.props.storyChangeDate(formik.props.storyId, moment(values.publishedAt).unix());
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        show: state.changeDateDialog.show,
        storyId: state.changeDateDialog.storyId,
        publishedAt: state.changeDateDialog.publishedAt,
        changing: state.changeDateDialog.changing
    }),
    { closeChangeDateDialog, storyChangeDate }
)(withFormik(changeDateDialogLogic)(ChangeDateDialog));
