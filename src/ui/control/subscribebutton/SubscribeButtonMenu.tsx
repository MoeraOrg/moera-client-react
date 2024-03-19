import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NodeName } from "api";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ClientState } from "state/state";
import { getHomeFriendsId, getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { getOwnerName, isPrincipalIn } from "state/node/selectors";
import { sheriffListAdd, sheriffListDelete } from "state/nodecards/actions";
import { getNodeCard } from "state/nodecards/selectors";
import { feedSubscribe, feedUnsubscribe } from "state/feeds/actions";
import { isFeedSheriff, isFeedSheriffProhibited } from "state/feeds/selectors";
import { friendshipUpdate } from "state/people/actions";
import { openFriendGroupsDialog } from "state/friendgroupsdialog/actions";
import { openAskDialog } from "state/askdialog/actions";
import { openPeopleHideDialog } from "state/peoplehidedialog/actions";
import { openBlockDialog } from "state/blockdialog/actions";
import { openSheriffOrderDialog, sheriffOrderDelete } from "state/sherifforderdialog/actions";
import { confirmBox } from "state/confirmbox/actions";
import { Button, DropdownMenuItems } from "ui/control";
import { tGender } from "i18n";
import { REL_CURRENT } from "util/rel-node-name";

interface Props {
    nodeName: string;
    feedName: string;
}

export default function SubscribeButtonMenu({nodeName, feedName}: Props) {
    const card = useSelector((state: ClientState) => getNodeCard(state, nodeName));
    const homeGender = useSelector(getHomeOwnerGender);
    const friendsId = useSelector(getHomeFriendsId);
    const ownerName = useSelector(getOwnerName);
    const googlePlayGoverned = useSelector((state: ClientState) =>
        isFeedSheriff(state, REL_CURRENT, "timeline", SHERIFF_GOOGLE_PLAY_TIMELINE));
    const googlePlaySheriff = useSelector((state: ClientState) =>
        getHomeOwnerName(state) === SHERIFF_GOOGLE_PLAY_TIMELINE);
    const googlePlayProhibited = useSelector((state: ClientState) =>
        isFeedSheriffProhibited(state, REL_CURRENT, "timeline", SHERIFF_GOOGLE_PLAY_TIMELINE));
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

    const subscriptionCaption = subscribed
        ? (subscribedToMe ? t("mutually-subscribed") : t("subscribed", {"gender": tGender(homeGender)}))
        : (subscribedToMe ? t("subscribed-to-me", {"gender": tGender(subscriber?.contact?.gender)}) : null);

    const friend = friendGroups != null && friendGroups.length > 0;
    const friendOf = remoteFriendGroups != null && remoteFriendGroups.length > 0;
    const friendCaption = friend
        ? (friendOf ? t("mutual-friends") : t("friend"))
        : (friendOf ? t("in-friends") : null)

    const blocked = blockedList != null && blockedList.length > 0;
    const blockedBy = blockedByList != null && blockedByList.length > 0;
    const blockedCaption = blocked
        ? t("blocked")
        : (blockedBy ? t("in-blocked") : null)

    return (
        <DropdownMenuItems items={[
            {
                caption: subscriptionCaption ?? t("not-subscribed", {"gender": tGender(homeGender)}),
                show: subscriptionCaption != null || friendCaption != null
            },
            {
                title: !subscribedToMe ? t("subscribe") : t("subscribe-back"),
                nodeName,
                href: "/",
                onClick: onSubscribe,
                show: !subscribed
            },
            {
                title: t("unsubscribe"),
                nodeName,
                href: "/",
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
                href: "/",
                onClick: onAddFriend,
                show: !friend && !blocked
            },
            {
                title: t("friend-groups"),
                nodeName,
                href: "/",
                onClick: onFriendGroups,
                opensDialog: true,
                show: friend
            },
            {
                title: t("unfriend"),
                nodeName,
                href: "/",
                onClick: onUnfriend,
                show: friend
            },
            {
                divider: true
            },
            {
                title: t("ask-ellipsis"),
                nodeName,
                href: "/",
                onClick: onAskDialog,
                opensDialog: true,
                show: !blocked && !blockedBy
            },
            {
                title: t("hide-ellipsis"),
                nodeName,
                href: "/",
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
                href: "/",
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
                href: "/",
                onClick: onHideInGooglePlay,
                show: nodeName === ownerName && googlePlaySheriff && googlePlayGoverned && !googlePlayProhibited
            },
            {
                title: t("unhide-in-google-play"),
                nodeName,
                href: "/",
                onClick: onUnhideInGooglePlay,
                show: nodeName === ownerName && googlePlaySheriff && googlePlayGoverned && googlePlayProhibited
            },
            {
                title: t("hide-content-in-google-play"),
                nodeName,
                href: "/",
                onClick: onHideContentInGooglePlay,
                show: nodeName === ownerName && googlePlaySheriff && card?.sheriffList.blocked === false
            },
            {
                title: t("unhide-content-in-google-play"),
                nodeName,
                href: "/",
                onClick: onUnhideContentInGooglePlay,
                show: nodeName === ownerName && googlePlaySheriff && card?.sheriffList.blocked === true
            }
        ]}/>
    );
}
