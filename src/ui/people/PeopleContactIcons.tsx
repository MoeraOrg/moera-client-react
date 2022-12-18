import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { ContactState } from "state/people/state";
import { getPeopleTab } from "state/people/selectors";
import { Principal } from "ui/control";
import SubscriberVisibility from "ui/people/SubscriberVisibility";

type Props = {
    contact: ContactState
} & ConnectedProps<typeof connector>;

function PeopleContactIcons({contact, tab}: Props) {
    switch (tab) {
        case "subscribers":
            if (contact.subscriber != null) {
                return <SubscriberVisibility subscriber={contact.subscriber}/>
            }
            break;
        case "subscriptions":
            if (contact.subscription != null) {
                return <Principal value={contact.subscription.operations?.view ?? "public"} defaultValue="public"/>
            }
            break;
        default:
            if (contact.friend != null) {
                const view = contact.friend.groups?.find(fg => fg.id === tab)?.operations?.view ?? "public";
                return <Principal value={view} defaultValue="public"/>
            }
            break;
    }
    return null;
}

const connector = connect(
    (state: ClientState) => ({
        tab: getPeopleTab(state)
    })
);

export default connector(PeopleContactIcons);
