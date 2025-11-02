import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { isRegularNode } from "state/node/selectors";
import BackBoxInner from "ui/page/BackBoxInner";
import PeopleTabs from "ui/people/PeopleTabs";
import PeopleSelectionPanel from "ui/people/PeopleSelectionPanel";
import "./PeopleTop.css";

export default function PeopleTop() {
    const regularNode = useSelector(isRegularNode);
    const tab = useSelector((state: ClientState) => state.people.tab);

    if (!regularNode) {
        return null;
    }

    return (
        <BackBoxInner className="people-top">
            <PeopleTabs active={tab}/>
            <PeopleSelectionPanel/>
        </BackBoxInner>
    );
}
