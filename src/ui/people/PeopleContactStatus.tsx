import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ContactWithRelationships } from "api";
import { getPeopleTab } from "state/people/selectors";
import "./PeopleContactStatus.css";

interface Props {
    contact: ContactWithRelationships;
}

export default function PeopleContactStatus({contact}: Props) {
    const tab = useSelector(getPeopleTab);
    const {t} = useTranslation();

    const hasSubscriber = contact.contact.hasFeedSubscriber ?? false;
    const hasSubscription = contact.contact.hasFeedSubscription ?? false;
    const hasFriend = contact.contact.hasFriend ?? false;
    const hasFriendOf = contact.contact.hasFriendOf ?? false;

    let statuses = [];

    switch (tab) {
        case "subscribers":
            if (hasSubscription) {
                statuses.push("mutually");
            }
            if (hasFriend && !hasFriendOf) {
                statuses.push("friend");
            }
            if (!hasFriend && hasFriendOf) {
                statuses.push("in-friends");
            }
            if (hasFriend && hasFriendOf) {
                statuses.push("mutual-friends");
            }
            break;
        case "subscriptions":
            if (hasSubscriber) {
                statuses.push("mutually");
            }
            if (hasFriend && !hasFriendOf) {
                statuses.push("friend");
            }
            if (!hasFriend && hasFriendOf) {
                statuses.push("in-friends");
            }
            if (hasFriend && hasFriendOf) {
                statuses.push("mutual-friends");
            }
            break;
        case "friend-ofs":
            if (hasFriend) {
                statuses.push("mutually");
            }
            break;
        default:
            if (hasFriendOf) {
                statuses.push("mutually");
            }
            break;
    }

    return (
        <>
            {statuses.map(status =>
                <span key={status} className="contact-status">{t(status)}</span>
            )}
        </>
    );
}
