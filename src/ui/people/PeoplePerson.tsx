import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';

import { ContactWithRelationships, NodeName } from "api";
import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { peopleSelectToggle } from "state/people/actions";
import { getPeopleTab } from "state/people/selectors";
import { Avatar, AvatarWithPopup, OnlyDesktop, OnlyMobile, Principal, SubscribeButton } from "ui/control";
import Jump from "ui/navigation/Jump";
import SubscriberVisibility from "ui/people/SubscriberVisibility";
import PeopleContactStatuses from "ui/people/PeopleContactStatuses";
import "./PeoplePerson.css";

interface Props {
    contact: ContactWithRelationships;
}

export default function PeoplePerson({contact}: Props) {
    const atHome = useSelector(isAtHomeNode);
    const selecting = useSelector((state: ClientState) => state.people.selecting);
    const selected = useSelector((state: ClientState) => state.people.selected[contact.contact.nodeName] ?? false);
    const tab = useSelector(getPeopleTab);
    const dispatch = useDispatch();

    const onSelectClick = () => dispatch(peopleSelectToggle(contact.contact.nodeName));

    const shortNodeName = NodeName.shorten(contact.contact.nodeName);

    return (
        <div className="person">
            {selecting ?
                <div className="avatar-selector" onClick={onSelectClick}>
                    <Avatar ownerName={contact.contact.nodeName} avatar={contact.contact.avatar} size={40}/>
                    <button className={cx("selection", {"selected": selected})}>
                        {selected && <FontAwesomeIcon icon={faCheck}/>}
                    </button>
                </div>
            :
                <AvatarWithPopup ownerName={contact.contact.nodeName} ownerFullName={contact.contact.fullName}
                                 avatar={contact.contact.avatar} size={40}/>
            }
            <div className="details">
                <Jump className="full-name" nodeName={contact.contact.nodeName} href="/">
                    {contact.contact.fullName || shortNodeName}
                    {tab === "subscribers" && contact.subscriber != null &&
                        <SubscriberVisibility subscriber={contact.subscriber}/>
                    }
                    {tab === "subscriptions" && contact.subscription != null &&
                        <Principal value={contact.subscription.operations?.view ?? "public"} defaultValue="public"/>
                    }
                    {!atHome && <OnlyDesktop><PeopleContactStatuses contact={contact}/></OnlyDesktop>}
                </Jump>
                <Jump className="name" nodeName={contact.contact.nodeName} href="/">
                    {shortNodeName}
                </Jump>
            </div>
            <SubscribeButton nodeName={contact.contact.nodeName} feedName="timeline"/>
            {!atHome && <OnlyMobile><PeopleContactStatuses contact={contact}/></OnlyMobile>}
        </div>
    );
}
