import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ClientState } from "state/state";
import { getOwnerName, isPrincipalIn } from "state/node/selectors";
import { feedSubscribe, feedUnsubscribe } from "state/feeds/actions";
import { friendshipUpdate } from "state/people/actions";
import { openFriendGroupsDialog } from "state/friendgroupsdialog/actions";
import { openAskDialog } from "state/askdialog/actions";
import { openPeopleHideDialog } from "state/peoplehidedialog/actions";
import { openBlockDialog } from "state/blockdialog/actions";
import { getHomeFriendsId, getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { isFeedSheriff, isFeedSheriffProhibited } from "state/feeds/selectors";
import { openSheriffOrderDialog, sheriffOrderDelete } from "state/sherifforderdialog/actions";
import { confirmBox } from "state/confirmbox/actions";
import { Button, DropdownMenu } from "ui/control";
import { tGender } from "i18n";
import "./SubscribeButton.css";
import { NodeName } from "api";

interface OwnProps {
    small?: boolean | null;
    nodeName: string;
    feedName: string;
    onDialogOpened?: () => void;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function SubscribeButtonImpl({
    small, nodeName, feedName, onDialogOpened, card, homeGender, peerHref, friendsId, ownerName, googlePlayGoverned,
    googlePlaySheriff, googlePlayProhibited, feedSubscribe, feedUnsubscribe, friendshipUpdate, openFriendGroupsDialog,
    openAskDialog, openPeopleHideDialog, openBlockDialog, openSheriffOrderDialog, confirmBox
}: Props) {
    const fullName = card?.details.profile.fullName ?? null;
    const blogName = fullName || NodeName.shorten(nodeName);
    const subscribing = card?.subscription?.subscribing ?? false;
    const unsubscribing = card?.subscription?.unsubscribing ?? false;
    const subscriber = card?.subscription?.subscriber;
    const subscription = card?.subscription?.subscription;
    const friendGroups = card?.friendship?.groups;
    const remoteFriendGroups = card?.friendship?.remoteGroups;
    const updatingFriendship = card?.friendship?.updating;
    const blockedList = card?.blocking?.blocked;
    const blockedByList = card?.blocking?.blockedBy;

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

    const onBlockDialog = () => openBlockDialog(nodeName, fullName, null, null, blockedList ?? []);

    const onHideInGooglePlay = () =>
        openSheriffOrderDialog(nodeName, fullName, "timeline", null, null, "");

    const onUnhideInGooglePlay = () => {
        confirmBox(t("unhide-blog-google-play", {"name": blogName}), t("unhide"), t("cancel"),
            sheriffOrderDelete(nodeName, "timeline", null, null), null, "success");
    };

    const subscribed = subscription != null;
    const subscribedToMe = subscriber != null;

    const loading = (!subscribed ? subscribing : unsubscribing) || updatingFriendship;
    if (loading) {
        return <Button variant="outline-primary" size="sm" className="subscribe-button" loading={loading}/>;
    }

    const subscriptionIcon: IconProp | null = subscribed
        ? (subscribedToMe ? "arrow-right-arrow-left" : "eye")
        : (subscribedToMe ? "arrows-to-eye" : null)
    const subscriptionCaption = subscribed
        ? (subscribedToMe ? t("mutually-subscribed") : t("subscribed", {"gender": tGender(homeGender)}))
        : (subscribedToMe ? t("subscribed-to-me", {"gender": tGender(subscriber?.contact?.gender)}) : null);

    const friend = friendGroups != null && friendGroups.length > 0;
    const friendOf = remoteFriendGroups != null && remoteFriendGroups.length > 0;
    const friendIcon: IconProp | null = friend
        ? (friendOf ? "people-arrows" : "person")
        : (friendOf ? "person-walking-arrow-right" : null)
    const friendCaption = friend
        ? (friendOf ? t("mutual-friends") : t("friend"))
        : (friendOf ? t("in-friends") : null)

    const blocked = blockedList != null && blockedList.length > 0;
    const blockedBy = blockedByList != null && blockedByList.length > 0;
    const blockedIcon: IconProp | null = blocked
        ? "ban"
        : (blockedBy ? "handcuffs" : null)
    const blockedCaption = blocked
        ? t("blocked")
        : (blockedBy ? t("in-blocked") : null)

    return (
        <>
            <DropdownMenu className={cx(
                ["btn", "btn-sm", "subscribe-button"],
                {"btn-outline-primary": !blocked && !blockedBy, "btn-outline-danger": blocked || blockedBy}
            )} items={[
                {
                    caption: subscriptionCaption ?? t("not-subscribed", {"gender": tGender(homeGender)}),
                    show: subscriptionCaption != null || friendCaption != null
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
                    show: subscribed && isPrincipalIn("delete", subscription, "admin", "admin")
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
                    show: !friend && !blocked
                },
                {
                    title: t("friend-groups"),
                    href: peerHref,
                    onClick: onFriendGroups,
                    opensDialog: true,
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
                    opensDialog: true,
                    show: !blocked && !blockedBy
                },
                {
                    title: t("hide-ellipsis"),
                    href: peerHref,
                    onClick: onHideDialog,
                    opensDialog: true,
                    show: subscribed || subscribedToMe || friend
                },
                {
                    divider: true
                },
                {
                    caption: blockedCaption ?? "",
                    show: blockedCaption != null
                },
                {
                    title: !blocked ? t("block-ellipsis") : t("blocking-ellipsis"),
                    href: peerHref,
                    onClick: onBlockDialog,
                    opensDialog: true,
                    show: true
                },
                {
                    divider: true
                },
                {
                    caption: t("banned-android-google-play"),
                    show: nodeName === ownerName && googlePlaySheriff && googlePlayGoverned && googlePlayProhibited
                },
                {
                    title: t("hide-in-google-play"),
                    href: peerHref,
                    onClick: onHideInGooglePlay,
                    show: nodeName === ownerName && googlePlaySheriff && googlePlayGoverned && !googlePlayProhibited
                },
                {
                    title: t("unhide-in-google-play"),
                    href: peerHref,
                    onClick: onUnhideInGooglePlay,
                    show: nodeName === ownerName && googlePlaySheriff && googlePlayGoverned && googlePlayProhibited
                }
            ]} onDialogOpened={onDialogOpened}>
                {small ?
                    <FontAwesomeIcon icon={blockedIcon ?? friendIcon ?? subscriptionIcon ?? ["far", "bell"]}/>
                :
                    blockedCaption ?? friendCaption ?? subscriptionCaption ?? t("subscribe")
                }
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
        friendsId: getHomeFriendsId(state),
        ownerName: getOwnerName(state),
        googlePlayGoverned: isFeedSheriff(state, "timeline", SHERIFF_GOOGLE_PLAY_TIMELINE),
        googlePlaySheriff: getHomeOwnerName(state) === SHERIFF_GOOGLE_PLAY_TIMELINE,
        googlePlayProhibited: isFeedSheriffProhibited(state, "timeline", SHERIFF_GOOGLE_PLAY_TIMELINE)
    }),
    {
        feedSubscribe, feedUnsubscribe, friendshipUpdate, openFriendGroupsDialog, openAskDialog, openPeopleHideDialog,
        openBlockDialog, openSheriffOrderDialog, confirmBox
    }
);

export const SubscribeButton = connector(SubscribeButtonImpl);
