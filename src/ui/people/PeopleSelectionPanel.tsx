import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { peopleSetSort, peopleStartSelection, peopleStopSelection } from "state/people/actions";
import { Button } from "ui/control";
import PeopleSelectedButton from "ui/people/PeopleSelectedButton";
import PeopleSearch from "ui/people/PeopleSearch";
import "./PeopleSelectionPanel.css";

type Props = ConnectedProps<typeof connector>;

function PeopleSelectionPanel({
    atHome, selecting, sortAlpha, peopleStartSelection, peopleStopSelection, peopleSetSort
}: Props) {
    const {t} = useTranslation();

    if (!atHome) {
        return null;
    }

    const onSelectClick = () => {
        if (!selecting) {
            peopleStartSelection();
        } else {
            peopleStopSelection();
        }
    }

    const onSortClick = () => peopleSetSort(!sortAlpha);

    return (
        <div className="people-panel">
            <div className="d-flex">
                <Button variant="outline-primary" size="sm" active={selecting} onClick={onSelectClick}>
                    <FontAwesomeIcon icon="arrow-pointer"/>
                    {" "}
                    {!selecting ? t("select") : t("clear-selection")}
                </Button>
                <PeopleSelectedButton/>
                <Button variant="outline-secondary" size="sm" className="ms-auto" active={sortAlpha}
                        onClick={onSortClick}>
                    <FontAwesomeIcon icon="arrow-down-a-z"/>
                </Button>
            </div>
            <PeopleSearch/>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        atHome: isAtHomeNode(state),
        selecting: state.people.selecting,
        sortAlpha: state.people.sortAlpha
    }),
    { peopleStartSelection, peopleStopSelection, peopleSetSort }
);

export default connector(PeopleSelectionPanel);
