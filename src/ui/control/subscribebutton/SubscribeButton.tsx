import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { feedSubscribe, feedUnsubscribe } from "state/feeds/actions";
import { friendshipUpdate } from "state/people/actions";
import { openFriendGroupsDialog } from "state/friendgroupsdialog/actions";
import { openAskDialog } from "state/askdialog/actions";
import { openPeopleHideDialog } from "state/peoplehidedialog/actions";
import { getHomeFriendsId, getHomeOwnerGender } from "state/home/selectors";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { Button, DropdownMenu } from "ui/control";
import { tGender } from "i18n";
import "./SubscribeButton.css";

interface OwnProps {
    small?: boolean | null;
    nodeName: string;
    feedName: string;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function SubscribeButtonImpl({
    small, nodeName, feedName, card, homeGender, peerHref, friendsId, feedSubscribe, feedUnsubscribe, friendshipUpdate,
    openFriendGroupsDialog, openAskDialog, openPeopleHideDialog
}: Props) {
    const subscribing = card?.subscription?.subscribing ?? false;
    const unsubscribing = card?.subscription?.unsubscribing ?? false;
    const subscriber = card?.subscription?.subscriber;
    const subscription = card?.subscription?.subscription;
    const friendGroups = card?.friendship?.groups;
    const remoteFriendGroups = card?.friendship?.remoteGroups;
    const updatingFriendship = card?.friendship?.updating;

    const {t} = useTranslation();

    const onSubscribe = () => feedSubscribe(nodeName, feedName);

    const onUnsubscribe = () => {
        if (subscription != null) {
            feedUnsubscribe(nodeName, feedName, subscription.id);
        }
    }

    const onAddFriend = () => {
        if (friendsId != null) {
            friendshipUpdate(nodeName, [friendsId]);
        }
    }

    const onFriendGroups = () => openFriendGroupsDialog(nodeName);

    const onUnfriend = () => friendshipUpdate(nodeName, null);

    const onAskDialog = () => openAskDialog(nodeName);

    const onHideDialog = () => openPeopleHideDialog(nodeName, feedName);

    const subscribed = subscription != null;
    const subscribedToMe = subscriber != null;
    const friend = friendGroups != null && friendGroups.length > 0;
    const friendOf = remoteFriendGroups != null && remoteFriendGroups.length > 0;
    const friendIcon = friend
        ? (friendOf ? "people-arrows" : "person")
        : (friendOf ? "person-walking-arrow-right" : null)
    const friendCaption = friend
        ? (friendOf ? t("mutual-friends") : t("friend"))
        : (friendOf ? t("in-friends") : null)

    const loading = (!subscribed ? subscribing : unsubscribing) || updatingFriendship;
    if (loading) {
        return <Button variant="outline-primary" size="sm" className="subscribe-button" loading={loading}/>;
    }

    const subscriptionCaption = !subscribed
        ? (!subscribedToMe ? t("subscribe") : t("subscribed-to-me", {"gender": tGender(subscriber?.contact?.gender)}))
        : (!subscribedToMe ? t("subscribed", {"gender": tGender(homeGender)}) : t("mutually-subscribed"));

    return (
        <>
            <DropdownMenu className="btn btn-sm btn-outline-primary subscribe-button" items={[
                {
                    caption: subscriptionCaption,
                    show: small ?? false
                },
                {
                    title: !subscribedToMe ? t("subscribe") : t("subscribe-back"),
                    href: peerHref,
                    onClick: onSubscribe,
                    show: !subscribed
                },
                {
                    title: t("unsubscribe"),
                    href: peerHref,
                    onClick: onUnsubscribe,
                    show: subscribed
                },
                {
                    divider: true
                },
                {
                    caption: friendCaption ?? "",
                    show: friendCaption != null
                },
                {
                    title: t("add-friend"),
                    href: peerHref,
                    onClick: onAddFriend,
                    show: !friend
                },
                {
                    title: t("friend-groups"),
                    href: peerHref,
                    onClick: onFriendGroups,
                    show: friend
                },
                {
                    title: t("unfriend"),
                    href: peerHref,
                    onClick: onUnfriend,
                    show: friend
                },
                {
                      divider: true
                },
                {
                    title: t("ask-ellipsis"),
                    href: peerHref,
                    onClick: onAskDialog,
                    show: true
                },
                {
                    title: t("hide-ellipsis"),
                    href: peerHref,
                    onClick: onHideDialog,
                    show: subscribed || subscribedToMe
                }
            ]}>
                {friendIcon && <><FontAwesomeIcon icon={friendIcon}/>&nbsp;</>}
                {small ? <FontAwesomeIcon icon={["far", "bell"]}/> : subscriptionCaption}
                &nbsp;&nbsp;
                <FontAwesomeIcon icon="chevron-down"/>
            </DropdownMenu>
        </>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        card: getNodeCard(state, ownProps.nodeName),
        homeGender: getHomeOwnerGender(state),
        peerHref: getNamingNameNodeUri(state, ownProps.nodeName),
        friendsId: getHomeFriendsId(state)
    }),
    { feedSubscribe, feedUnsubscribe, friendshipUpdate, openFriendGroupsDialog, openAskDialog, openPeopleHideDialog }
);

export const SubscribeButton = connector(SubscribeButtonImpl);
