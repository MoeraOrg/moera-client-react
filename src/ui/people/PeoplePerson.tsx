import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getOwnerName } from "state/node/selectors";
import { peopleSelectToggle } from "state/people/actions";
import { ContactState } from "state/people/state";
import { getPeopleTab } from "state/people/selectors";
import { openBlockingDetailsDialog } from "state/blockingdetailsdialog/actions";
import { Avatar, AvatarWithPopup } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import PeopleContactIcons from "ui/people/PeopleContactIcons";
import "./PeoplePerson.css";

interface Props {
    contact: ContactState;
}

export default function PeoplePerson({contact}: Props) {
    const ownerName = useSelector(getOwnerName);
    const selecting = useSelector((state: ClientState) => state.people.selecting);
    const selected = useSelector((state: ClientState) => state.people.selected[contact.contact.nodeName] ?? false);
    const tab = useSelector(getPeopleTab);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onSelectClick = () => dispatch(peopleSelectToggle(contact.contact.nodeName));

    const onBlockingDetailsClick = () => {
        if (ownerName != null) {
            dispatch(openBlockingDetailsDialog(ownerName, contact.contact.nodeName, null, null, tab === "blocked-by"));
        }
    }

    const blockingIcon: IconProp | null = tab === "blocked" ? "ban" : tab === "blocked-by" ? "handcuffs" : null;

    return (
        <div className="person">
            <div className="details">
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
            {blockingIcon != null &&
                <button className="blocking-details" onClick={onBlockingDetailsClick}>
                    <FontAwesomeIcon icon={blockingIcon}/>
                    <span className="caption">{t("details-blocking")}</span>
                </button>
            }
        </div>
    );
}
