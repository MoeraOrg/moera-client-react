import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { PrincipalValue, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getSettingNode } from "state/settings/selectors";
import { isPrincipalIn } from "state/node/selectors";
import { feedSubscriberSetVisibility, feedSubscriptionSetVisibility } from "state/feeds/actions";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField } from "ui/control/field";

interface Values {
    hideMySubscription: boolean;
    hideSubscriptionToMe: boolean;
}

interface OwnProps {
    feedName: string;
    subscriber: SubscriberInfo | null;
    subscription: SubscriptionInfo | null;
    onClose: () => void;
}

type OuterProps = OwnProps & ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<Values>;

function PeopleHideDialog({subscriber, subscription, subscribersHidden, subscriptionsHidden, onClose}: Props) {
    const {t} = useTranslation();

    return (
        <ModalDialog title={t("hide")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    {subscription != null &&
                        <CheckboxField title={t("hide-my-subscription")} name="hideMySubscription"
                                       disabled={subscriptionsHidden} anyValue/>
                    }
                    {subscriber != null &&
                        <CheckboxField title={t("hide-subscription-to-me")} name="hideSubscriptionToMe"
                                       disabled={subscribersHidden} anyValue/>
                    }
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit">{t("ok")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const subscribeHideDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        hideMySubscription: props.subscriptionsHidden || props.subscriptionHidden,
        hideSubscriptionToMe: props.subscribersHidden || props.subscriberHidden
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const {
            feedName, subscription, subscriptionsHidden, subscriptionHidden, subscriber, subscribersHidden,
            subscriberHidden, feedSubscriptionSetVisibility, feedSubscriberSetVisibility, onClose
        } = formik.props;

        formik.setStatus("submitted");
        if (subscription?.id != null && !subscriptionsHidden && values.hideMySubscription !== subscriptionHidden) {
            feedSubscriptionSetVisibility(subscription?.id, !values.hideMySubscription);
        }
        if (subscriber?.id != null && !subscribersHidden && values.hideSubscriptionToMe !== subscriberHidden) {
            feedSubscriberSetVisibility(subscriber?.id, feedName, !values.hideSubscriptionToMe);
        }
        onClose();
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        subscribersHidden: (getSettingNode(state, "subscribers.view") as PrincipalValue ?? "public") === "admin",
        subscriptionsHidden: (getSettingNode(state, "subscriptions.view") as PrincipalValue ?? "public") === "admin",
        subscriberHidden: isPrincipalIn("view", ownProps.subscriber, "unset", "private", {useOperations: "admin"}),
        subscriptionHidden: isPrincipalIn("view", ownProps.subscription, "public", "private"),
    }),
    { feedSubscriberSetVisibility, feedSubscriptionSetVisibility }
);

export default connector(withFormik(subscribeHideDialogLogic)(PeopleHideDialog));
