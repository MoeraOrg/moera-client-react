import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import {
    peopleSelectedFriendshipSetVisibility,
    peopleSelectedSubscriberSetVisibility,
    peopleSelectedSubscriptionSetVisibility
} from "state/people/actions";
import { closePeopleHideDialog } from "state/peoplehidedialog/actions";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField } from "ui/control/field";
import store from "state/store";

interface Values {
    hideMySubscription: boolean | null;
    hideSubscriptionToMe: boolean | null;
    hideFriend: boolean | null;
}

interface OuterProps {
    nodeName: string | null;
    subscribersHidden: boolean;
    subscriptionsHidden: boolean;
    friendsHidden: boolean;
}

type Props = OuterProps & FormikProps<Values>;

function PeopleSelectedHideDialog({nodeName, subscribersHidden, subscriptionsHidden, friendsHidden}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (nodeName != null) {
        return null;
    }

    const onClose = () => dispatch(closePeopleHideDialog());

    return (
        <ModalDialog title={t("hide")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    <CheckboxField title={t("hide-my-subscription")} name="hideMySubscription"
                                   disabled={subscriptionsHidden} anyValue/>
                    <CheckboxField title={t("hide-subscription-to-me")} name="hideSubscriptionToMe"
                                   disabled={subscribersHidden} anyValue/>
                    <CheckboxField title={t("hide-friendship")} name="hideFriend"
                                   disabled={friendsHidden} anyValue/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit">{t("ok")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const peopleSelectedHideDialogLogic = {

    mapPropsToValues: (): Values => ({
        hideMySubscription: null,
        hideSubscriptionToMe: null,
        hideFriend: null
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const {subscriptionsHidden, subscribersHidden, friendsHidden} = formik.props;

        formik.setStatus("submitted");
        if (!subscriptionsHidden && values.hideMySubscription !== null) {
            store.dispatch(peopleSelectedSubscriptionSetVisibility(!values.hideMySubscription));
        }
        if (!subscribersHidden && values.hideSubscriptionToMe !== null) {
            store.dispatch(peopleSelectedSubscriberSetVisibility(!values.hideSubscriptionToMe));
        }
        if (!friendsHidden && values.hideFriend !== null) {
            store.dispatch(peopleSelectedFriendshipSetVisibility(!values.hideFriend));
        }
        store.dispatch(closePeopleHideDialog());
        formik.setSubmitting(false);
    }

};

export default withFormik(peopleSelectedHideDialogLogic)(PeopleSelectedHideDialog);
