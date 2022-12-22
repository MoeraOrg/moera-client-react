import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createSelector } from 'reselect';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { DropdownMenu } from "ui/control";
import { peopleSelectedSubscribe } from "state/people/actions";

type Props = ConnectedProps<typeof connector>;

function PeopleSelectedButton({totalSelected, summary, proceeding, peopleSelectedSubscribe}: Props) {
    const {t} = useTranslation();

    if (totalSelected <= 0) {
        return null;
    }

    const onSubscribe = () => peopleSelectedSubscribe();

    const onUnsubscribe = () => {};

    const onAddFriend = () => {};

    const onFriendGroups = () => {};

    const onUnfriend = () => {};

    const onAskDialog = () => {};

    const onHideDialog = () => {};

    return (
        <DropdownMenu className="btn btn-sm btn-primary ms-1" disabled={proceeding} items={[
            {
                title: t("subscribe"),
                href: "/people",
                onClick: onSubscribe,
                show: summary.notSubscribed
            },
            {
                title: t("unsubscribe"),
                href: "/people",
                onClick: onUnsubscribe,
                show: summary.subscribed
            },
            {
                divider: true
            },
            {
                title: t("add-friend"),
                href: "/people",
                onClick: onAddFriend,
                show: summary.notFriends
            },
            {
                title: t("friend-groups"),
                href: "/people",
                onClick: onFriendGroups,
                show: summary.friends
            },
            {
                title: t("unfriend"),
                href: "/people",
                onClick: onUnfriend,
                show: summary.friends
            },
            {
                divider: true
            },
            {
                title: t("ask-ellipsis"),
                href: "/people",
                onClick: onAskDialog,
                show: true
            },
            {
                title: t("hide-ellipsis"),
                href: "/people",
                onClick: onHideDialog,
                show: summary.subscribed || summary.subscribedToMe || summary.friends
            }
        ]}>
            {t("count-selected", {count: totalSelected}) + " "}
            <FontAwesomeIcon icon="chevron-down"/>
        </DropdownMenu>
    )
}

const getTotalSelected = createSelector(
    (state: ClientState) => state.people.selected,
    selected => Object.values(selected).reduce((count, v) => count + (v ? 1 : 0), 0)
);

interface SelectedSummary {
    subscribed: boolean;
    notSubscribed: boolean;
    subscribedToMe: boolean;
    friends: boolean;
    notFriends: boolean;
}

const getSelectedSummary = createSelector(
    [
        (state: ClientState) => state.people.selected,
        (state: ClientState) => state.people.contacts
    ],
    (selected, contacts) => Object.entries(selected).reduce(
        (summary: SelectedSummary, [nodeName, sl]): SelectedSummary => {
            const contact = contacts[nodeName];
            if (!sl || contact == null) {
                return summary;
            }
            return {
                subscribed: summary.subscribed || contact.contact.hasFeedSubscription === true,
                notSubscribed: summary.notSubscribed || contact.contact.hasFeedSubscription !== true,
                subscribedToMe: summary.subscribedToMe || contact.contact.hasFeedSubscriber === true,
                friends: summary.friends || contact.contact.hasFriend === true,
                notFriends: summary.notFriends || contact.contact.hasFriend !== true
            }
        },
        {
            subscribed: false,
            notSubscribed: false,
            subscribedToMe: false,
            friends: false,
            notFriends: false
        }
    )
);

const connector = connect(
    (state: ClientState) => ({
        totalSelected: getTotalSelected(state),
        summary: getSelectedSummary(state),
        proceeding: state.people.selectedProceeding
    }),
    { peopleSelectedSubscribe }
);

export default connector(PeopleSelectedButton);
