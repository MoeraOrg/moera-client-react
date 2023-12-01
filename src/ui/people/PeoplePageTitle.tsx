import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getNodeFriendGroups } from "state/node/selectors";
import { isPeopleContactsLoading } from "state/people/selectors";
import { Loading } from "ui/control";
import { getPeopleTabTitle } from "ui/people/people-tabs";
import "./PeoplePage.css";

export default function PeoplePageTitle() {
    const tab = useSelector((state: ClientState) => state.people.tab);
    const friendGroups = useSelector(getNodeFriendGroups);
    const loading = useSelector(isPeopleContactsLoading);
    const {t} = useTranslation();

    return (
        <>
            <h3>{getPeopleTabTitle(tab, friendGroups, t)}{" "}{loading && <Loading/>}</h3>
            <br/>
        </>
    );
}
