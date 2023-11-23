import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerName, isPrincipalIn } from "state/node/selectors";
import { feedSubscribe, feedUnsubscribe } from "state/feeds/actions";
import { friendshipUpdate } from "state/people/actions";
import { openFriendGroupsDialog } from "state/friendgroupsdialog/actions";
import { openAskDialog } from "state/askdialog/actions";
import { openPeopleHideDialog } from "state/peoplehidedialog/actions";
import { openBlockDialog } from "state/blockdialog/actions";
import { getHomeFriendsId, getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { isFeedSheriff, isFeedSheriffProhibited } from "state/feeds/selectors";
import { sheriffListAdd, sheriffListDelete } from "state/nodecards/actions";
import { openSheriffOrderDialog, sheriffOrderDelete } from "state/sherifforderdialog/actions";
import { confirmBox } from "state/confirmbox/actions";
import { Button, DropdownMenu } from "ui/control";
import { tGender } from "i18n";
import "./SubscribeButton.css";

interface Props {
    small?: boolean | null;
    nodeName: string;
    feedName: string;
    onDialogOpened?: () => void;
}

export function SubscribeButton({small, nodeName, feedName, onDialogOpened}: Props) {
    const card = useSelector((state: ClientState) => getNodeCard(state, nodeName));
    const homeGender = useSelector(getHomeOwnerGender);
    const friendsId = useSelector(getHomeFriendsId);
    const ownerName = useSelector(getOwnerName);
    const googlePlayGoverned = useSelector((state: ClientState) =>
        isFeedSheriff(state, "timeline", SHERIFF_GOOGLE_PLAY_TIMELINE));
    const googlePlaySheriff = useSelector((state: ClientState) =>
        getHomeOwnerName(state) === SHERIFF_GOOGLE_PLAY_TIMELINE);
    const googlePlayProhibited = useSelector((state: ClientState) =>
        isFeedSheriffProhibited(state, "timeline", SHERIFF_GOOGLE_PLAY_TIMELINE));
    const dispatch = useDispatch();

    const fullName = card?.details.profile.fullName ?? null;
    const blogName = fullName || NodeName.shorten(nodeName);
    const subscribing = card?.subscription.subscribing ?? false;
    const unsubscribing = card?.subscription.unsubscribing ?? false;
    const subscriber = card?.subscription.subscriber;
    const subscription = card?.subscription.subscription;
    const friendGroups = card?.friendship.groups;
    const remoteFriendGroups = card?.friendship.remoteGroups;
    const updatingFriendship = card?.friendship.updating;
    const blockedList = card?.blocking.blocked;
    const blockedByList = card?.blocking.blockedBy;

    const {t} = useTranslation();

    const onSubscribe = () => dispatch(feedSubscribe(nodeName, feedName));

    const onUnsubscribe = () => {
        if (subscription != null) {
            dispatch(feedUnsubscribe(nodeName, feedName, subscription.id));
        }
    }

    const onAddFriend = () => {
        if (friendsId != null) {
            dispatch(friendshipUpdate(nodeName, [friendsId]));
        }
    }

    const onFriendGroups = () => dispatch(openFriendGroupsDialog(nodeName));

    const onUnfriend = () => dispatch(friendshipUpdate(nodeName, null));

    const onAskDialog = () => dispatch(openAskDialog(nodeName));

    const onHideDialog = () => dispatch(openPeopleHideDialog(nodeName, feedName));

    const onBlockDialog = () => dispatch(openBlockDialog(nodeName, fullName, null, null, blockedList ?? []));

    const onHideInGooglePlay = () =>
        dispatch(openSheriffOrderDialog({nodeName, fullName, feedName: "timeline"}));

    const onUnhideInGooglePlay = () => {
        dispatch(confirmBox(t("unhide-blog-google-play", {"name": blogName}), t("unhide"), t("cancel"),
            sheriffOrderDelete({nodeName, feedName: "timeline"}), null, "success"));
    };

    const onHideContentInGooglePlay = () => {
        dispatch(confirmBox(t("hide-content-user-in-google-play", {"name": blogName}), t("hide"), t("cancel"),
            sheriffListAdd(nodeName), null, "danger"));
    };

    const onUnhideContentInGooglePlay = () => {
        dispatch(confirmBox(t("unhide-content-user-in-google-play", {"name": blogName}), t("unhide"), t("cancel"),
            sheriffListDelete(nodeName), null, "success"));
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
                    nodeName,
                    href: null,
                    onClick: onSubscribe,
                    show: !subscribed
                },
                {
                    title: t("unsubscribe"),
                    nodeName,
                    href: null,
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
                    nodeName,
                    href: null,
                    onClick: onAddFriend,
                    show: !friend && !blocked
                },
                {
                    title: t("friend-groups"),
                    nodeName,
                    href: null,
                    onClick: onFriendGroups,
                    opensDialog: true,
                    show: friend
                },
                {
                    title: t("unfriend"),
                    nodeName,
                    href: null,
                    onClick: onUnfriend,
                    show: friend
                },
                {
                      divider: true
                },
                {
                    title: t("ask-ellipsis"),
                    nodeName,
                    href: null,
                    onClick: onAskDialog,
                    opensDialog: true,
                    show: !blocked && !blockedBy
                },
                {
                    title: t("hide-ellipsis"),
                    nodeName,
                    href: null,
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
                    nodeName,
                    href: null,
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
                    caption: t("banned-content-android-google-play"),
                    show: nodeName === ownerName && googlePlaySheriff && card?.sheriffList.blocked === true
                },
                {
                    title: t("hide-in-google-play"),
                    nodeName,
                    href: null,
                    onClick: onHideInGooglePlay,
                    show: nodeName === ownerName && googlePlaySheriff && googlePlayGoverned && !googlePlayProhibited
                },
                {
                    title: t("unhide-in-google-play"),
                    nodeName,
                    href: null,
                    onClick: onUnhideInGooglePlay,
                    show: nodeName === ownerName && googlePlaySheriff && googlePlayGoverned && googlePlayProhibited
                },
                {
                    title: t("hide-content-in-google-play"),
                    nodeName,
                    href: null,
                    onClick: onHideContentInGooglePlay,
                    show: nodeName === ownerName && googlePlaySheriff && card?.sheriffList.blocked === false
                },
                {
                    title: t("unhide-content-in-google-play"),
                    nodeName,
                    href: null,
                    onClick: onUnhideContentInGooglePlay,
                    show: nodeName === ownerName && googlePlaySheriff && card?.sheriffList.blocked === true
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
