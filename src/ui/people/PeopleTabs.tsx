import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { TFunction, useTranslation } from 'react-i18next';

import { FriendGroupInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeFriendGroups } from "state/node/selectors";
import { peopleGoToTab } from "state/people/actions";
import { PeopleTab } from "state/people/state";
import PeopleTabsItem from "ui/people/PeopleTabsItem";
import "./PeopleTabs.css";

type PeopleTabsProps = {
    active: PeopleTab;
} & ConnectedProps<typeof connector>;

const PeopleTabs = ({
    active, loadedGeneral, subscribersTotal, subscriptionsTotal, friendsTotal, viewSubscribers, viewSubscriptions,
    viewFriends, friendGroups, peopleGoToTab
}: PeopleTabsProps) => {
    const {t} = useTranslation();

    return (
        <div className="people-tabs">
            {subscribersTotal != null &&
                <PeopleTabsItem name="subscribers" title={t("subscribers")} principal={viewSubscribers}
                                total={subscribersTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={peopleGoToTab}/>
            }
            {subscriptionsTotal != null &&
                <PeopleTabsItem name="subscriptions" title={t("subscriptions")} principal={viewSubscriptions}
                                total={subscriptionsTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={peopleGoToTab}/>
            }
            {friendsTotal != null &&
                friendGroups.map(friendGroup =>
                    <PeopleTabsItem name={friendGroup.id} title={getTitle(friendGroup, t)} principal={viewFriends}
                                    total={friendsTotal[friendGroup.id] ?? 0} loaded={loadedGeneral} active={active}
                                    peopleGoToTab={peopleGoToTab}/>
                )
            }
            <div className="rest"/>
        </div>
    );
}

function getTitle(friendGroup: FriendGroupInfo, t: TFunction): string {
    if (friendGroup.title == null) {
        return "";
    }
    if (friendGroup.title.startsWith("t:")) {
        return t("friend-groups." + friendGroup.title.substring(2));
    }
    return friendGroup.title;
}

const connector = connect(
    (state: ClientState) => ({
        loadedGeneral: state.people.loadedGeneral,
        subscribersTotal: state.people.subscribersTotal,
        subscriptionsTotal: state.people.subscriptionsTotal,
        friendsTotal: state.people.friendsTotal,
        viewSubscribers: state.people.operations.viewSubscribers ?? "public",
        viewSubscriptions: state.people.operations.viewSubscriptions ?? "public",
        viewFriends: state.people.operations.viewFriends ?? "public",
        friendGroups: getNodeFriendGroups(state)
    }),
    { peopleGoToTab }
);

export default connector(PeopleTabs);
