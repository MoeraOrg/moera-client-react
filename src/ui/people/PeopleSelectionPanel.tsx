import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { peopleStartSelection, peopleStopSelection } from "state/people/actions";
import { Button, Loading } from "ui/control";
import PeopleSelectedButton from "ui/people/PeopleSelectedButton";
import "./PeopleSelectionPanel.css";

type Props = ConnectedProps<typeof connector>;

function PeopleSelectionPanel({atHome, selecting, proceeding, peopleStartSelection, peopleStopSelection}: Props) {
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
            <PeopleSelectedButton/>
            <Loading active={proceeding}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        atHome: isAtHomeNode(state),
        selecting: state.people.selecting,
        proceeding: state.people.selectedProceeding
    }),
    { peopleStartSelection, peopleStopSelection }
);

export default connector(PeopleSelectionPanel);
