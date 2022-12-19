import React from 'react';

import { ContactState } from "state/people/state";
import { AvatarWithPopup } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import PeopleContactIcons from "ui/people/PeopleContactIcons";
import "./PeoplePerson.css";

interface Props {
    contact: ContactState;
}

const PeoplePerson = ({contact}: Props) => (
    <div className="person">
        <AvatarWithPopup ownerName={contact.contact.nodeName} ownerFullName={contact.contact.fullName}
                         avatar={contact.contact.avatar} size={48}/>
        <NodeName name={contact.contact.nodeName} fullName={contact.contact.fullName}/>
        <PeopleContactIcons contact={contact}/>
    </div>
);

export default PeoplePerson;
