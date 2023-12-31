import React from 'react';
import { useSelector } from 'react-redux';
import {
    faArrowRightArrowLeft,
    faArrowsToEye,
    faBan,
    faEye,
    faHandcuffs,
    faPeopleArrows,
    faPerson,
    faPersonWalkingArrowRight
} from '@fortawesome/free-solid-svg-icons';

import { getHomeOwnerGender } from "state/home/selectors";
import { ContactState } from "state/people/state";
import { getPeopleTab } from "state/people/selectors";
import { Principal } from "ui/control";
import SubscriberVisibility from "ui/people/SubscriberVisibility";
import PeopleIconSet from "ui/people/PeopleIconSet";
import "./PeopleContactIcons.css";

interface Props {
    contact: ContactState
}

export default function PeopleContactIcons({contact}: Props) {
    const tab = useSelector(getPeopleTab);
    const homeOwnerGender = useSelector(getHomeOwnerGender);

    const hasSubscriber = contact.contact.hasFeedSubscriber ?? false;
    const hasSubscription = contact.contact.hasFeedSubscription ?? false;
    const hasFriend = contact.contact.hasFriend ?? false;
    const hasFriendOf = contact.contact.hasFriendOf ?? false;
    const hasBlock = contact.contact.hasBlock ?? false;
    const hasBlockBy = contact.contact.hasBlockBy ?? false;

    switch (tab) {
        case "subscribers":
            if (contact.subscriber != null) {
                return (
                    <>
                        <SubscriberVisibility subscriber={contact.subscriber}/>
                        <div className="icons">
                            <PeopleIconSet icons={[
                                {
                                    icon: faArrowRightArrowLeft,
                                    title: "mutually-subscribed",
                                    visible: hasSubscription
                                },
                                {
                                    icon: faPerson,
                                    title: "friend",
                                    visible: hasFriend && !hasFriendOf
                                },
                                {
                                    icon: faPersonWalkingArrowRight,
                                    title: "in-friends",
                                    visible: !hasFriend && hasFriendOf
                                },
                                {
                                    icon: faPeopleArrows,
                                    title: "mutual-friends",
                                    visible: hasFriend && hasFriendOf
                                },
                                {
                                    icon: faBan,
                                    title: "blocked",
                                    visible: hasBlock
                                },
                                {
                                    icon: faHandcuffs,
                                    title: "in-blocked",
                                    visible: !hasBlock && hasBlockBy
                                }
                            ]}/>
                        </div>
                    </>
                );
            }
            break;
        case "subscriptions":
            if (contact.subscription != null) {
                return (
                    <>
                        <Principal value={contact.subscription.operations?.view ?? "public"} defaultValue="public"/>
                        <div className="icons">
                            <PeopleIconSet icons={[
                                {
                                    icon: faArrowRightArrowLeft,
                                    title: "mutually-subscribed",
                                    visible: hasSubscriber
                                },
                                {
                                    icon: faPerson,
                                    title: "friend",
                                    visible: hasFriend && !hasFriendOf
                                },
                                {
                                    icon: faPersonWalkingArrowRight,
                                    title: "in-friends",
                                    visible: !hasFriend && hasFriendOf
                                },
                                {
                                    icon: faPeopleArrows,
                                    title: "mutual-friends",
                                    visible: hasFriend && hasFriendOf
                                },
                                {
                                    icon: faBan,
                                    title: "blocked",
                                    visible: hasBlock
                                },
                                {
                                    icon: faHandcuffs,
                                    title: "in-blocked",
                                    visible: !hasBlock && hasBlockBy
                                }
                            ]}/>
                        </div>
                    </>
                );
            }
            break;
        case "friend-ofs":
            if (contact.friendOf != null) {
                return (
                    <div className="icons">
                        <PeopleIconSet icons={[
                            {
                                icon: faEye,
                                title: "subscribed",
                                gender: homeOwnerGender,
                                visible: !hasSubscriber && hasSubscription
                            },
                            {
                                icon: faArrowsToEye,
                                title: "subscribed-to-me",
                                gender: contact.contact.gender,
                                visible: hasSubscriber && !hasSubscription
                            },
                            {
                                icon: faArrowRightArrowLeft,
                                title: "mutually-subscribed",
                                visible: hasSubscriber && hasSubscription
                            },
                            {
                                icon: faPeopleArrows,
                                title: "mutual-friends",
                                visible: hasFriend
                            },
                            {
                                icon: faBan,
                                title: "blocked",
                                visible: hasBlock
                            },
                            {
                                icon: faHandcuffs,
                                title: "in-blocked",
                                visible: !hasBlock && hasBlockBy
                            }
                        ]}/>
                    </div>
                );
            }
            break;
        case "blocked":
            if (contact.blocked != null && contact.blocked.length > 0) {
                return (
                    <div className="icons">
                        <PeopleIconSet icons={[
                            {
                                icon: faEye,
                                title: "subscribed",
                                gender: homeOwnerGender,
                                visible: !hasSubscriber && hasSubscription
                            },
                            {
                                icon: faArrowsToEye,
                                title: "subscribed-to-me",
                                gender: contact.contact.gender,
                                visible: hasSubscriber && !hasSubscription
                            },
                            {
                                icon: faArrowRightArrowLeft,
                                title: "mutually-subscribed",
                                visible: hasSubscriber && hasSubscription
                            },
                            {
                                icon: faPerson,
                                title: "friend",
                                visible: hasFriend && !hasFriendOf
                            },
                            {
                                icon: faPersonWalkingArrowRight,
                                title: "in-friends",
                                visible: !hasFriend && hasFriendOf
                            },
                            {
                                icon: faPeopleArrows,
                                title: "mutual-friends",
                                visible: hasFriend && hasFriendOf
                            }
                        ]}/>
                    </div>
                );
            }
            break;
        case "blocked-by":
            if (contact.blockedBy != null && contact.blockedBy.length > 0) {
                return (
                    <div className="icons">
                        <PeopleIconSet icons={[
                            {
                                icon: faEye,
                                title: "subscribed",
                                gender: homeOwnerGender,
                                visible: !hasSubscriber && hasSubscription
                            },
                            {
                                icon: faArrowsToEye,
                                title: "subscribed-to-me",
                                gender: contact.contact.gender,
                                visible: hasSubscriber && !hasSubscription
                            },
                            {
                                icon: faArrowRightArrowLeft,
                                title: "mutually-subscribed",
                                visible: hasSubscriber && hasSubscription
                            },
                            {
                                icon: faPerson,
                                title: "friend",
                                visible: hasFriend && !hasFriendOf
                            },
                            {
                                icon: faPersonWalkingArrowRight,
                                title: "in-friends",
                                visible: !hasFriend && hasFriendOf
                            },
                            {
                                icon: faPeopleArrows,
                                title: "mutual-friends",
                                visible: hasFriend && hasFriendOf
                            },
                            {
                                icon: faBan,
                                title: "blocked",
                                visible: hasBlock
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
                    <>
                        <Principal value={view} defaultValue="public"/>
                        <div className="icons">
                            <PeopleIconSet icons={[
                                {
                                    icon: faEye,
                                    title: "subscribed",
                                    gender: homeOwnerGender,
                                    visible: !hasSubscriber && hasSubscription
                                },
                                {
                                    icon: faArrowsToEye,
                                    title: "subscribed-to-me",
                                    gender: contact.contact.gender,
                                    visible: hasSubscriber && !hasSubscription
                                },
                                {
                                    icon: faArrowRightArrowLeft,
                                    title: "mutually-subscribed",
                                    visible: hasSubscriber && hasSubscription
                                },
                                {
                                    icon: faPeopleArrows,
                                    title: "mutual-friends",
                                    visible: hasFriendOf
                                },
                                {
                                    icon: faBan,
                                    title: "blocked",
                                    visible: hasBlock
                                },
                                {
                                    icon: faHandcuffs,
                                    title: "in-blocked",
                                    visible: !hasBlock && hasBlockBy
                                }
                            ]}/>
                        </div>
                    </>
                );
            }
            break;
    }
    return null;
}
