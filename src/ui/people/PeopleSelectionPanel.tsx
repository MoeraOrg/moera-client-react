import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createSelector } from 'reselect';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { peopleStartSelection, peopleStopSelection } from "state/people/actions";
import { Button } from "ui/control";
import "./PeopleSelectionPanel.css";

type Props = ConnectedProps<typeof connector>;

function PeopleSelectionPanel({atHome, selecting, totalSelected, peopleStartSelection, peopleStopSelection}: Props) {
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

    return (
        <div className="people-panel">
            <Button variant="outline-primary" size="sm" active={selecting} onClick={onSelectClick}>
                <FontAwesomeIcon icon="arrow-pointer"/>
                {" "}
                {!selecting ? t("select") : t("clear-selection")}
            </Button>
            {totalSelected > 0 &&
                <Button variant="primary" size="sm" className="ms-1">
                    {t("count-selected", {count: totalSelected}) + " "}
                    <FontAwesomeIcon icon="chevron-down"/>
                </Button>
            }
        </div>
    );
}

const getTotalSelected = createSelector(
    (state: ClientState) => state.people.selected,
    selected => Object.values(selected).reduce((count, v) => count + (v ? 1 : 0), 0)
);

const connector = connect(
    (state: ClientState) => ({
        atHome: isAtHomeNode(state),
        selecting: state.people.selecting,
        totalSelected: getTotalSelected(state)
    }),
    { peopleStartSelection, peopleStopSelection }
);

export default connector(PeopleSelectionPanel);
