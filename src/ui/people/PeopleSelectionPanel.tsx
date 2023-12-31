import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownAZ, faArrowPointer } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { peopleSetSort, peopleStartSelection, peopleStopSelection } from "state/people/actions";
import { Button } from "ui/control";
import PeopleSelectedButton from "ui/people/PeopleSelectedButton";
import PeopleSearch from "ui/people/PeopleSearch";
import "./PeopleSelectionPanel.css";

export default function PeopleSelectionPanel() {
    const atHome = useSelector(isAtHomeNode);
    const selecting = useSelector((state: ClientState) => state.people.selecting);
    const sortAlpha = useSelector((state: ClientState) => state.people.sortAlpha);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (!atHome) {
        return null;
    }

    const onSelectClick = () => {
        if (!selecting) {
            dispatch(peopleStartSelection());
        } else {
            dispatch(peopleStopSelection());
        }
    }

    const onSortClick = () => dispatch(peopleSetSort(!sortAlpha));

    return (
        <div className="people-panel">
            <div className="d-flex">
                <Button variant="outline-primary" size="sm" active={selecting} onClick={onSelectClick}>
                    <FontAwesomeIcon icon={faArrowPointer}/>
                    {" "}
                    {!selecting ? t("select") : t("clear-selection")}
                </Button>
                <PeopleSelectedButton/>
                <Button variant="outline-secondary" size="sm" className="ms-auto" active={sortAlpha}
                        onClick={onSortClick}>
                    <FontAwesomeIcon icon={faArrowDownAZ}/>
                </Button>
            </div>
            <PeopleSearch/>
        </div>
    );
}
