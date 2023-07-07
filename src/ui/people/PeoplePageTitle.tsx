import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getNodeFriendGroups } from "state/node/selectors";
import { isPeopleContactsLoading } from "state/people/selectors";
import { Loading } from "ui/control";
import { getPeopleTabTitle } from "ui/people/people-tabs";
import "./PeoplePage.css";

type Props = ConnectedProps<typeof connector>;

const PeoplePageTitle = ({tab, friendGroups, loading}: Props) => {
    const {t} = useTranslation();

    return (
        <>
            <h3>{getPeopleTabTitle(tab, friendGroups, t)}{" "}<Loading active={loading}/></h3>
            <br/>
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        tab: state.people.tab,
        friendGroups: getNodeFriendGroups(state),
        loading: isPeopleContactsLoading(state)
    })
);

export default connector(PeoplePageTitle);
