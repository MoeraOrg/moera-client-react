import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { fromUnixTime, getUnixTime } from 'date-fns';

import { ClientState } from "state/state";
import { closeChangeDateDialog, storyChangeDate } from "state/changedatedialog/actions";
import { Button, ModalDialog } from "ui/control";
import { DateTimeField } from "ui/control/field";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    publishedAt: Date;
}

type Props = OuterProps & FormikProps<Values>;

class ChangeDateDialog extends React.PureComponent<Props> {

    componentDidUpdate(prevProps: Readonly<Props>) {
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

    mapPropsToValues(props: OuterProps): Values {
        return {
            publishedAt: fromUnixTime(props.publishedAt)
        }
    },

    validationSchema: yup.object().shape({
        publishedAt: yup.date()
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        console.log(formik.props.storyId, values.publishedAt);
        if (formik.props.storyId != null) {
            formik.props.storyChangeDate(formik.props.storyId, getUnixTime(values.publishedAt));
        }
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.changeDateDialog.show,
        storyId: state.changeDateDialog.storyId,
        publishedAt: state.changeDateDialog.publishedAt,
        changing: state.changeDateDialog.changing
    }),
    { closeChangeDateDialog, storyChangeDate }
);

export default connector(withFormik(changeDateDialogLogic)(ChangeDateDialog));
