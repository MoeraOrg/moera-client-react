import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { createSelector } from 'reselect';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { openAskDialog } from "state/askdialog/actions";
import { openPeopleHideDialog } from "state/peoplehidedialog/actions";
import { openFriendGroupsDialog } from "state/friendgroupsdialog/actions";
import {
    peopleSelectedFriend,
    peopleSelectedSubscribe,
    peopleSelectedUnfriend,
    peopleSelectedUnsubscribe
} from "state/people/actions";
import { DropdownMenu } from "ui/control";

export default function PeopleSelectedButton() {
    const totalSelected = useSelector(getTotalSelected);
    const summary = useSelector(getSelectedSummary);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (totalSelected <= 0) {
        return null;
    }

    const onSubscribe = () => dispatch(peopleSelectedSubscribe());

    const onUnsubscribe = () => dispatch(peopleSelectedUnsubscribe());

    const onAddFriend = () => dispatch(peopleSelectedFriend());

    const onFriendGroups = () => dispatch(openFriendGroupsDialog(null));

    const onUnfriend = () => dispatch(peopleSelectedUnfriend());

    const onAskDialog = () => dispatch(openAskDialog(null, totalSelected));

    const onHideDialog = () => dispatch(openPeopleHideDialog(null, null));

    return (
        <DropdownMenu className="btn btn-sm btn-primary ms-1" items={[
            {
                title: t("subscribe"),
                nodeName: "",
                href: "/people",
                onClick: onSubscribe,
                show: summary.notSubscribed
            },
            {
                title: t("unsubscribe"),
                nodeName: "",
                href: "/people",
                onClick: onUnsubscribe,
                show: summary.subscribed
            },
            {
                divider: true
            },
            {
                title: t("add-friend"),
                nodeName: "",
                href: "/people",
                onClick: onAddFriend,
                show: summary.notFriends
            },
            {
                title: t("friend-groups"),
                nodeName: "",
                href: "/people",
                onClick: onFriendGroups,
                show: summary.friends
            },
            {
                title: t("unfriend"),
                nodeName: "",
                href: "/people",
                onClick: onUnfriend,
                show: summary.friends
            },
            {
                divider: true
            },
            {
                title: t("ask-ellipsis"),
                nodeName: "",
                href: "/people",
                onClick: onAskDialog,
                show: summary.notSubscribedToMe || summary.notFriendOfs
            },
            {
                title: t("hide-ellipsis"),
                nodeName: "",
                href: "/people",
                onClick: onHideDialog,
                show: summary.subscribed || summary.subscribedToMe || summary.friends
            }
        ]}>
            {t("count-selected", {count: totalSelected}) + " "}
            <FontAwesomeIcon icon={faChevronDown}/>
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
    notSubscribedToMe: boolean;
    friends: boolean;
    notFriends: boolean;
    notFriendOfs: boolean;
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
                notSubscribedToMe: summary.notSubscribedToMe || contact.contact.hasFeedSubscriber !== true,
                friends: summary.friends || contact.contact.hasFriend === true,
                notFriends: summary.notFriends || contact.contact.hasFriend !== true,
                notFriendOfs: summary.notFriendOfs || contact.contact.hasFriendOf !== true
            }
        },
        {
            subscribed: false,
            notSubscribed: false,
            subscribedToMe: false,
            notSubscribedToMe: false,
            friends: false,
            notFriends: false,
            notFriendOfs: false
        }
    )
);
