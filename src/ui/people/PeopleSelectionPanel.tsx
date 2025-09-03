import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { peopleSetSort, peopleStartSelection, peopleStopSelection } from "state/people/actions";
import { getPeopleContactsMaxInTabs, getPeopleContactsTotal } from "state/people/selectors";
import * as Browser from "ui/browser";
import { Button } from "ui/control";
import { Icon, msArrowSelectorToolFilled, msClose, msSort, msSortByAlpha } from "ui/material-symbols";
import PeopleSelectedButton from "ui/people/PeopleSelectedButton";
import PeopleSearch from "ui/people/PeopleSearch";
import "./PeopleSelectionPanel.css";

export default function PeopleSelectionPanel() {
    const atHome = useSelector(isAtHomeNode);
    const loadingGeneral = useSelector((state: ClientState) => state.people.loadingGeneral);
    const contactsTotal = useSelector(getPeopleContactsTotal);
    const contactsMax = useSelector(getPeopleContactsMaxInTabs);
    const selecting = useSelector((state: ClientState) => state.people.selecting);
    const sortAlpha = useSelector((state: ClientState) => state.people.sortAlpha);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (!atHome || loadingGeneral || contactsTotal === 0 || (!Browser.isDevMode() && contactsMax <= 12)) {
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
            <div className="d-flex gap-2">
                <Button variant="tool" title={!selecting ? t("select") : t("clear-selection")} onClick={onSelectClick}>
                    <Icon icon={!selecting ? msArrowSelectorToolFilled : msClose} size={20}/>
                </Button>
                <PeopleSelectedButton/>
                <PeopleSearch/>
                <Button variant="tool" className="ms-auto" onClick={onSortClick}>
                    <Icon icon={sortAlpha ? msSort : msSortByAlpha}/>
                </Button>
            </div>
        </div>
    );
}
