import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { PrincipalValue } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { getSettingNode } from "state/settings/selectors";
import {
    peopleSelectedFriendshipSetVisibility,
    peopleSelectedSubscriberSetVisibility,
    peopleSelectedSubscriptionSetVisibility
} from "state/people/actions";
import { closePeopleHideDialog } from "state/peoplehidedialog/actions";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField } from "ui/control/field";

interface OuterProps {
    nodeName: string | null;
    subscribersHidden: boolean;
    subscriptionsHidden: boolean;
    friendsHidden: boolean;
}

interface Values {
    hideMySubscription: boolean | null;
    hideSubscriptionToMe: boolean | null;
    hideFriend: boolean | null;
}

type Props = OuterProps & FormikProps<Values>;

function PeopleSelectedHideDialogInner({nodeName, subscribersHidden, subscriptionsHidden, friendsHidden}: Props) {
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
            dispatch(peopleSelectedSubscriptionSetVisibility(!values.hideMySubscription));
        }
        if (!subscribersHidden && values.hideSubscriptionToMe !== null) {
            dispatch(peopleSelectedSubscriberSetVisibility(!values.hideSubscriptionToMe));
        }
        if (!friendsHidden && values.hideFriend !== null) {
            dispatch(peopleSelectedFriendshipSetVisibility(!values.hideFriend));
        }
        dispatch(closePeopleHideDialog());
        formik.setSubmitting(false);
    }

};

const PeopleSelectedHideDialogOuter = withFormik(peopleSelectedHideDialogLogic)(PeopleSelectedHideDialogInner);

export default function PeopleSelectedHideDialog() {
    const nodeName = useSelector((state: ClientState) => state.peopleHideDialog.nodeName);
    const subscribersHidden = useSelector((state: ClientState) =>
        (getSettingNode(state, "subscribers.view") as PrincipalValue ?? "public") === "admin");
    const subscriptionsHidden = useSelector((state: ClientState) =>
        (getSettingNode(state, "subscriptions.view") as PrincipalValue ?? "public") === "admin");
    const friendsHidden = useSelector((state: ClientState) =>
        (getSettingNode(state, "friends.view") as PrincipalValue ?? "public") === "admin");

    return <PeopleSelectedHideDialogOuter nodeName={nodeName} subscribersHidden={subscribersHidden}
                                          subscriptionsHidden={subscriptionsHidden} friendsHidden={friendsHidden}/>;
}
