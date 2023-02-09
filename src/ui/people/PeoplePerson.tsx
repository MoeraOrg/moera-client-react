import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
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

interface OwnProps {
    contact: ContactState;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const PeoplePerson = ({
    contact, ownerName, selecting, selected, tab, peopleSelectToggle, openBlockingDetailsDialog
}: Props) => {
    const {t} = useTranslation();

    const onSelectClick = () => peopleSelectToggle(contact.contact.nodeName);

    const onBlockingDetailsClick = () => {
        if (ownerName != null) {
            openBlockingDetailsDialog(ownerName, contact.contact.nodeName, null, null, tab === "blocked-by");
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

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        ownerName: getOwnerName(state),
        selecting: state.people.selecting,
        selected: state.people.selected[ownProps.contact.contact.nodeName] ?? false,
        tab: getPeopleTab(state)
    }),
    { peopleSelectToggle, openBlockingDetailsDialog }
);

export default connector(PeoplePerson);
