import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { PrincipalValue } from "api";
import { ClientState } from "state/state";
import { getSettingNode } from "state/settings/selectors";
import {
    peopleSelectedFriendshipSetVisibility,
    peopleSelectedSubscriberSetVisibility,
    peopleSelectedSubscriptionSetVisibility
} from "state/people/actions";
import { closePeopleHideDialog } from "state/peoplehidedialog/actions";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField } from "ui/control/field";

interface Values {
    hideMySubscription: boolean | null;
    hideSubscriptionToMe: boolean | null;
    hideFriend: boolean | null;
}

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<Values>;

function PeopleSelectedHideDialog(props: Props) {
    const {
        show, nodeName, subscribersHidden, subscriptionsHidden, friendsHidden, closePeopleHideDialog, resetForm
    } = props;
    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            resetForm({values: peopleSelectedHideDialogLogic.mapPropsToValues()});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]); // 'props' are missing on purpose

    if (!show || nodeName != null) {
        return null;
    }

    return (
        <ModalDialog title={t("hide")} onClose={closePeopleHideDialog}>
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
                    <Button variant="secondary" onClick={closePeopleHideDialog}>{t("cancel")}</Button>
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
        const {
            subscriptionsHidden, subscribersHidden, friendsHidden, peopleSelectedSubscriptionSetVisibility,
            peopleSelectedSubscriberSetVisibility, peopleSelectedFriendshipSetVisibility, closePeopleHideDialog
        } = formik.props;

        formik.setStatus("submitted");
        if (!subscriptionsHidden && values.hideMySubscription !== null) {
            peopleSelectedSubscriptionSetVisibility(!values.hideMySubscription);
        }
        if (!subscribersHidden && values.hideSubscriptionToMe !== null) {
            peopleSelectedSubscriberSetVisibility(!values.hideSubscriptionToMe);
        }
        if (!friendsHidden && values.hideFriend !== null) {
            peopleSelectedFriendshipSetVisibility(!values.hideFriend);
        }
        closePeopleHideDialog();
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.peopleHideDialog.show,
        nodeName: state.peopleHideDialog.nodeName,
        subscribersHidden: (getSettingNode(state, "subscribers.view") as PrincipalValue ?? "public") === "admin",
        subscriptionsHidden: (getSettingNode(state, "subscriptions.view") as PrincipalValue ?? "public") === "admin",
        friendsHidden: (getSettingNode(state, "friends.view") as PrincipalValue ?? "public") === "admin"
    }),
    {
        peopleSelectedSubscriberSetVisibility, peopleSelectedSubscriptionSetVisibility,
        peopleSelectedFriendshipSetVisibility, closePeopleHideDialog
    }
);

export default connector(withFormik(peopleSelectedHideDialogLogic)(PeopleSelectedHideDialog));
