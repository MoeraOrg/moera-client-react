import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { ContactState } from "state/people/state";
import { getPeopleTab } from "state/people/selectors";
import { Principal } from "ui/control";
import SubscriberVisibility from "ui/people/SubscriberVisibility";
import PeopleIconSet from "ui/people/PeopleIconSet";
import "./PeopleContactIcons.css";
import { getHomeOwnerGender } from "state/home/selectors";

type Props = {
    contact: ContactState
} & ConnectedProps<typeof connector>;

function PeopleContactIcons({contact, tab, homeOwnerGender}: Props) {
    const hasSubscriber = contact.contact.hasFeedSubscriber ?? false;
    const hasSubscription = contact.contact.hasFeedSubscription ?? false;
    const hasFriend = contact.contact.hasFriend ?? false;
    const hasFriendOf = contact.contact.hasFriendOf ?? false;

    switch (tab) {
        case "subscribers":
            if (contact.subscriber != null) {
                return (
                    <div className="icons">
                        <SubscriberVisibility subscriber={contact.subscriber}/>
                        <PeopleIconSet icons={[
                            {
                                icon: "arrow-right-arrow-left",
                                title: "mutually-subscribed",
                                visible: hasSubscription
                            },
                            {
                                icon: "person",
                                title: "friend",
                                visible: hasFriend && !hasFriendOf
                            },
                            {
                                icon: "person-walking-arrow-right",
                                title: "in-friends",
                                visible: !hasFriend && hasFriendOf
                            },
                            {
                                icon: "people-arrows",
                                title: "mutual-friends",
                                visible: hasFriend && hasFriendOf
                            }
                        ]}/>
                    </div>
                );
            }
            break;
        case "subscriptions":
            if (contact.subscription != null) {
                return (
                    <div className="icons">
                        <Principal value={contact.subscription.operations?.view ?? "public"} defaultValue="public"/>
                        <PeopleIconSet icons={[
                            {
                                icon: "arrow-right-arrow-left",
                                title: "mutually-subscribed",
                                visible: hasSubscriber
                            },
                            {
                                icon: "person",
                                title: "friend",
                                visible: hasFriend && !hasFriendOf
                            },
                            {
                                icon: "person-walking-arrow-right",
                                title: "in-friends",
                                visible: !hasFriend && hasFriendOf
                            },
                            {
                                icon: "people-arrows",
                                title: "mutual-friends",
                                visible: hasFriend && hasFriendOf
                            }
                        ]}/>
                    </div>
                );
            }
            break;
        case "friend-ofs":
            if (contact.friendOf != null) {
                return (
                    <div className="icons">
                        <PeopleIconSet icons={[
                            {
                                icon: "eye",
                                title: "subscribed",
                                gender: homeOwnerGender,
                                visible: !hasSubscriber && hasSubscription
                            },
                            {
                                icon: "arrows-to-eye",
                                title: "subscribed-to-me",
                                gender: contact.contact.gender,
                                visible: hasSubscriber && !hasSubscription
                            },
                            {
                                icon: "arrow-right-arrow-left",
                                title: "mutually-subscribed",
                                visible: hasSubscriber && hasSubscription
                            },
                            {
                                icon: "people-arrows",
                                title: "mutual-friends",
                                visible: hasFriendOf
                            }
                        ]}/>
                    </div>
                );
            }
            break;
        default:
            if (contact.friend != null) {
                const view = contact.friend.groups?.find(fg => fg.id === tab)?.operations?.view ?? "public";
                return (
                    <div className="icons">
                        <Principal value={view} defaultValue="public"/>
                        <PeopleIconSet icons={[
                            {
                                icon: "eye",
                                title: "subscribed",
                                gender: homeOwnerGender,
                                visible: !hasSubscriber && hasSubscription
                            },
                            {
                                icon: "arrows-to-eye",
                                title: "subscribed-to-me",
                                gender: contact.contact.gender,
                                visible: hasSubscriber && !hasSubscription
                            },
                            {
                                icon: "arrow-right-arrow-left",
                                title: "mutually-subscribed",
                                visible: hasSubscriber && hasSubscription
                            },
                            {
                                icon: "people-arrows",
                                title: "mutual-friends",
                                visible: hasFriend
                            }
                        ]}/>
                    </div>
                );
            }
            break;
    }
    return null;
}

const connector = connect(
    (state: ClientState) => ({
        tab: getPeopleTab(state),
        homeOwnerGender: getHomeOwnerGender(state)
    })
);

export default connector(PeopleContactIcons);
