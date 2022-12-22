import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { ClientState } from "state/state";
import { peopleSelectToggle } from "state/people/actions";
import { ContactState } from "state/people/state";
import { Avatar, AvatarWithPopup } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import PeopleContactIcons from "ui/people/PeopleContactIcons";
import "./PeoplePerson.css";

interface OwnProps {
    contact: ContactState;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const PeoplePerson = ({contact, selecting, selected, peopleSelectToggle}: Props) => {
    const onSelectClick = () => peopleSelectToggle(contact.contact.nodeName);

    return (
        <div className="person">
            {selecting ?
                <div className="avatar-selector" onClick={onSelectClick}>
                    <Avatar ownerName={contact.contact.nodeName} avatar={contact.contact.avatar} size={48}/>
                    <button className={cx("selection", {"selected": selected})}>
                        {selected && <FontAwesomeIcon icon="check"/>}
                    </button>
                </div>
            :
                <AvatarWithPopup ownerName={contact.contact.nodeName} ownerFullName={contact.contact.fullName}
                                 avatar={contact.contact.avatar} size={48}/>
            }
            <NodeName name={contact.contact.nodeName} fullName={contact.contact.fullName}/>
            <PeopleContactIcons contact={contact}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        selecting: state.people.selecting,
        selected: state.people.selected[ownProps.contact.contact.nodeName] ?? false
    }),
    { peopleSelectToggle }
);

export default connector(PeoplePerson);
