import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { FriendGroupDetails, PrincipalValue, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getSettingNode } from "state/settings/selectors";
import { isPrincipalIn } from "state/node/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { feedSubscriberSetVisibility, feedSubscriptionSetVisibility } from "state/feeds/actions";
import { friendshipSetVisibility } from "state/people/actions";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField } from "ui/control/field";

interface Values {
    hideMySubscription: boolean;
    hideSubscriptionToMe: boolean;
    hideFriend: boolean;
}

interface OwnProps {
    nodeName: string;
    feedName: string;
    onClose: () => void;
}

type OuterProps = OwnProps & ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<Values>;

function PeopleHideDialog({card, subscribersHidden, subscriptionsHidden, friendsHidden, onClose}: Props) {
    const {t} = useTranslation();

    return (
        <ModalDialog title={t("hide")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    {card?.subscription.subscription != null &&
                        <CheckboxField title={t("hide-my-subscription")} name="hideMySubscription"
                                       disabled={subscriptionsHidden} anyValue/>
                    }
                    {card?.subscription.subscriber != null &&
                        <CheckboxField title={t("hide-subscription-to-me")} name="hideSubscriptionToMe"
                                       disabled={subscribersHidden} anyValue/>
                    }
                    {(card?.friendship.groups != null && card.friendship.groups.length > 0) &&
                        <CheckboxField title={t("hide-friendship")} name="hideFriend"
                                       disabled={friendsHidden} anyValue/>
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

    isSubscriptionHidden: (subscription: SubscriptionInfo | null | undefined) =>
        isPrincipalIn("view", subscription ?? null, "public", "private"),

    isSubscriberHidden: (subscriber: SubscriberInfo | null | undefined) =>
        isPrincipalIn("view", subscriber ?? null, "unset", "private", {useOperations: "admin"}),

    isFriendHidden: (friendGroups: FriendGroupDetails[] | null | undefined) =>
        friendGroups != null && friendGroups.length > 0 && isPrincipalIn("view", friendGroups[0], "public", "private"),

    mapPropsToValues: (props: OuterProps): Values => ({
        hideMySubscription: props.subscriptionsHidden
            || subscribeHideDialogLogic.isSubscriptionHidden(props.card?.subscription.subscription),
        hideSubscriptionToMe: props.subscribersHidden
            || subscribeHideDialogLogic.isSubscriberHidden(props.card?.subscription.subscriber),
        hideFriend: props.friendsHidden
            || subscribeHideDialogLogic.isFriendHidden(props.card?.friendship.groups)
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const {
            nodeName, feedName, card, subscriptionsHidden, subscribersHidden, friendsHidden,
            feedSubscriptionSetVisibility, feedSubscriberSetVisibility, friendshipSetVisibility, onClose
        } = formik.props;

        const subscription = card?.subscription.subscription;
        const subscriber = card?.subscription.subscriber;
        const friendGroups = card?.friendship.groups;

        formik.setStatus("submitted");
        if (subscription?.id != null && !subscriptionsHidden
                && values.hideMySubscription !== subscribeHideDialogLogic.isSubscriptionHidden(subscription)) {
            feedSubscriptionSetVisibility(subscription?.id, !values.hideMySubscription);
        }
        if (subscriber?.id != null && !subscribersHidden
                && values.hideSubscriptionToMe !== subscribeHideDialogLogic.isSubscriberHidden(subscriber)) {
            feedSubscriberSetVisibility(subscriber?.id, feedName, !values.hideSubscriptionToMe);
        }
        if (friendGroups != null && friendGroups.length > 0 && !friendsHidden
                && values.hideFriend !== subscribeHideDialogLogic.isFriendHidden(friendGroups)) {
            friendshipSetVisibility(nodeName, !values.hideFriend);
        }
        onClose();
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        card: getNodeCard(state, ownProps.nodeName),
        subscribersHidden: (getSettingNode(state, "subscribers.view") as PrincipalValue ?? "public") === "admin",
        subscriptionsHidden: (getSettingNode(state, "subscriptions.view") as PrincipalValue ?? "public") === "admin",
        friendsHidden: (getSettingNode(state, "friends.view") as PrincipalValue ?? "public") === "admin"
    }),
    { feedSubscriberSetVisibility, feedSubscriptionSetVisibility, friendshipSetVisibility }
);

export default connector(withFormik(subscribeHideDialogLogic)(PeopleHideDialog));
