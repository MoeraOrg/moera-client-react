import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { FriendGroupDetails, PrincipalValue, SubscriberInfo, SubscriptionInfo } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { isPrincipalIn } from "state/node/selectors";
import { getSettingNode } from "state/settings/selectors";
import { feedSubscriberSetVisibility, feedSubscriptionSetVisibility } from "state/feeds/actions";
import { NodeCardState } from "state/nodecards/state";
import { getNodeCard } from "state/nodecards/selectors";
import { friendshipSetVisibility } from "state/people/actions";
import { closePeopleHideDialog } from "state/peoplehidedialog/actions";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField } from "ui/control/field";

interface Values {
    hideMySubscription: boolean;
    hideSubscriptionToMe: boolean;
    hideFriend: boolean;
}

interface OuterProps {
    nodeName: string | null;
    feedName: string | null;
    card: NodeCardState | null;
    subscribersHidden: boolean;
    subscriptionsHidden: boolean;
    friendsHidden: boolean;
}

type Props = OuterProps & FormikProps<Values>;

function PeopleHideDialogInner({nodeName, card, subscribersHidden, subscriptionsHidden, friendsHidden}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (nodeName == null) {
        return null;
    }

    const onClose = () => dispatch(closePeopleHideDialog());

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

const peopleHideDialogLogic = {

    isSubscriptionHidden: (subscription: SubscriptionInfo | null | undefined) =>
        isPrincipalIn("view", subscription ?? null, "public", "private"),

    isSubscriberHidden: (subscriber: SubscriberInfo | null | undefined) =>
        isPrincipalIn("view", subscriber ?? null, "unset", "private", {useOperations: "admin"}),

    isFriendHidden: (friendGroups: FriendGroupDetails[] | null | undefined) =>
        friendGroups != null && friendGroups.length > 0 && isPrincipalIn("view", friendGroups[0], "public", "private"),

    mapPropsToValues: (props: OuterProps): Values => ({
        hideMySubscription: props.subscriptionsHidden
            || peopleHideDialogLogic.isSubscriptionHidden(props.card?.subscription.subscription),
        hideSubscriptionToMe: props.subscribersHidden
            || peopleHideDialogLogic.isSubscriberHidden(props.card?.subscription.subscriber),
        hideFriend: props.friendsHidden
            || peopleHideDialogLogic.isFriendHidden(props.card?.friendship.groups)
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const {nodeName, feedName, card, subscriptionsHidden, subscribersHidden, friendsHidden} = formik.props;

        const subscription = card?.subscription.subscription;
        const subscriber = card?.subscription.subscriber;
        const friendGroups = card?.friendship.groups;

        formik.setStatus("submitted");
        if (subscription?.id != null && !subscriptionsHidden
                && values.hideMySubscription !== peopleHideDialogLogic.isSubscriptionHidden(subscription)) {
            dispatch(feedSubscriptionSetVisibility(subscription?.id, !values.hideMySubscription));
        }
        if (subscriber?.id != null && !subscribersHidden && feedName != null
                && values.hideSubscriptionToMe !== peopleHideDialogLogic.isSubscriberHidden(subscriber)) {
            dispatch(feedSubscriberSetVisibility(subscriber?.id, feedName, !values.hideSubscriptionToMe));
        }
        if (friendGroups != null && friendGroups.length > 0 && !friendsHidden && nodeName != null
                && values.hideFriend !== peopleHideDialogLogic.isFriendHidden(friendGroups)) {
            dispatch(friendshipSetVisibility(nodeName, !values.hideFriend));
        }
        dispatch(closePeopleHideDialog());
        formik.setSubmitting(false);
    }

};

const PeopleHideDialogOuter = withFormik(peopleHideDialogLogic)(PeopleHideDialogInner);

export default function PeopleHideDialog() {
    const nodeName = useSelector((state: ClientState) => state.peopleHideDialog.nodeName);
    const feedName = useSelector((state: ClientState) => state.peopleHideDialog.feedName);
    const card = useSelector((state: ClientState) => getNodeCard(state, state.peopleHideDialog.nodeName));
    const subscribersHidden = useSelector((state: ClientState) =>
        (getSettingNode(state, "subscribers.view") as PrincipalValue ?? "public") === "admin");
    const subscriptionsHidden = useSelector((state: ClientState) =>
        (getSettingNode(state, "subscriptions.view") as PrincipalValue ?? "public") === "admin");
    const friendsHidden = useSelector((state: ClientState) =>
        (getSettingNode(state, "friends.view") as PrincipalValue ?? "public") === "admin");

    return <PeopleHideDialogOuter nodeName={nodeName} feedName={feedName} card={card}
                                  subscribersHidden={subscribersHidden} subscriptionsHidden={subscriptionsHidden}
                                  friendsHidden={friendsHidden}/>;
}
