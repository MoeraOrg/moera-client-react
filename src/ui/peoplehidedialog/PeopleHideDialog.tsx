import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { FriendGroupDetails, SubscriberInfo, SubscriptionInfo } from "api";
import { isPrincipalIn } from "state/node/selectors";
import { feedSubscriberSetVisibility, feedSubscriptionSetVisibility } from "state/feeds/actions";
import { NodeCardState } from "state/nodecards/state";
import { friendshipSetVisibility } from "state/people/actions";
import { closePeopleHideDialog } from "state/peoplehidedialog/actions";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField } from "ui/control/field";
import store from "state/store";

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

function PeopleHideDialog({nodeName, card, subscribersHidden, subscriptionsHidden, friendsHidden}: Props) {
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
            store.dispatch(feedSubscriptionSetVisibility(subscription?.id, !values.hideMySubscription));
        }
        if (subscriber?.id != null && !subscribersHidden && feedName != null
                && values.hideSubscriptionToMe !== peopleHideDialogLogic.isSubscriberHidden(subscriber)) {
            store.dispatch(feedSubscriberSetVisibility(subscriber?.id, feedName, !values.hideSubscriptionToMe));
        }
        if (friendGroups != null && friendGroups.length > 0 && !friendsHidden && nodeName != null
                && values.hideFriend !== peopleHideDialogLogic.isFriendHidden(friendGroups)) {
            store.dispatch(friendshipSetVisibility(nodeName, !values.hideFriend));
        }
        store.dispatch(closePeopleHideDialog());
        formik.setSubmitting(false);
    }

};

export default withFormik(peopleHideDialogLogic)(PeopleHideDialog);
